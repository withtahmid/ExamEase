/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { PlusIcon as PlusIconMini } from '@heroicons/react/20/solid'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import ReactHtmlParser from 'react-html-parser';
import { useNavigate } from 'react-router-dom';
import Select from '../components/Select'
function getWhitespaces(n) {
    return '&nbsp;'.repeat(n);
}
let people = [
    { name: '10', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
]
const questionTypes = [
    { id: 1, name: 'MCQ' },
    { id: 2, name: 'Text' },
    { id: 2, name: 'Voice' }
];


let optionsType = [{
    id: 1,
    text: "Good",
    isCorrect: false,
    isEditOn: false
},
{
    id: 2,
    text: "Bad",
    isCorrect: true,
    isEditOn: true
}];




export default function NewQuestionModal(props) {
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [room, setRoom] = useState('');
    const [description, setDescription] = useState('');
    const naviage = useNavigate();
    const [questionType, setquestionType] = useState('MCQ');
    const [options, setOptions] = useState(optionsType);


    const toggleEdit = (e, index) => {
        e.preventDefault();
        let current = options;
        current[index].isEditOn ^= true;


        setOptions(current);

        console.log('good')
    }

    useEffect(() => {
        console.log('eff')
    }, [options])





    const getquestionType = (questionType) => {
        setquestionType(questionType);
    }

    const faculty = props.faculty;

    const handleSubmit = async (e) => {
        e.preventDefault();


        const rawResponse = await fetch('http://localhost:3000/createnewcohort', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.token}`
            },
            body: JSON.stringify({
                "cohortName": name
            })
        });
        const content = await rawResponse.json();

        props.getter(content);

        console.log(content);


        console.log(`${name} ${section} ${room} ${description}`);
        props.onSubmit();
        // naviage('/');

    }

    return (
        <Transition.Root show={props.state} as={Fragment}>
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

                                                <h2 className="text-center	 text-xl font-semibold leading-9 tracking-tight text-gray-900"> Create new question</h2>
                                                {/* <p className="invisible text-sm text-gray-600">Use a permanent address where you can receive mail.</p> */}
                                                {/* <div dangerouslySetInnerHTML={getWhitespaces(200)}></div> */}

                                                {ReactHtmlParser(getWhitespaces(200))}

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
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            // defaultValue={''}
                                                            />
                                                        </div>
                                                        {/* <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p> */}
                                                    </div>
                                                    <div className="sm:col-span-3">
                                                    </div>


                                                    <div>
                                                        <h2>{options[0].id}</h2>
                                                    </div>

                                                    <div className="col-span-full">
                                                        <Select
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
                                                    <div>
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
                                                                                onClick={() => { setOptions(options.concat(optionsType)) }}
                                                                                type="button"
                                                                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                            >
                                                                                Add
                                                                            </button>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                                    {options.map((option, optionIdx) => (
                                                                        <tr key={optionIdx}>

                                                                            {
                                                                                option.isEditOn ?
                                                                                    <td>
                                                                                        <div className="mx-1 sm:col-span-3 col-span-2 w-full">

                                                                                            <div className="mt-2">
                                                                                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        name="username"
                                                                                                        id="username"
                                                                                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td> :
                                                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                                        {option.text}
                                                                                    </td>
                                                                            }



                                                                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                                                                <div className="flex h-5 items-center">
                                                                                    <input
                                                                                        checked={option.isCorrect}
                                                                                        onChange={() => { }}
                                                                                        id="comments"
                                                                                        aria-describedby="comments-description"
                                                                                        name="comments"
                                                                                        type="checkbox"
                                                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                                    />
                                                                                </div>
                                                                            </td>

                                                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => { toggleEdit(e, optionIdx) }}
                                                                                    className="mr-2 text-indigo-600 hover:text-indigo-900">
                                                                                    {option.isEditOn ? "OK" : "Edit"}<span className="sr-only">, {option.text}</span>
                                                                                </button>
                                                                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                                                    Delete<span className="sr-only">, {option.text}</span>
                                                                                </a>
                                                                            </td>

                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>

                                                    <div className="sm:col-span-2 sm:col-start-1">
                                                        <label htmlFor="section" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Full mark
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                value={section}
                                                                onChange={(e) => { setSection(e.target.value) }}
                                                                type="text"
                                                                name="section"
                                                                id="section"
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
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                        >
                                            Create
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
