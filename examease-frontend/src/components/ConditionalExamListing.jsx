import { CheckCircleIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import React from 'react'
import { useNavigate } from 'react-router-dom';

import moment from "moment";
import { CheckBadgeIcon, EyeIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

function getColor(index) {
    const colors = ['bg-pink-600', 'bg-purple-600', 'bg-yellow-500', 'bg-green-500'];
    return colors[index];
}
function getInitials(name) {
    let words = name.split(' ');
    if (words.length === 1) {
        return name.substring(0, 2).toUpperCase();
    }
    return (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase();
}
const getExamStatus = (startTime, endTime) => {
    const now = new Date();
    // console.log(now + " " + new Date(startTime));
    if (now > new Date(endTime)) {
        return `Finished ${moment(new Date(endTime)).from(now)}`;
    }
    if (now >= new Date(startTime) && now <= new Date(endTime)) {
        return `Available now. Ends in ${moment(new Date(endTime)).from(now)}`;
    }
    return `Starts ${moment(new Date(startTime)).from(now)}`;

}

function getSortedExams(exams, comparator) {
    exams.sort(comparator);
    return exams;
};


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ConditionalExamListing({ heading, exams, comparator, cohort, role }) {
    const naviagate = useNavigate();
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');


    const publishExam = async (examId) => {
        const rawResponse = await fetch(`http://localhost:3000/publishexam`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                targetExamId: examId,
                published: true
            })

        });


        const content = await rawResponse.json();
        console.log(content);
    }


    const handleGrading = async (examId) => {
        const rawResponse = await fetch(`http://localhost:3000/autoevaluate`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                targetExamId: examId
            })

        });


        const content = await rawResponse.json();
        console.log(content);
    }

    return (
        <>
            {exams && exams.length === 0 ? <></> :
                <div className="flex flex-row space-x-2">
                    <h2 className="text-sm font-medium text-gray-500">{heading}</h2>
                    {!exams ? <span className="loading loading-dots loading-md font-medium text-gray-500"></span> : <></>}
                </div>
            }

            <ul role="list" className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2 lg:grid-cols-4">
                {exams && getSortedExams(exams, comparator).map((exam) => (
                    <li key={exam._id} className="col-span-4 flex rounded-md shadow-sm">
                        <div
                            className={classNames(
                                `${getColor(exam.color)}`,
                                'flex-shrink-0 flex items-center justify-center w-16 text-white text-2xl font-medium rounded-l-md'
                            )}
                        >
                            {getInitials(exam.title)}
                        </div>
                        <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                            <div className="flex-1 truncate px-4 py-2 text-sm">
                                <a href={role === "student" && exam.status !== "past" ? "#" : `/questions?examId=${exam._id}&c=${cohort._id}`} className="font-medium text-gray-900 hover:text-gray-600">
                                    {exam.title}
                                </a>
                                {exam.status !== "past" ?
                                    < span className="mx-2 inline-flex items-center rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-800">
                                        {`${exam.duration} minutes`}
                                    </span>
                                    :
                                    <></>
                                }
                                {/* <p className="text-gray-500">{20} Members</p> */}
                                <p className="text-gray-500">{exam.description}</p>
                                {/* <p className="text-gray-500">{moment(new Date(exam.startTime)).from(new Date())}</p> */}
                                {/* {new Date(exam.startTime)< new Date() ? new Date(exam.endTime) > new Date() ? "Now" : "0" : "0"} */}

                                <p className="text-gray-500">{getExamStatus(exam.startTime, exam.endTime)}</p>

                            </div>
                            <div className={
                                `flex-shrink-0 pr-2 space-x-4 ${role === "faculty" ? "" : "mx-4"}`
                            }>
                                {role === "faculty" && exam.status === "past" ?
                                    <button
                                        disabled={exam.graded ? true : false}
                                        onClick={() => { handleGrading(exam._id) }}
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        {exam.graded ? "Graded" : "Grade"}
                                        <CheckBadgeIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                                    </button>
                                    :
                                    <></>
                                }
                                {role === "faculty" || (role === "student" &&exam.status === "past") ?
                                    <button
                                        onClick={() => { naviagate(`/questions?examId=${exam._id}&c=${cohort._id}`) }}
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        {role === "faculty" ? "View" : getExamStatus(exam.startTime, exam.endTime).includes("Available") ? "Start" : "Details"}
                                        <EyeIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                                    </button>
                                    : <></>
                                }
                                {role === "faculty" && exam.status === "past" ?
                                    <button
                                        onClick={() => publishExam(exam._id)}
                                        type="button"
                                        disabled={exam.published ? true : false}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        {exam.published ? "Published" : "Pusblish"}
                                        {exam.published ?
                                            <CheckBadgeIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                                            :
                                            <RocketLaunchIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />}

                                    </button>
                                    :
                                    <></>
                                }

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
            </ul >
        </>
    )
}
