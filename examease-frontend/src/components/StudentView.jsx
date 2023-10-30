import { Fragment, useEffect, useState } from "react"
import Navbar from "./Navbar"
import ListOptions from "./ListOptions"
import CountDown from "./CountDown"
import { CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/20/solid'

import './sticky.css'
import { ClockIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline"
import { CheckCircleOutline, CheckOutlined } from "@mui/icons-material"
import { useSearchParams } from "react-router-dom"

import { lcsLength } from "../../utils"
import SubmittedAlert from "./SubmittedAlert"
import Recorder from "./Recorder"

const people = [
    {
        name: 'What\'s the difference between wet and saturated?',
        email: 'leslie.alexander@example.com',
        role: 'Co-Founder / CEO',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Michael Foster',
        email: 'michael.foster@example.com',
        role: 'Co-Founder / CTO',
        imageUrl:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Dries Vincent',
        email: 'dries.vincent@example.com',
        role: 'Business Relations',
        imageUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: null,
    },
    {
        name: 'Lindsay Walton',
        email: 'lindsay.walton@example.com',
        role: 'Front-end Developer',
        imageUrl:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Courtney Henry',
        email: 'courtney.henry@example.com',
        role: 'Designer',
        imageUrl:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Tom Cook',
        email: 'tom.cook@example.com',
        role: 'Director of Product',
        imageUrl:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: null,
    },
]

export default function StudentView({ role, examTitle, examPaper, _questions, endTime, graded, examDuration }) {
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');
    // Total time remaining in seconds
    const [seconds, setSeconds] = useState(null);

    const [loading, setLoading] = useState(true);
    const [paperId, setPaperId] = useState(null);


    const [lastSaved, setLastSaved] = useState(new Date().getTime());

    /*
        TODO: 

    */



    const [questions, setQuestions] = useState();

    const [searchParams, setSearchParams] = useSearchParams();

    const examId = searchParams.get('examId');
    const cohortId = searchParams.get('c');


    const onChangeInput = (e, id) => {
        const { name, value } = e.target;
        const editData = questions.map((item) => item._id === id && name ? { ...item, [name]: value } : item);
        setQuestions(editData);
        sessionStorage.setItem(`${token}-${examId}-${cohortId}`, JSON.stringify(editData));

        // let s = JSON.stringify(questions);
        // let t = JSON.stringify(sessionStorage.getItem(`${token}-${examId}-${cohortId}`));
        // let lcs = lcsLength(s, t);

        // console.log(`s: ${s.length}, t: ${t.length}, lcs: ${lcs}`)


        // console.log(editData);
        // const obj = sessionStorage.getItem(`${token}-${examId}-${cohortId}`);
        // console.log(JSON.parse(obj));
    }


    // const onUpdateInput = (value, id) => {
    //     console.log(value, id)
    //     const editData = questions.map((item) => item._id === id && "myAnswer" ? { ...item, ["myAnswer"]: value } : item);
    //     setQuestions(editData);

    // }
    const onUpdateCheckbox = (value, id) => {
        const editData = questions.map((item) => item._id === id && "myAnswer" ? { ...item, ["myAnswer"]: value } : item);
        setQuestions(editData);
        sessionStorage.setItem(`${token}-${examId}-${cohortId}`, JSON.stringify(editData));
    }



    // useEffect(() => {
    //     setSeconds(Math.floor((new Date(endTime) - new Date()) / 1000));
    // }, [endTime]);
    useEffect(() => {
        if (examPaper) {
            // console.log('ST: ' + new Date(examPaper.startTime));
            // console.log('D: ' + examDuration * 60);
            // console.log('EE: ' + new Date(new Date(examPaper.startTime).getTime() +  examDuration * 60 * 1000));
            // console.log('EC: ' + new Date(endTime));
            // console.log(Math.floor((new Date(examPaper.startTime).getTime() + examDuration * 60 - new Date().getTime()) / 1000));
            if (role === "student") {
                setSeconds(Math.floor((Math.min(new Date(endTime).getTime(), new Date(examPaper.startTime).getTime() + examDuration * 60 * 1000) - new Date().getTime()) / 1000));
            }
        }
    }, [examDuration]);


    useEffect(() => {
        if (_questions) {
            setLoading(false);

            console.log(_questions)


            if (`${token}-${examId}-${cohortId}` in sessionStorage) {
                setQuestions(JSON.parse(sessionStorage.getItem(`${token}-${examId}-${cohortId}`)));
            } else {
                setQuestions(_questions);
            }

            sessionStorage.setItem(`${token}-${examId}-${cohortId}`, JSON.stringify(_questions));
        }

        if (examPaper) {
            setPaperId(examPaper._id);
            if (examPaper.submitted) setSaveStatus("Submitted!");
        }

        if (_questions && examPaper) {
            console.log("Finally Loaded!");
        }
    }, [_questions, examPaper]);


    const [saveStatus, setSaveStatus] = useState("Saved");



    const parseAnswers = async () => {
        let ret = {}
        for (let i = 0; i < questions.length; ++i) {
            ret[`${questions[i]._id}`] = questions[i].myAnswer;
        }
        return ret;
    };





    const handleSave = async (paperId, submit = false) => {
        setSaveStatus("Submitting...");
        const rawResponse = await fetch(`http://localhost:3000/submitanswer`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                targetAnswerId: paperId,
                answers: await parseAnswers(),
                submit: submit
            })

        });


        console.log(await parseAnswers());

        const content = await rawResponse.json();
        console.log(content);
        setSaveStatus("Submitted!");


        // setSaveStatus("Saved");
        // if (content.success) {
        //     console.log("Dhuko")
        //     for (const key in content.myAnswer.answers) {
        //         onUpdateInput(content.myAnswer.answers[key] || "", key);
        //     }
        // }
    }



    const MINUTE_MS = 1000;

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, MINUTE_MS);

        return () => clearInterval(interval);
    }, [])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setSaveStatus("Saving...");
    //         if (paperId) handleSave(paperId);
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, [loading])
    return (
        <div>
            {loading ?
                <div className="flex flex-col h-screen justify-center items-center">
                    <div className="text-center m-auto">
                        <span className="loading loading-dots loading-lg text-indigo-500"></span>
                        <p>Loading Exam</p>
                    </div>
                </div>
                :
                <div className="sm:mx-64 m-10">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSave(paperId, true);
                    }} method="POST">
                        <h2 className="text-3xl leading-6 text-gray-900 mb-2">{examTitle}</h2>
                        {role === "student" && graded ? <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Graded
                        </span>
                            : <>
                                <h2 className="text-md leading-6 text-gray-900 mb-1">Answer the following question(s)</h2>
                                <h2 className="text-md leading-6 text-gray-900 mb-4">Figures on the right indicate full marks</h2>
                            </>}
                        <div className="flex flex-row">


                            <div className="w-2/3">
                                <ul role="list" className="divide-y divide-gray-300">
                                    {questions && questions.map((question, idx) => (
                                        <li key={question._id} className="flex flex-col gap-x-6 py-5">
                                            <div className="flex min-w-0 gap-x-4">
                                                {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={question.imageUrl} alt="" /> */}
                                                <div className="min-w-0 flex flex-row space-x-4">
                                                    <p className="text-xl leading-6 text-gray-900">{`${idx + 1}. `}
                                                        {`${question.description}`}</p>
                                                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                                        {role === "student" && graded ? `${question.obtainedScore} / ${question.score}` : `${question.score} marks`}
                                                    </span>
                                                    {/* <p className="mt-1 truncate text-xs leading-5 text-gray-500">{question.email}</p> */}
                                                </div>
                                            </div>
                                            {question.type === "mcq" ? <div className="sm:w-1/3">
                                                <ListOptions
                                                    correctAnswers={question.correctAnswer}
                                                    submitted={saveStatus === "Submitted!"}
                                                    graded={graded}
                                                    title={question.title}
                                                    options={question.mcqOptions}
                                                    defaultAnswer={question.myAnswer}
                                                    getter={(ans) => onUpdateCheckbox(ans, question._id)}
                                                />
                                            </div>
                                                : question.type === "written" ?
                                                    <div className="sm:col-span-2 w-4/5">
                                                        <div className="mt-6">
                                                            <textarea
                                                                disabled={saveStatus === "Submitted!"}
                                                                value={question.myAnswer || ""}
                                                                onChange={(e) => { onChangeInput(e, question._id) }}
                                                                id="myAnswer"
                                                                name="myAnswer"
                                                                rows={1}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            // defaultValue={''}
                                                            />
                                                        </div>


                                                        {role === "student" && graded ? <p className="mt-2 font-normal text-md text-gray-900">
                                                            <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                                Answer:
                                                            </span>
                                                            {`             ${question.correctAnswer}`}</p> : <></>
                                                        }
                                                        {/* <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p> */}
                                                    </div>
                                                    :
                                                    <div className="flex flex-row space-x-4 mt-3">
                                                        <div className="mt-2"> <p className="text-gray-900">Record audio</p> </div>
                                                        <div> <Recorder getter={(b64) => setAnswer(b64)} /> </div>


                                                    </div>

                                            }

                                            {/* <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                <p className="text-sm leading-6 text-gray-900">{question.role}</p>
                                {question.lastSeen ? (
                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Last seen <time dateTime={question.lastSeenDateTime}>{question.lastSeen}</time>
                                    </p>
                                ) : (
                                    <div className="mt-1 flex items-center gap-x-1.5">
                                        <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs leading-5 text-gray-500">Online</p>
                                    </div>
                                )}
                            </div> */}
                                        </li>
                                    ))}
                                </ul>

                            </div>


                            {role === "student" ?
                                <div className="w-1/3" >
                                    <div className="sticky space-y-2">
                                        <div className="inline-flex justify-center bg-white text-md text-gray-700">
                                            <ClockIcon className="-ml-1 mr-2 h-6 w-6 text-gray-400" aria-hidden="true" />
                                            <span>Until finish</span>
                                        </div>
                                        <CountDown seconds={saveStatus === "Submitted!" ? 0 : seconds} />
                                        <div className="inline-flex justify-center bg-white text-md text-gray-700">
                                            <CloudArrowUpIcon className="-ml-1 mr-2 h-6 w-6 text-gray-400" aria-hidden="true" />
                                            {saveStatus === "Saving..." ? <span className="loading loading-ring loading-md"></span> : <></>}

                                            <span>{saveStatus}</span>
                                            {saveStatus === "Saving..." ? <></> : <CheckOutlined className="ml-2 mr-2 h-6 w-6 text-green-500" aria-hidden="true" />}

                                        </div>

                                    </div>
                                </div>
                                :
                                <></>}

                        </div>
                        <button
                            disabled={saveStatus === "Submitted!" || role === "faculty"}
                            type="submit"
                            className="disabled:bg-green-600 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {saveStatus === "Submitted!" ? "Turned in" : "Turn in"}
                            {saveStatus === "Submitting..." ?
                                <div aria-label="Loading..." role="status">
                                    <svg className="animate-spin ml-3 -mr-1 w-6 h-6 fill-white" viewBox="3 3 18 18">
                                        <path className="opacity-40" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                        </path>
                                        <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                        </path>
                                    </svg>
                                </div>
                                :
                                saveStatus === "Submitted!" ?
                                    <CheckCircleIcon className="ml-3 -mr-1 h-6 w-6" aria-hidden="true" />
                                    :
                                    <></>

                            }

                        </button>

                    </form>
                    <div className="mt-8">
                        {saveStatus === "Submitted!" ? <SubmittedAlert /> : <></>}
                    </div>
                </div>
            }
        </div>
    )
}
