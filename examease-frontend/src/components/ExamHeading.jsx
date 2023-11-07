import { Fragment } from 'react'
import {
    BoltIcon,
    BriefcaseIcon,
    CalendarIcon,
    CheckIcon,
    ChevronDownIcon,
    ClockIcon,
    CurrencyDollarIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon,
    StarIcon,
    XMarkIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ExamHeading({ heading, onSave, saveStatus, published, role, examDuration, totalMarks, graded, mode }) {
    return (
        <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
                <div className="flex flex-row items-center">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {heading}
                    </h2>
                    <div className="ml-2">
                        {role === "student" && graded && mode !== "Dispute" ?
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Graded
                            </span>
                            : <></>
                        }
                    </div>
                </div>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                    {mode !== "Dispute" ?
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-indigo-500" aria-hidden="true" />
                            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                {`${examDuration} minute${examDuration > 1 ? 's' : ''}`}
                            </span>
                        </div>
                        :
                        <></>
                    }
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <StarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {`${totalMarks} mark${totalMarks > 1 ? 's' : ''}`}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex sm:flex-row flex-col lg:ml-4 lg:mt-0">


                <span className="ml-3 mt-1">
                    {
                        mode !== "Dispute" ?
                            <span className="inline-flex items-center rounded-full bg-green-400 px-2.5 py-0.5 text-xs font-medium text-gray-50">
                                <CheckIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                {saveStatus}
                            </span>
                            :
                            <></>
                    }
                </span>

                <span className="ml-3 hidden sm:block">
                    {saveStatus !== "Submitted!" ?
                        <button
                            type="button"
                            disabled={role === "faculty"}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <XMarkIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Cancel
                        </button>
                        : <></>
                    }
                </span>


                <span className="sm:ml-3">
                    {!published || mode === "Dispute" ?
                        <button
                            disabled={saveStatus === "Submitted!" || role === "faculty"}
                            type="button"
                            onClick={onSave}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >


                            {saveStatus === "Submitting..." ?
                                <div aria-label="Loading..." role="status">
                                    <svg className="animate-spin -ml-0.5 mr-1.5 w-4 h-4 fill-white" viewBox="3 3 18 18">
                                        <path className="opacity-40" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                        </path>
                                        <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                        </path>
                                    </svg>
                                </div>
                                :
                                saveStatus === "Submitted!" ?
                                    <CheckCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                    :
                                    <CheckIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />

                            }

                            {saveStatus === "Submitted!" ? `${mode === "Dispute" ? "Resolved" : "Turned in"}` : `${mode === "Dispute" ? "Resolve" : "Turn in"}`}

                        </button>
                        :
                        <></>
                    }
                </span>




            </div>
        </div>
    )
}
