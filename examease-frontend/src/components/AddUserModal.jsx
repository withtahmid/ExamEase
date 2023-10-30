/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Select from './Select';
import ExamList from './ExamList';
import { PlusCircleIcon } from '@heroicons/react/20/solid';

function getWhitespaces(n) {
    return '&nbsp;'.repeat(n);
}

function formatDateandTime(dateStr, timeStr) {
    const date = new Date(`${dateStr} ${timeStr}`);
    return date;
}
const questionTypes = [
    { id: 1, name: 'MCQ' },
    { id: 2, name: 'Text' },
    { id: 3, name: 'Voice' }
];


export default function AddUserModal(props) {
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [room, setRoom] = useState('');
    const [description, setDescription] = useState('');
    const naviage = useNavigate();
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');



    const [examName, setExamName] = useState('');
    const [examDuration, setExamDuration] = useState('');


    const [startTime, setStartTime] = useState('');
    const [startDate, setStartDate] = useState('');


    const [finishTime, setFinishTime] = useState('');
    const [finishDate, setFinishDate] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();
    const cohortId = searchParams.get("c");



    const [students, setStudents] = useState([{ id: 0, email: "" }]);







    const handleSubmit = async (e) => {
        e.preventDefault();
        let send = [];
        for (let i = 0; i < students.length; ++i) {
            if (students[i].email !== "") send.push(students[i].email);
        }
        console.log(send)

        const rawResponse = await fetch('http://localhost:3000/addstudenttocohort', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                targetCohortId: cohortId,
                students: send

            })
        });
        const content = await rawResponse.json();

        console.log(content)


        props.onSubmit();
        // naviage('/');

    }


    const onChangeInput = (e, id) => {
        const { name, value } = e.target;
        const editData = students.map((item) => item.id === id && name ? { ...item, [name]: value } : item)
        setStudents(editData)
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

                                                <h2 className="text-center	 text-xl font-semibold leading-9 tracking-tight text-gray-900"> Add student(s)</h2>
                                                {/* <p className="invisible text-sm text-gray-600">Use a permanent address where you can receive mail.</p> */}
                                                {/* <div dangerouslySetInnerHTML={getWhitespaces(200)}></div> */}


                                                <p dangerouslySetInnerHTML={{ __html: getWhitespaces(200) }}></p>

                                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Student email
                                                </label>
                                                {students.map(({ id, email }, idx) => (
                                                    <div key={id}>
                                                        <div className="flex flex-row space-x-2">
                                                            <div className="mt-2 w-10/12">
                                                                <input
                                                                    value={email}
                                                                    onChange={(e) => {
                                                                        onChangeInput(e, id);
                                                                    }}
                                                                    type="email"
                                                                    // placeholder='9:00 AM'
                                                                    name="email"
                                                                    id="email"
                                                                    autoComplete="address-level2"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>

                                                            {
                                                                idx === students.length - 1 ?
                                                                    <div className="mt-2">
                                                                        <a
                                                                            href='#'
                                                                            type="button"
                                                                            id="isEditOpen"
                                                                            name="isEditOpen"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                setStudents(students.concat([{ id: idx + 1, email: "" }]));
                                                                                // setStudents(students.push(""));
                                                                            }}
                                                                            className="mr-2 text-indigo-600 hover:text-indigo-900">
                                                                            <PlusCircleIcon className="mr-2 h-8 w-8 text-indigo-600 hover:text-indigo-700" />
                                                                        </a>
                                                                    </div>
                                                                    :
                                                                    <></>
                                                            }


                                                        </div>
                                                    </div>
                                                ))}



                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                        >
                                            Save
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
