/* This example requires Tailwind CSS v2.0+ */
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function CohortList(props) {
    const [cohorts, setCohorts] = useState(null);




    useEffect(() => {
        setCohorts(props.cohorts)
    }, [props])


    return (
        <div className='mx-auto'>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="flex flex-row space-x-2">
                    <h2 className="text-sm font-medium text-gray-500">Currently enrolled cohorts</h2>
                    {!cohorts ? <span className="loading loading-dots loading-md font-medium text-gray-500"></span> : <></>}
                </div>
                <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {cohorts && cohorts.map((cohort) => (
                        <li key={cohort.name} className="col-span-1 flex rounded-md shadow-sm">
                            <div
                                className={classNames(
                                    cohort.bgColor,
                                    'flex-shrink-0 flex items-center justify-center w-16 text-white text-xl font-medium rounded-l-md '
                                )}
                            >
                                <a href={cohort.href} className="font-medium text-white hover:text-white">
                                    {cohort.initials}
                                </a>
                            </div>
                            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r bg-white border-b border-gray-200 hover:bg-gray-200">
                                <a href={cohort.href}>
                                    <div className="flex-1 truncate px-4 py-2 text-sm">
                                        {/* <a href={cohort.href} className="font-medium text-gray-900 hover:text-gray-900">
                                            {cohort.name}
                                        </a> */}
                                        <p className="-mb-0.5 font-medium text-lg text-gray-900 hover:text-gray-900">{cohort.name}</p>
                                        <p className="text-gray-500 ">{cohort.description}</p>
                                        <p className="text-gray-700">{cohort.faculty}</p>
                                        <div className='flex flex-row'>
                                            <UsersIcon className="mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                                            <p className="text-gray-500">{`${cohort.members}`}</p>
                                        </div>
                                        {/* <p className="text-gray-500">{cohort.members} Members</p> */}
                                    </div>
                                </a>
                                {/* <div className="flex-shrink-0 pr-2">
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="sr-only">Open options</span>
                                        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div> */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
