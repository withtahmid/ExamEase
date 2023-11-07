import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { LinkIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'


export default function Slideover({ state, getter, onSubmit, onCancel }) {

    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    return (
        <Transition.Root show={state} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onCancel}>
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                                    <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                        <div className="h-0 flex-1 overflow-y-auto">
                                            <div className="bg-indigo-700 py-6 px-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <Dialog.Title className="text-lg font-medium text-white">New Dispute</Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                            onClick={onCancel}
                                                        >
                                                            <span className="sr-only">Close panel</span>
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-1">
                                                    <p className="text-sm text-indigo-300">
                                                        Fill the fields below to let the faculty know about your complaints.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="divide-y divide-gray-200 px-4 sm:px-6">
                                                    <div className="space-y-6 pt-6 pb-5">
                                                        <div>
                                                            <label htmlFor="project-name" className="block text-sm font-medium text-gray-900">
                                                                Subject
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    value={subject}
                                                                    onChange={(e) => setSubject(e.target.value)}
                                                                    placeholder="e.g. Unfair grading"
                                                                    type="text"
                                                                    name="project-name"
                                                                    id="project-name"
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                                                                Description
                                                            </label>
                                                            <div className="mt-1">
                                                                <textarea
                                                                    value={description}
                                                                    onChange={(e) => setDescription(e.target.value)}
                                                                    placeholder="e.g. My answer for question 3 is correct, yet I got a 0 on that."
                                                                    id="description"
                                                                    name="description"
                                                                    rows={4}
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        <fieldset>
                                                            <legend className="text-sm font-medium text-gray-900">Privacy</legend>
                                                            <div className="mt-2 space-y-5">
                                                                <div className="relative flex items-start">
                                                                    <div className="absolute flex h-5 items-center">
                                                                        <input
                                                                            id="privacy-public"
                                                                            name="privacy"
                                                                            aria-describedby="privacy-public-description"
                                                                            type="radio"
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                            defaultChecked
                                                                        />
                                                                    </div>
                                                                    <div className="pl-7 text-sm">
                                                                        <label htmlFor="privacy-public" className="font-medium text-gray-900">
                                                                            Public access
                                                                        </label>
                                                                        <p id="privacy-public-description" className="text-gray-500">
                                                                            Everyone with the link will see this project.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="relative flex items-start">
                                                                        <div className="absolute flex h-5 items-center">
                                                                            <input
                                                                                id="privacy-private-to-project"
                                                                                name="privacy"
                                                                                aria-describedby="privacy-private-to-project-description"
                                                                                type="radio"
                                                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                            />
                                                                        </div>
                                                                        <div className="pl-7 text-sm">
                                                                            <label htmlFor="privacy-private-to-project" className="font-medium text-gray-900">
                                                                                Private to project members
                                                                            </label>
                                                                            <p id="privacy-private-to-project-description" className="text-gray-500">
                                                                                Only members of this project would be able to access.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="relative flex items-start">
                                                                        <div className="absolute flex h-5 items-center">
                                                                            <input
                                                                                id="privacy-private"
                                                                                name="privacy"
                                                                                aria-describedby="privacy-private-to-project-description"
                                                                                type="radio"
                                                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                            />
                                                                        </div>
                                                                        <div className="pl-7 text-sm">
                                                                            <label htmlFor="privacy-private" className="font-medium text-gray-900">
                                                                                Private to you
                                                                            </label>
                                                                            <p id="privacy-private-description" className="text-gray-500">
                                                                                You are the only one able to access this project.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                    <div className="pt-4 pb-6">
                                                        <div className="flex text-sm">
                                                            <a
                                                                href="#"
                                                                className="group inline-flex items-center font-medium text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <LinkIcon
                                                                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-900"
                                                                    aria-hidden="true"
                                                                />
                                                                <span className="ml-2">Copy link</span>
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 flex text-sm">
                                                            <a href="#" className="group inline-flex items-center text-gray-500 hover:text-gray-900">
                                                                <QuestionMarkCircleIcon
                                                                    className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                                    aria-hidden="true"
                                                                />
                                                                <span className="ml-2">Learn more about sharing</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink-0 justify-end px-4 py-4">
                                            <button
                                                type="button"
                                                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={onCancel}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => onSubmit(subject, description)}
                                                type="button"
                                                className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
