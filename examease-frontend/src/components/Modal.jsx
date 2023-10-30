/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom';

function getWhitespaces(n) {
    return '&nbsp;'.repeat(n);
}


function getColor() {
    const colors = ['pink-600', 'purple-600', 'yellow-500', 'green-500'];
    return colors[Math.floor(Math.random() * 4)];
}
function getColorIndex() {
    return Math.floor(Math.random() * 4);
}

export default function Modal(props) {
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [room, setRoom] = useState('');
    const [description, setDescription] = useState('');
    const naviage = useNavigate();

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
                "cohortName": name,
                "description": description,
                "color": getColorIndex()
            })
        });
        const content = await rawResponse.json();

        console.log(content);
        props.getter(content);


        setName('');
        setDescription('');
        setSection('');
        setRoom('');

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

                                                <h2 className="text-center	 text-xl font-semibold leading-9 tracking-tight text-gray-900"> Create new cohort</h2>
                                                {/* <p className="invisible text-sm text-gray-600">Use a permanent address where you can receive mail.</p> */}
                                                {/* <div dangerouslySetInnerHTML={getWhitespaces(200)}></div> */}

                                                <p dangerouslySetInnerHTML={{ __html: getWhitespaces(200) }}></p>

                                                <div className=" flex flex-col space-y-4">
                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Cohort name
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                value={name}
                                                                onChange={(e) => { setName(e.target.value) }}
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>




                                                    <div className="col-span-full">
                                                        <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
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
                                                        </div>
                                                    </div>

                                                    {/* <div className="sm:col-span-2 sm:col-start-1">
                                                        <label htmlFor="section" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Section
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

                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="room" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Room
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                value={room}
                                                                onChange={(e) => { setRoom(e.target.value) }}
                                                                type="text"
                                                                name="room"
                                                                id="room"
                                                                autoComplete="address-level1"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div> */}

                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Description (Optional)
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
