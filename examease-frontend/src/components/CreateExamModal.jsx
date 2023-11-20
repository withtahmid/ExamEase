/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Select from './Select';
import NewQuestionModal from './NewQuestionModal';
import ExamTimePicker from './ExamTimePicker';
import Notification from './Notification';
import { SERVER_URL } from './../../variables';

function getWhitespaces(n) {
    return '&nbsp;'.repeat(n);
}

function formatDateandTime(dateStr, timeStr) {
    const date = new Date(`${dateStr} ${timeStr}`);
    return date;
}
function getColorIndex() {
    return Math.floor(Math.random() * 4);
}



export default function CreateExamModal(props) {
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [room, setRoom] = useState('');
    const [description, setDescription] = useState('');
    const naviage = useNavigate();
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');

    // console.log(token)

    const [examName, setExamName] = useState('');
    const [examDescription, setExamDescription] = useState('');
    const [examDuration, setExamDuration] = useState('');


    const [startTime, setStartTime] = useState('');
    const [startDate, setStartDate] = useState('');


    const [finishTime, setFinishTime] = useState('');
    const [finishDate, setFinishDate] = useState('');

    const [saveStatus, setSaveStatus] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();
    const cohortId = searchParams.get("c");



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('Creating...');


        try {
            const rawResponse = await fetch(`${SERVER_URL}/createexam`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    targetCohortId: cohortId,
                    title: examName,
                    color: getColorIndex(),
                    description: examDescription,
                    startTime: startTime,
                    endTime: finishTime,
                    duration: examDuration,
                    graded: false,
                    published: false
                })
            });

            console.log(JSON.stringify({
                targetCohortId: cohortId,
                title: examName,
                color: getColorIndex(),
                description: examDescription,
                startTime: startTime,
                endTime: finishTime,
                duration: examDuration
            }))
            const content = await rawResponse.json();

            if (content.success) {
                setSaveStatus('Created!');
                setExamName('');
                setExamDuration('');
                setStartTime('');
                setStartDate('');
                setFinishTime('');
                setFinishDate('');
                props.onSubmit(`${examName} has been created.`);

            } else {
                setSaveStatus(content.message);
            }

            console.log(content);


        } catch (err) {
            setSaveStatus('Failed!');

        }

    }

    const getStartTime = (data) => {
        setStartTime(data);
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

                                                <h2 className="text-center	 text-xl font-semibold leading-9 tracking-tight text-gray-900"> Create new exam</h2>
                                                {/* <p className="invisible text-sm text-gray-600">Use a permanent address where you can receive mail.</p> */}
                                                {/* <div dangerouslySetInnerHTML={getWhitespaces(200)}></div> */}


                                                <p dangerouslySetInnerHTML={{ __html: getWhitespaces(200) }}></p>


                                                <div className="flex flex-col space-y-4">
                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Exam name
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                value={examName}
                                                                onChange={(e) => { setExamName(e.target.value) }}
                                                                type="text"
                                                                name="examName"
                                                                id="examName"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Description
                                                        </label>
                                                        <div className="mt-2">
                                                            <textarea
                                                                value={examDescription}
                                                                onChange={(e) => { setExamDescription(e.target.value) }}
                                                                id="examDescription"
                                                                name="examDescription"
                                                                rows={3}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            // defaultValue={''}
                                                            />
                                                        </div>
                                                        {/* <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p> */}
                                                    </div>


                                                    <div className="sm:col-span-2 sm:col-start-1">
                                                        <label htmlFor="section" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Available from
                                                        </label>
                                                        <div className="flex flex-row space-x-2 mt-2">
                                                            <ExamTimePicker getter={setStartTime} />
                                                            {/* <div className="mt-2 w-48">
                                                                <input
                                                                    value={startTime}
                                                                    onChange={(e) => { setStartTime(e.target.value) }}
                                                                    type="text"
                                                                    placeholder='9:00 AM'
                                                                    name="startTime"
                                                                    id="startTime"
                                                                    autoComplete="address-level2"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>

                                                            <div className="mt-2">
                                                                
                                                                <input
                                                                    value={startDate}
                                                                    onChange={(e) => { setStartDate(e.target.value) }}
                                                                    type="text"
                                                                    name="startDate"
                                                                    id="startDate"
                                                                    placeholder='MM/DD/YYYY'
                                                                    autoComplete="address-level2"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div> */}

                                                        </div>

                                                    </div>
                                                    <div className="sm:col-span-2 sm:col-start-1">
                                                        <label htmlFor="section" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Available upto
                                                        </label>
                                                        <div className="flex flex-row space-x-2 mt-2">
                                                            <ExamTimePicker getter={setFinishTime} />
                                                            {/* <div className="mt-2 w-48">
                                                                <input
                                                                    value={finishTime}
                                                                    onChange={(e) => { setFinishTime(e.target.value) }}
                                                                    type="text"
                                                                    placeholder='9:00 AM'
                                                                    name="finishTime"
                                                                    id="finishTime"
                                                                    autoComplete="address-level2"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>

                                                            <div className="mt-2">
                                                                <input
                                                                    value={finishDate}
                                                                    onChange={(e) => { setFinishDate(e.target.value) }}
                                                                    type="text"
                                                                    name="finishDate"
                                                                    id="finishDate"
                                                                    placeholder='MM/DD/YYYY'
                                                                    autoComplete="address-level2"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div> */}

                                                        </div>

                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="room" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Duration (minutes)
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                value={examDuration}
                                                                onChange={(e) => { setExamDuration(e.target.value) }}
                                                                type="text"
                                                                name="examDuration"
                                                                id="examDuration"
                                                                placeholder='60'
                                                                autoComplete="address-level1"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {saveStatus.length > 12 ?
                                        <div className="mt-3 -mb-2 rounded-md bg-red-50 p-2">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <InformationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                                </div>
                                                <div className="ml-3 flex-1 md:flex md:justify-between">
                                                    <p className="text-sm text-red-800">{saveStatus}</p>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <></>
                                    }


                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">

                                        <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                        >
                                            Create
                                            {saveStatus === "Creating..." ?
                                                <svg className="animate-spin ml-3 w-5 h-5 fill-white" viewBox="3 3 18 18">
                                                    <path className="opacity-40" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                                    </path>
                                                    <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                                    </path>
                                                </svg>
                                                :
                                                <>
                                                </>
                                            }
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
