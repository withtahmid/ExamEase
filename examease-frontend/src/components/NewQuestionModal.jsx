/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { PlusIcon as PlusIconMini } from '@heroicons/react/20/solid'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'

import { useNavigate, useSearchParams } from 'react-router-dom';
import Select from '../components/Select'
import Recorder from './Recorder'
function getWhitespaces(n) {
    return '&nbsp;'.repeat(n);
}
let people = [
    { name: '10', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
]
const questionTypes = [
    { id: 1, name: 'Written' },
    { id: 2, name: 'MCQ' },
    { id: 3, name: 'Viva' }
];


let optionsType = [
    {
        id: 1,
        text: "",
        isCorrect: false,
        isEditOpen: true
    },
    {
        id: 2,
        text: "",
        isCorrect: false,
        isEditOpen: true
    }
];




const getOptionsType = (mcqOptions, mcqAnswer) => {
    let ret = [];
    for (let i = 0; i < mcqOptions.length; ++i) {
        let option = {
            id: i + 1,
            text: mcqOptions[i],
            isCorrect: mcqAnswer.charAt(i) === "1",
            isEditOpen: false
        }
        ret.push(option);

    }
    return ret;

}



export default function NewQuestionModal(props) {
    const naviage = useNavigate();
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');

    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [room, setRoom] = useState('');


    const [description, setDescription] = useState('');
    const [questionType, setquestionType] = useState('MCQ');
    const [score, setScore] = useState(1);


    const [counter, setCounter] = useState(3);




    // MCQ ONLY
    const [options, setOptions] = useState(optionsType);
    const [title, setTitle] = useState('');

    // Text Only
    const [answer, setAnswer] = useState('');


    useEffect(() => {
        if (props.callStack.now === "add" && props.callStack.prev !== "add") {
            setTitle('');
            setDescription('');
            setquestionType('MCQ');
            setAnswer('');
            setScore(1);
            setOptions(optionsType);
            setCounter(3);
        }

    }, [props.callStack])

    // Edit mode
    useEffect(() => {
        if (props.state) {
            console.log(props.state)
            setTitle(props.state.type === "mcq" ? props.state.title : props.state.description);
            setDescription(props.state.description);
            setquestionType(props.state.type === "mcq" ? "MCQ" : props.state.type === "viva" ? "Viva" : "Written");
            setAnswer(props.state.textAnswer);
            setScore(props.state.score);

            if (props.state.type === "mcq") {
                setOptions(getOptionsType(props.state.mcqOptions, props.state.mcqAnswer));
                setCounter(Math.max(3, props.state.mcqOptions.length + 1));
            }
        }

    }, [props.state]);



    const toggleEdit = (id) => {
        let current = options;
        for (let i = 0; i < current.length; ++i) {
            if (current[i].id === id) {
                current[i].isEditOpen ^= true;
            }
        }
        setOptions(current);
    }
    const onDelete = (id) => {
        if (options.length === 2) return;
        let current = [];
        for (let i = 0; i < options.length; ++i) {
            if (options[i].id !== id) {
                current.push(options[i]);
            }
            setOptions(current);
        }
    }


    // 
    const onChangeInput = (e, id) => {
        const { name, value } = e.target;


        const toggleCorrect = options.map((item) => item.id === id && name ? { ...item, [name]: item.isCorrect ^ true } : item)
        const toggleOpen = options.map((item) => item.id === id && name ? { ...item, [name]: item.isEditOpen ^ true } : item)
        const editData = options.map((item) => item.id === id && name ? { ...item, [name]: value } : item)


        if (name.toString() === 'isEditOpen') {
            setOptions(toggleOpen);
            return;
        }
        if (name.toString() === 'isCorrect') {
            setOptions(toggleCorrect);
            return;
        }

        setOptions(editData)
    }

    // console.log(token)

    const getquestionType = (questionType) => {
        // console.log(questionType)
        setquestionType(questionType);
    }

    const faculty = props.faculty;



    const [searchParams, setSearchParams] = useSearchParams();
    const examId = searchParams.get("examId");
    const cohortId = searchParams.get("c");


    const handleSubmit = async (e) => {
        e.preventDefault();



        const parseOptions = () => {
            let ret = {
                mcqOptions: [],
                mcqAnswers: ""
            }
            if (questionType.toLowerCase() !== "mcq") {
                return ret;
            }
            for (let i = 0; i < options.length; ++i) {
                ret.mcqOptions.push(options[i].text);
                ret.mcqAnswers += options[i].isCorrect ? '1' : '0';
            }
            return ret;
        }

        console.log(1)


        const rawResponse = await fetch(`http://localhost:3000/${props.callStack.now === "delete" ? "delete/question" : "addquestion"}/${props.state ? props.state._id : ""}`, {
            method: props.callStack.now === "delete" ? 'DELETE' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                targetExamId: examId,
                targetCohortId: cohortId,
                question: {
                    type: questionType.toLowerCase(),
                    score: score,
                    title: questionType.toLowerCase() === "mcq" ? title : description,
                    description: description,
                    mcqOptions: parseOptions().mcqOptions,
                    mcqAnswer: parseOptions().mcqAnswers,
                    textAnswer: answer

                }
            })
        });

        console.log(JSON.stringify({
            targetExamId: examId,
            targetCohortId: cohortId,
            question: {
                type: questionType.toLowerCase(),
                score: score,
                title: questionType.toLowerCase() === "mcq" ? title : description,
                description: description,
                mcqOptions: parseOptions().mcqOptions,
                mcqAnswer: parseOptions().mcqAnswers,
                textAnswer: answer

            }
        }))


        const content = await rawResponse.json();

        console.log(content);
        props.onSubmit();


        setTitle('');
        setDescription('');
        setquestionType('MCQ');
        setAnswer('');
        setScore(1);
        setOptions(optionsType);
        setCounter(3);
    }
    return (
        <Transition.Root show={props.modalState} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={props.onCancel}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>



                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <form action="#" method="POST" onSubmit={handleSubmit}>
                                    <div>
                                        {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                    </div> */}


                                        <div className="mt-2 sm:mt-2">
                                            {/* <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                            Payment successful
                                        </Dialog.Title> */}
                                            <div className="">

                                                <h2 className="text-center	 text-xl font-semibold leading-9 tracking-tight text-gray-900">
                                                    {props.callStack.now === "add" ? "Add new question" : props.callStack.now === "edit" ? "Edit question" : "Delete question"}
                                                </h2>
                                                {/* <p className="invisible text-sm text-gray-600">Use a permanent address where you can receive mail.</p> */}
                                                {/* <div dangerouslySetInnerHTML={getWhitespaces(200)}></div> */}

                                                <p dangerouslySetInnerHTML={{ __html: getWhitespaces(200) }}></p>

                                                <div className=" flex flex-col space-y-4">
                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Question statement
                                                        </label>
                                                        <div className="mt-2">
                                                            <textarea
                                                                value={description}
                                                                onChange={(e) => { setDescription(e.target.value) }}
                                                                id="description"
                                                                name="description"
                                                                rows={3}
                                                                placeholder="e.g. What is the smallest prime number?"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            // defaultValue={''}
                                                            />
                                                        </div>
                                                        {/* <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p> */}
                                                    </div>
                                                    <div className="sm:col-span-3">
                                                    </div>


                                                    {/* <div>
                                                        <h2>{options[0].id}</h2>
                                                    </div> */}

                                                    <div className="col-span-full">
                                                        <Select
                                                            current={questionType == "MCQ" ? 1 : questionType == "Viva" ? 2 : 0}
                                                            heading={'Question type'}
                                                            getter={getquestionType}
                                                            options={questionTypes} />
                                                        {/* <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
                                                            Faculty
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="text"
                                                                name="faculty"
                                                                id="faculty"
                                                                defaultValue={faculty}
                                                                disabled
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                                                            />
                                                        </div> */}
                                                    </div>
                                                    {questionType.toUpperCase() === 'MCQ' ?
                                                        <div>

                                                            <div className="mb-2 sm:col-span-2 sm:col-start-1">
                                                                <label htmlFor="section" className="block text-sm font-medium leading-6 text-gray-900">
                                                                    Instruction(s)
                                                                </label>
                                                                <div className="mt-2">
                                                                    <input
                                                                        value={title}
                                                                        onChange={(e) => { setTitle(e.target.value) }}
                                                                        type="text"
                                                                        name="title"
                                                                        id="title"
                                                                        placeholder="e.g. Choose the correct option"
                                                                        autoComplete="address-level2"
                                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* MCQ OPTIONS START */}
                                                            <label htmlFor="section" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Options
                                                            </label>

                                                            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
                                                                <table className="min-w-full divide-y divide-gray-300">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                                Option
                                                                            </th>
                                                                            <th
                                                                                scope="col"
                                                                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                                                                            >
                                                                                Correct?
                                                                            </th>

                                                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setCounter((prev) => prev + 1);
                                                                                        options.length < 6 ?
                                                                                            setOptions(options.concat({
                                                                                                id: counter + 1,
                                                                                                text: "",
                                                                                                isCorrect: false,
                                                                                                isEditOpen: true
                                                                                            })) : {}
                                                                                    }}
                                                                                    type="button"
                                                                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                                >
                                                                                    Add option
                                                                                </button>
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-200 bg-white">
                                                                        {options.map(({ id, text, isCorrect, isEditOpen }, index) => (
                                                                            <tr key={id}>
                                                                                {
                                                                                    isEditOpen ?
                                                                                        <td>
                                                                                            <div className="mx-1 sm:col-span-3 col-span-2 w-full">

                                                                                                <div className="mt-2">
                                                                                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                                                                        <input
                                                                                                            value={text}
                                                                                                            required
                                                                                                            onChange={(e) => { onChangeInput(e, id) }}
                                                                                                            type="text"
                                                                                                            name="text"
                                                                                                            id="text"
                                                                                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td> :
                                                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                                            {text}
                                                                                        </td>
                                                                                }



                                                                                <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                                                                    <div className="flex h-5 items-center">
                                                                                        <input
                                                                                            checked={isCorrect}
                                                                                            onChange={(e) => { onChangeInput(e, id) }}
                                                                                            id="isCorrect"
                                                                                            aria-describedby="comments-description"
                                                                                            name="isCorrect"
                                                                                            type="checkbox"
                                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                                        />
                                                                                    </div>
                                                                                </td>

                                                                                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                                    <a
                                                                                        href='#'
                                                                                        // type="button"
                                                                                        id="isEditOpen"
                                                                                        name="isEditOpen"
                                                                                        onClick={(e) => { onChangeInput(e, id) }}
                                                                                        className="mr-2 text-indigo-600 hover:text-indigo-900">
                                                                                        {isEditOpen ? "OK" : "Edit"}
                                                                                    </a>
                                                                                    <a href="#"
                                                                                        id="delete"
                                                                                        name="delete"
                                                                                        onClick={() => { onDelete(id) }}
                                                                                        className="text-indigo-600 hover:text-indigo-900">
                                                                                        Delete
                                                                                    </a>
                                                                                </td>

                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>

                                                            </div>

                                                            {/* MCQ OPTIONS END */}
                                                        </div>
                                                        :
                                                        <div className="sm:col-span-2">
                                                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Answer
                                                            </label>
                                                            <div className="mt-2">
                                                                <textarea
                                                                    placeholder="e.g. 2 is the smallest (and only even) prime number"
                                                                    value={answer}
                                                                    onChange={(e) => { setAnswer(e.target.value) }}
                                                                    id="answer"
                                                                    name="answer"
                                                                    rows={3}
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                // defaultValue={''}
                                                                />
                                                            </div>
                                                            {/* <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p> */}
                                                        </div>

                                                    }

                                                    <div className="sm:col-span-2 sm:col-start-1">
                                                        <label htmlFor="section" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Full mark
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                value={score}
                                                                onChange={(e) => { setScore(parseInt(e.target.value)) }}
                                                                type="text"
                                                                name="score"
                                                                id="score"
                                                                autoComplete="address-level2"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <button
                                            type="submit"
                                            className={
                                                props.callStack.now === "delete" ?
                                                    `inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm`
                                                    :
                                                    `inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm`
                                            }
                                        >
                                            {props.callStack.now === "edit" ? "Update" : props.callStack.now === "delete" ? "Delete" : "Create"}
                                        </button>
                                        <button
                                            onClick={props.onCancel}
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
