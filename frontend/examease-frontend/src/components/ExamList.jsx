/* This example requires Tailwind CSS v2.0+ */
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'

const projects = [
    { name: 'Graphssssssssssssssssssssssssssssssssssssssss API', initials: 'GA', href: '#', members: 16, bgColor: 'bg-pink-600' },
    { name: 'Component Design', initials: 'CD', href: '#', members: 12, bgColor: 'bg-purple-600' },
    { name: 'Templates', initials: 'T', href: '#', members: 16, bgColor: 'bg-yellow-500' },
    { name: 'React Components', initials: 'RC', href: '#', members: 8, bgColor: 'bg-green-500' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ExamList() {
    const naviagate = useNavigate();
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div class="flex flex-row justify-end items-end items-end">

                <h2 className=" text-sm font-medium text-gray-500">Current or past exams</h2>
                <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Create exam
                </button>
            </div>
            <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {projects.map((project) => (
                    <li key={project.name} className="col-span-4 flex rounded-md shadow-sm">
                        <div
                            className={classNames(
                                project.bgColor,
                                'flex-shrink-0 flex items-center justify-center w-16 text-white text-2xl font-medium rounded-l-md'
                            )}
                        >
                            {project.initials}
                        </div>
                        <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                            <div className="flex-1 truncate px-4 py-2 text-sm">
                                <a href={project.href} className="font-medium text-gray-900 hover:text-gray-600">
                                    {project.name}
                                </a>
                                <p className="text-gray-500">{project.members} Members</p>
                                <p className="text-gray-500">Starts in 2h</p>
                                <span className="-mx-1 inline-flex items-center rounded-lg bg-pink-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                    2 hours
                                </span>
                            </div>
                            <div className="flex-shrink-0 pr-2">
                                <button
                                    onClick={() => { naviagate('/questions') }}
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    View
                                </button>
                                {/* <button
                                    type="button"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <span className="sr-only">Open options</span>
                                    
                                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                                </button> */}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
