/* This example requires Tailwind CSS v2.0+ */
import { EnvelopeIcon, PhoneIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import ExamList from '../components/ExamList';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CreateExamModal from '../components/CreateExamModal';
import AddUserModal from '../components/AddUserModal';
import DeleteCohortModal from '../components/DeleteCohortModal';
import Notification from '../components/Notification';
import { SERVER_URL } from './../../variables';

const profile = {
    name: 'CSE 311.9',
    email: 'ricardo.cooper@example.com',
    avatar:
        'https://i.ibb.co/WfbCN6K/Untitled-1.png',
    backgroundImage:
        'https://images.unsplash.com/photo-1486520299386-6d106b22014b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
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
    const [newUserState, setNewUserState] = useState(false);


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [cohort, setCohort] = useState('');
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const cohortId = searchParams.get("c");


    const fetchCohort = async (token, cohortId) => {
        const rawResponse = await fetch(`${SERVER_URL}/cohorts/${cohortId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const content = await rawResponse.json();
        setCohort(content);
        // console.log(content.exams)
    }

    const fetchUser = async (token) => {
        const rawResponse = await fetch(`${SERVER_URL}/user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const content = await rawResponse.json();
        setName(content.user.name);
        setEmail(content.user.email);
        setRole(content.user.role);
    }

    useEffect(() => {

        fetchCohort(token, cohortId);
        fetchUser(token);
    }, [])

    const navigate = useNavigate();

    const deleteCohort = async (token, cohortId) => {
        const rawResponse = await fetch(`${SERVER_URL}/delete/cohort/${cohortId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const content = await rawResponse.json();
        console.log(content);
        navigate("/");
    }


    const [addStudentNotificationState, setAddStudentNotificationState] = useState(false);
    const [addStudentNotificationBody, setAddStudentNotificationBody] = useState("");





    return (
        <div>
            <Navbar name={name} email={email} role={role} token={token} getter={() => { }} />


            <div className="sm:mx-32 my-6">
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
                                {cohort.title ? <h1 className="truncate text-xl font-bold text-gray-700">{cohort.title}</h1> : <span className="text-gray-700 loading loading-dots loading-md"></span>}
                                {cohort.title ? <></> : <br />}
                                {cohort.description ? <p className="text-gray-500">{cohort.description}</p> : <span className="text-gray-700 loading loading-dots loading-xs"></span>}

                            </div>

                            {role === "faculty" ? <div className="mt-10"><div className={`justify-stretch ${cohort.title ? "mt-0.5" : ""} flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4`}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNewUserState(true);
                                    }}
                                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                >
                                    <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5 text-gray-700" aria-hidden="true" />
                                    <span>Add student</span>
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                >
                                    <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5 text-gray-700" aria-hidden="true" />
                                    <span>Edit</span>
                                </button>
                                <DeleteCohortModal
                                    cohortName={cohort.title}
                                    cohortDescription={cohort.description}
                                    state={deleteModalOpen}
                                    onCancel={() => setDeleteModalOpen(false)}
                                    onDelete={() => {
                                        setDeleteModalOpen(false);
                                        deleteCohort(token, cohortId);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalOpen(cohort.title ? true : false)}
                                    className="bg-red-500 inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    <TrashIcon className="-ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />

                                    <span>Delete</span>
                                </button>
                            </div>
                            </div>
                                :
                                <></>
                            }

                        </div>
                    </div>
                    <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
                        <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>
                    </div>
                </div>
            </div>
            <ExamList cohort={cohort} role={role} />

            <Notification
                heading={"Sucessfully done!"}
                body={addStudentNotificationBody}
                state={addStudentNotificationState}
                getter={() => setAddStudentNotificationState(false)}
            />

            <AddUserModal
                state={newUserState}
                onSubmit={(message) => {
                    setAddStudentNotificationBody(`${message.added} student(s) added, ${message.invited} invited.`);
                    setNewUserState(false);
                    setAddStudentNotificationState(true);
                    setTimeout(() => {
                        setAddStudentNotificationState(false);
                    }, 5000);
                }
                }
                onCancel={() => {
                    setNewUserState(false);
                    // console.log("Canceled");
                }}
            />

        </div>
    )
}
