import { Fragment, useEffect, useState } from "react";
import Navbar from "./Navbar";
import NewQuestionModal from "./NewQuestionModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import ToggleView from "./ToggleView";
import StudentView from "./StudentView";
import { CheckCircleIcon, CheckIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import DeleteExamModal from "./DeleteExamModal";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import AudioPlayer from "./AudioPlayer";
import { SERVER_URL } from './../../variables';

const parseStudentQuestions = (questions) => {
    let ret = [];
    for (const key in questions) {
        let question = {
            _id: key,
            type: questions[key].type,
            title: questions[key].title,
            score: questions[key].score,
            description: questions[key].description,
            mcqOptions: questions[key].mcqOptions,
            myAnswer: questions[key].myAnswer,
            myAudio: questions[key].myAudio,
            correctAnswer: questions[key].correctAnswer,
            obtainedScore: questions[key].obtainedScore,
            audioQuestion: "" || questions[key].audioQuestion,
            audioAnswer: "" || questions[key].audioAnswer
        }
        ret.push(question);
    }
    return ret;
}

export default function QuestionList() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('undefined');
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');
    const [newQuestionState, setnewQuestionState] = useState(false);

    const [endTime, setEndTime] = useState('');
    const [examTitle, setExamTitle] = useState('');
    const [examDescription, setExamDescription] = useState('');
    const [examPaper, setExamPaper] = useState(null);
    const [graded, setGraded] = useState('');
    const [published, setPublished] = useState('');
    const [examDuration, setExamDuration] = useState('');


    const [searchParams, setSearchParams] = useSearchParams();
    const examId = searchParams.get("examId");
    const cohortId = searchParams.get("c");


    const [questions, setQuestions] = useState(null);



    const [editTitleState, setEditTitleState] = useState(false);


    const fetchQuestions = async (token) => {
        const rawResponse = await fetch(`${SERVER_URL}/exams/${examId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const content = await rawResponse.json();

        setQuestions(role === "student" ? parseStudentQuestions(content.exam.questions) : content.questions);
        setEndTime(role === "student" ? content.exam.endTime : content.endTime);
        setExamTitle(role === "student" ? content.exam.title : content.title);
        setExamDescription(role === "student" ? content.exam.description : content.description);
        setExamDuration(role === "student" ? content.exam.duration : content.duration);
        setExamPaper(role === "student" ? content.myAnswerPaper : null);
        setGraded(role === "student" ? content.exam.graded : content.graded);
        setPublished(role === "student" ? content.exam.published : content.published);

        // console.log(content.questions)

    }

    useEffect(() => {
        fetchQuestions(token);
    }, [role])

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
        console.log(content)

        setName(content.user.name);
        setEmail(content.user.email);
        setRole(content.user.role);

    }


    useEffect(() => {
        fetchQuestions(token);
    }, [newQuestionState])
    useEffect(() => {
        fetchUser(token);
    }, [])


    const [currentView, setCurrentView] = useState(true);


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const navigate = useNavigate();

    const deleteExam = async (token, examId) => {
        const rawResponse = await fetch(`${SERVER_URL}/delete/exam/${examId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const content = await rawResponse.json();
        console.log(content);
        navigate(`/cohort?c=${cohortId}`);
    }

    const [editState, setEditState] = useState(null);
    const [callStack, setCallStack] = useState({ prev: "add", now: "add" });
    const getState = (idx) => {
        const question = questions[idx];
        // console.log(question);
        setEditState(question);
    }


    const handleGrading = async (examId) => {
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

        console.log(JSON.stringify({
            targetExamId: examId
        }))


        const content = await rawResponse.json();
        console.log(content);
    }






    return (
        <div>
            <Navbar name={name} email={email} role={role} token={token} getter={() => { }} />
            <div className="sm:mx-32">
                {role === "faculty" ?
                    <div className="flex flex-row-reverse items-end">

                        <div>
                            <ToggleView getter={(state) => { setCurrentView(state) }} />
                        </div>

                        <div className="space-x-4">
                            <DeleteExamModal
                                examName={examTitle}
                                examDescription={examDescription}
                                state={deleteModalOpen}
                                onCancel={() => setDeleteModalOpen(false)}
                                onDelete={() => {
                                    setDeleteModalOpen(false);
                                    deleteExam(token, examId);
                                }}
                            />

                            {graded ? <button
                                onClick={() => handleGrading(examId)}
                                type="button"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <ArrowPathIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                                Regrade
                            </button>
                                : <></>}

                            <button
                                onClick={() => setDeleteModalOpen(true)}
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-2 py-2 text-sm font-medium text-white shadow-sm text-white shadow-sm hover:bg-red-500 sm:w-auto"
                            >
                                <TrashIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                                Delete exam
                            </button>
                        </div>
                    </div>
                    :
                    <></>
                }

                {role === "faculty" ?

                    <div>
                        {!currentView ?
                            <StudentView
                                user={{ name, email, role }}
                                published={published}
                                examDuration={examDuration}
                                graded={graded}
                                role={"faculty"}
                                examTitle={examTitle}
                                examPaper={examPaper}
                                _questions={questions}
                                endTime={endTime}
                            />
                            :
                            <div className="mt-4 px-4 sm:px-6 lg:px-8">
                                <div>
                                    <div className="flex flex-row items-center">
                                        <div>
                                            {editTitleState ?
                                                <div className="-ml-3 -mt-2.5">
                                                    <input
                                                        value={examTitle}
                                                        onInput={(e) => setExamTitle(e.target.value)}
                                                        id="examTitle"
                                                        name="examTitle"
                                                        type="text"
                                                        className="text-2xl font-semibold text-gray-900 focus:border-indigo-700"
                                                    />
                                                </div>
                                                :
                                                <p className="text-2xl font-semibold text-gray-900">{examTitle}  </p>
                                            }
                                        </div>
                                        <div className="mt-0.5">
                                            <button onClick={() => setEditTitleState(prev => prev ^ true)}>
                                                {editTitleState ?
                                                    <CheckCircleIcon className="ml-4 h-8 w-8 text-indigo-700" />
                                                    :
                                                    <PencilSquareIcon className="ml-4 h-6 w-6 text-indigo-700" />
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    {graded ? <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                        Graded
                                    </span>
                                        : <></>}
                                </div>

                                <div className="sm:flex sm:items-center">
                                    <div className="sm:flex-auto mt-6">
                                        <div className="flex flex-row space-x-2">
                                            <span className="text-xl font-semibold text-gray-900">Questions</span>
                                            {!questions ? <span className="loading loading-dots loading-md text-gray-900"></span> : <></>}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-700">
                                            Add, Edit or Delete questions
                                        </p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-64">

                                        <button
                                            onClick={() => {
                                                setCallStack({ prev: callStack.now, now: "add" });
                                                setnewQuestionState(true);
                                            }}
                                            type="button"
                                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                        >
                                            Add question
                                        </button>
                                    </div>
                                </div>
                                <NewQuestionModal
                                    callStack={callStack}
                                    state={editState}
                                    faculty={"name"}
                                    getter={() => { }}
                                    token={""}
                                    modalState={newQuestionState}
                                    onSubmit={() => setnewQuestionState(false)}
                                    onCancel={() => {
                                        setnewQuestionState(false);
                                    }}
                                />
                                <div className="mt-8 flex flex-col">
                                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-300">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                Sl. No.
                                                            </th>
                                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Title
                                                            </th>
                                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Type
                                                            </th>
                                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Mark
                                                            </th>
                                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                                <span className="sr-only">Edit</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white">
                                                        {questions && questions.map((question, questionIdx) => (
                                                            <tr key={questionIdx} className={questionIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                    {questionIdx + 1}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
                                                                    {
                                                                        question.type === "viva" ?
                                                                            <audio style={{ height: "40px" }} controls="controls" autobuffer="autobuffer">
                                                                                <source src={question.audioQuestion} />
                                                                            </audio>
                                                                            :
                                                                            <span>{question.description}</span>
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{question.type.toUpperCase()}</td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{question.score}</td>
                                                                <td className="space-x-4 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                    <button
                                                                        type="button"
                                                                        className="text-indigo-600 hover:text-indigo-900"
                                                                        onClick={() => {
                                                                            getState(questionIdx);
                                                                            setCallStack({ prev: callStack.now, now: "edit" });
                                                                            setnewQuestionState(true);
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button type="button" className="text-red-500 hover:text-red-700"
                                                                        onClick={() => {
                                                                            getState(questionIdx);
                                                                            setCallStack({ prev: callStack.now, now: "delete" });
                                                                            setnewQuestionState(true);
                                                                        }}>

                                                                        Delete
                                                                    </button>
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div> :
                    <StudentView
                        user={{ name, email, role }}
                        published={published}
                        examDuration={examDuration}
                        graded={graded}
                        role={"student"}
                        examTitle={examTitle}
                        examPaper={examPaper}
                        _questions={questions}
                        endTime={endTime}
                    />
                }
            </div>
        </div>
    )
}
