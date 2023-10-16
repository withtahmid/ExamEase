/* This example requires Tailwind CSS v2.0+ */
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function CohortList(props) {
    const [cohorts, setCohorts] = useState(props.cohorts);

    useEffect(() => {
        setCohorts(props.cohorts)
    }, [props])

    return (
        <div className='mx-auto' >
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <h2 className="text-sm font-medium text-gray-500">Currently enrolled cohorts</h2>
                <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {cohorts.map((project) => (
                        <li key={project.name} className="col-span-1 flex rounded-md shadow-sm">
                            <div
                                className={classNames(
                                    project.bgColor,
                                    'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md'
                                )}
                            >
                                {project.initials}
                            </div>
                            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                    <a href={project.href} className="font-medium text-gray-900 hover:text-gray-600">
                                        {project.name}
                                    </a>
                                    <p className="text-gray-500">Dr. Nabeel Mohammed</p>
                                    <p className="text-gray-500">SAC 209</p>
                                    {/* <p className="text-gray-500">{project.members} Members</p> */}
                                </div>
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
