import { CheckCircleIcon, CheckIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import moment from "moment";
import { ArrowRightCircleIcon, CheckBadgeIcon, ClipboardDocumentCheckIcon, EyeIcon, InformationCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import Notification from './Notification';
import Slideover from './Slideover';
import { SERVER_URL } from './../../variables';

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

    const [publishNotification, setPublishNotification] = useState(false);
    const [gradeNotification, setGradeNotification] = useState(false);

    const [saveStatus, setSaveStatus] = useState('');


    const publishExam = async (examId) => {
        setSaveStatus(`${examId} Publishing...`);
        const rawResponse = await fetch(`${SERVER_URL}/publishexam`, {
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
        setSaveStatus("Published!");
    }


    const handleGrading = async (examId) => {
        setSaveStatus(`${examId} Grading...`);
        const rawResponse = await fetch(`${SERVER_URL}/autoevaluate`, {
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

        setSaveStatus("Graded!");
    }


    const getStartButtonLabel = (exam) => {
        if (role === "faculty" || exam.status === "past") {
            return "Details";
        }
        if (!exam.myAnswerPaper) {
            return "Start";
        }
        let sec = Math.floor((Math.min(new Date(exam.endTime).getTime(), new Date(exam.myAnswerPaper.startTime).getTime() + exam.duration * 60 * 1000) - new Date().getTime()) / 1000);
        console.log(sec)
        return sec <= 0 || exam.myAnswerPaper.submitted ? "Details" : "Continue";
        // if () { role === "student" && exam.status !== "past" ? exam.myAnswerPaper ? "Continue" : "Start" : "Details" }


    };

    return (
        <>
            <Notification
                heading={"Successfully published!"}
                body={"Students can now see their grades."}
                state={publishNotification}
                getter={() => setPublishNotification(false)}
            />
            <Notification
                heading={"Successfully graded!"}
                body={"Students' answers has been graded."}
                state={gradeNotification}
                getter={() => setGradeNotification(false)}
            />
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
                        <div className="flex-col sm:flex-row sm:flex sm:flex-1 items-center justify-between sm:truncate sm:rounded-r-md sm:border-t sm:border-r sm:border-b border-gray-200 bg-white">
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
                                {exam.graded ?
                                    <span className="mx-2 inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                        Graded
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
                                `flex-shrink-0 pr-2 space-x-4 ml-4 sm:ml-0 mb-2 sm:mb-0 ${role === "faculty" ? "" : "mx-4"}`
                            }>
                                {role === "faculty" && exam.status !== "future" && !exam.graded ?
                                    <button
                                        disabled={exam.graded ? true : false}
                                        onClick={async () => {
                                            await handleGrading(exam._id);
                                            setGradeNotification(true);
                                            setTimeout(() => {
                                                setGradeNotification(false);
                                            }, 5000);
                                        }}
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        {exam.graded ? "Graded" : "Grade"}
                                        {exam.graded ?
                                            <CheckCircleIcon className="ml-1 -mr-1 h-5 w-5" aria-hidden="true" />
                                            :
                                            saveStatus === `${exam._id} Grading...` ?

                                                <svg className="animate-spin ml-2 -mr-0.5 w-4 h-4 fill-indigo-800" viewBox="3 3 18 18">
                                                    <path className="opacity-40" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                                    </path>
                                                    <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                                    </path>
                                                </svg> :
                                                <ClipboardDocumentCheckIcon className="ml-1 -mr-1 h-5 w-5" aria-hidden="true" />
                                        }
                                    </button>
                                    :
                                    <></>
                                }
                                {role === "faculty" || (role === "student" && exam.status !== "future") ?
                                    <Fragment>
                                        {/* <span className="mx-2 inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                            Graded
                                        </span> */}
                                        <button
                                            onClick={() => { naviagate(`/questions?examId=${exam._id}&c=${cohort._id}`) }}
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            {/* {role === "faculty" ? "View" : getExamStatus(exam.startTime, exam.endTime).includes("Available") && !exam.graded ? "Start" : "Details"} */}

                                            {getStartButtonLabel(exam)}



                                            {getStartButtonLabel(exam) !== "Details" ?
                                                <ArrowRightCircleIcon className="ml-1 -mr-1 h-5 w-5" aria-hidden="true" />
                                                :
                                                <InformationCircleIcon className="ml-1 -mr-1 h-5 w-5" aria-hidden="true" />}

                                        </button>
                                    </Fragment>

                                    : <></>
                                }
                                {role === "faculty" && exam.status !== "future" ?
                                    <button
                                        onClick={async () => {
                                            await publishExam(exam._id);
                                            setPublishNotification(true);
                                            setTimeout(() => {
                                                setPublishNotification(false);
                                            }, 5000);
                                        }}
                                        type="button"
                                        disabled={exam.published ? true : false}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        {exam.published ? "Published" : "Pusblish"}
                                        {exam.published ?
                                            <CheckCircleIcon className="ml-1 -mr-1 -mr-0.5 h-5 w-5" aria-hidden="true" />
                                            :
                                            saveStatus === `${exam._id} Publishing...` ?
                                                <svg className="animate-spin ml-2 -mr-0.5 w-4 h-4 fill-white" viewBox="3 3 18 18">
                                                    <path className="opacity-40" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                                    </path>
                                                    <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                                    </path>
                                                </svg>
                                                :
                                                <RocketLaunchIcon className="ml-1 -mr-1 h-5 w-5" aria-hidden="true" />}

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
