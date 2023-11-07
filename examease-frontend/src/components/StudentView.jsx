import { Fragment, useEffect, useState } from "react"
import Navbar from "./Navbar"
import ListOptions from "./ListOptions"
import CountDown from "./CountDown"
import { CheckCircleIcon, EnvelopeIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/20/solid'

import './sticky.css'
import { ClockIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline"
import { CheckCircleOutline, CheckOutlined } from "@mui/icons-material"
import { useSearchParams } from "react-router-dom"

import { lcsLength } from "../../utils"
import SubmittedAlert from "./SubmittedAlert"
import Recorder from "./Recorder"
import Slideover from "./Slideover"

import ExamHeading from "./ExamHeading"

export default function StudentView({ role, examTitle, examPaper, _questions, endTime, graded, published, examDuration }) {
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');
    // Total time remaining in seconds
    const [seconds, setSeconds] = useState(null);

    const [loading, setLoading] = useState(true);
    const [paperId, setPaperId] = useState(null);



    const [questions, setQuestions] = useState();

    const [searchParams, setSearchParams] = useSearchParams();

    const examId = searchParams.get('examId');
    const cohortId = searchParams.get('c');

    const [audioKey, setAudioKey] = useState(1);
    const [recorderState, setRecorderState] = useState(false);

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

    const onChangeAudio = (value, id) => {
        // value = value.split(',')[1]
        const editData = questions.map((item) => item._id === id && "myAnswer" ? { ...item, ["myAnswer"]: value } : item);
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
        setAudioKey(prev => prev + 1);
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
        setAudioKey(prev => prev + 1);
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
                submit: false
            })

        });





        const content = await rawResponse.json();
        console.log(content);
        setSaveStatus("Submitted!");



        console.log(JSON.stringify({
            targetAnswerId: paperId,
            answers: await parseAnswers(),
            submit: false
        }))

        // console.log(JSON.stringify({
        //     targetAnswerId: paperId,
        //     answers: await parseAnswers(),
        //     submit: submit
        // }));

        // setSaveStatus("Saved");
        // if (content.success) {
        //     console.log("Dhuko")
        //     for (const key in content.myAnswer.answers) {
        //         onUpdateInput(content.myAnswer.answers[key] || "", key);
        //     }
        // }
    }


    const handleDisputeSubmit = async (subject, studentComment) => {
        const rawResponse = await fetch(`http://localhost:3000/dispute/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                targetExamId: examId,
                subject: subject,
                studentComment: studentComment,
                createdAt: new Date()
            })

        });

        const content = await rawResponse.json();
        console.log(content);

    }



    const [disputeState, setDisputeState] = useState(false);


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
                <div className="sm:mx-64 m-4">
                    <ExamHeading
                        mode={"Exam"}
                        graded={graded}
                        published={published}
                        role={role}
                        saveStatus={saveStatus}
                        heading={examTitle}
                        onSave={() => {
                            handleSave(paperId, true);
                        }}
                        examDuration={examDuration}
                        totalMarks={(() => {
                            let ret = 0;
                            questions.map(q => {
                                ret += q.score;
                            });
                            return ret;
                        })()}

                    />

                    {/* <h2 className="text-3xl leading-6 text-gray-900 mb-2 mt-4">{examTitle}</h2> */}




                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSave(paperId, true);
                    }} method="POST">



                        {published ?
                            <div>
                                <div className="border-l-4 border-indigo-400 bg-indigo-50 p-4 my-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-indigo-700">
                                                If you have any complaints about the scores. You may {' '}
                                                <a href="#"
                                                    className="font-medium text-indigo-700 underline hover:text-indigo-600"
                                                    onClick={() => setDisputeState(true)}
                                                >
                                                    raise a dispute.
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div> : <></>}

                        {role === "student" && graded ?
                            <div>
                                {!published ?
                                    <div className="rounded-md bg-blue-50 p-4 mt-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3 flex-1 md:flex md:justify-between">
                                                <p className="text-sm text-blue-700">This exam is graded but the scores aren't published by the faculty yet.</p>
                                                <p className="mt-3 text-sm md:mt-0 md:ml-6">
                                                    <a href="#" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                                                        Details
                                                        <span aria-hidden="true"> &rarr;</span>
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                    : <></>}
                            </div>
                            : <>
                                <h2 className="font-medium text-gray-900 mb-1 mt-4">Answer the following question(s)</h2>
                                <h2 className="font-medium text-gray-900 mb-4">Figures on the right indicate full marks</h2>
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
                                                        {`${question.type === "viva" ? "[Viva Question]" : question.description}`}</p>
                                                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                                        {role === "student" && graded && published ? `${question.obtainedScore || 0} / ${question.score}` : `${question.score} mark${question.score > 0 ? 's' : ''}`}
                                                    </span>
                                                    {/* <p className="mt-1 truncate text-xs leading-5 text-gray-500">{question.email}</p> */}
                                                </div>
                                            </div>
                                            {question.type === "mcq" ? <div className="sm:w-1/3">
                                                <ListOptions
                                                    correctAnswers={question.correctAnswer}
                                                    disabled={saveStatus === "Submitted!" || published || graded}
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
                                                                disabled={saveStatus === "Submitted!" || graded || published}
                                                                value={question.myAnswer || ""}
                                                                onChange={(e) => { onChangeInput(e, question._id) }}
                                                                id="myAnswer"
                                                                name="myAnswer"
                                                                rows={1}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            // defaultValue={''}
                                                            />
                                                        </div>


                                                        {role === "student" && graded ? published && <p className="mt-2 font-normal text-md text-gray-900">
                                                            <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                                Answer:
                                                            </span>
                                                            {`             ${question.correctAnswer}`}</p> : <></>
                                                        }
                                                        {/* <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p> */}
                                                    </div>
                                                    :
                                                    <div className="flex flex-col space-y-4">
                                                        <p>{question.title}</p>
                                                        <div className="">
                                                            <p className="text-sm text-gray-700">Question</p>
                                                            <audio key={1} style={{ height: "40px" }} controls="controls" autobuffer="autobuffer">
                                                                <source src={question.audioQuestion} />
                                                            </audio>
                                                            <div className="mt-2"> <p className="text-sm text-gray-700">Answer</p> </div>
                                                            <div className="flex flex-row space-x-4 mt-3 -mb-4">
                                                                <div onClick={() => setRecorderState(prev => prev ^ true)}>
                                                                    <Recorder getter={(b64) => {
                                                                        onChangeAudio(b64, question._id);
                                                                        setAudioKey(prev => prev + 1);
                                                                    }} />
                                                                </div>
                                                                {!recorderState && question.myAnswer && question.myAnswer !== "" ?
                                                                    <audio key={audioKey} style={{ height: "40px" }} controls="controls" autobuffer="autobuffer">
                                                                        <source src={question.myAnswer.length > 1000 ? question.myAnswer : question.myAudio} />
                                                                    </audio>
                                                                    :
                                                                    <></>
                                                                }
                                                            </div>
                                                        </div>
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


                            {role === "student" && (!published && !examPaper.submitted && new Date() < endTime) ?
                                <div className="sm:ml-96 w-1/3 sm:-mr-16 sm:-mt-24" >
                                    <div className="sticky space-y-2">
                                        <div className="inline-flex justify-center bg-white text-md text-gray-700">
                                            <ClockIcon className="-ml-1 mr-2 h-6 w-6 text-indigo-400" aria-hidden="true" />
                                            <span className="font-medium text-gray-900">Until finish</span>
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
                        {/* {!published ?
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
                            :
                            <></>
                        } */}

                    </form>


                    <Slideover
                        onSubmit={async (subject, studentComment) => {
                            await handleDisputeSubmit(subject, studentComment);
                            setDisputeState(false)
                        }}
                        onCancel={() => setDisputeState(false)}
                        state={disputeState}
                        getter={() => setDisputeState(false)}
                    />

                    <div className="mt-4">
                        {saveStatus === "Submitted!" && !published ? <SubmittedAlert /> : <></>}
                    </div>
                    <div className="mt-12">
                        <p dangerouslySetInnerHTML={{ __html: "&nbsp;" }}></p>
                    </div>

                </div>
            }
        </div>
    )
}
