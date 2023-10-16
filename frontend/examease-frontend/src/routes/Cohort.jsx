/* This example requires Tailwind CSS v2.0+ */
import { EnvelopeIcon, PhoneIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import Navbar from '../components/Navbar';
import ExamList from '../components/ExamList';

const profile = {
    name: 'CSE 311.9',
    email: 'ricardo.cooper@example.com',
    avatar:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    backgroundImage:
        'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    fields: [
        ['Phone', '(555) 123-4567'],
        ['Email', 'ricardocooper@example.com'],
        ['Title', 'Senior Front-End Developer'],
        ['Team', 'Product Development'],
        ['Location', 'San Francisco'],
        ['Sits', 'Oasis, 4th floor'],
        ['Salary', '$145,000'],
        ['Birthday', 'June 8, 1990'],
    ],
}

export default function Cohort() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');


    return (
        <div>
            <Navbar name={name} email={email} role={role} token={token} getter={() => { }} />
            <div className="mx-10 my-6">
                <div>
                    <img className="rounded-t-lg h-32 w-full object-cover lg:h-48" src={profile.backgroundImage} alt="" />
                </div>
                <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                    <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                        <div className="flex">
                            <img className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src={profile.avatar} alt="" />
                        </div>
                        <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                            <div className="mt-12 min-w-0 flex-1 sm:hidden md:block">
                                <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>
                                <p>OK</p>
                            </div>
                            <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                                <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                >
                                    <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    <TrashIcon className="-ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />

                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
                        <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>
                    </div>
                </div>
            </div>
            <ExamList />

        </div>
    )
}
