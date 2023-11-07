import { Fragment, useEffect, useState } from "react"
import Navbar from "./Navbar"
import ListOptions from "./ListOptions"
import CountDown from "./CountDown"
import { CheckCircleIcon, EnvelopeIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/20/solid'

import './sticky.css'
import { ClockIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline"
import { CheckCircleOutline, CheckOutlined } from "@mui/icons-material"
import { useLocation, useSearchParams } from "react-router-dom"

import { lcsLength } from "../../utils"
import SubmittedAlert from "./SubmittedAlert"
import Recorder from "./Recorder"
import Slideover from "./Slideover"

import ExamHeading from "./ExamHeading"

export default function ManualGrade() {
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');
    const [audioKey, setAudioKey] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const answerId = searchParams.get("ans");

    const [questions, setQuestions] = useState([]);


    const [examInfo, setExamInfo] = useState('');

    let { state } = useLocation();

    const [dispute, setDispute] = useState(null);

    const [comment, setComment] = useState('');



    const parseQuestions = (questions) => {
        let ret = [];
        for (let key in questions) {
            const question = {
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
            };
            ret.push(question);
        }
        return ret;
    };

    const parseGrades = (questions) => {
        let ret = {};
        questions.map(q => {
            ret[`${q._id}`] = q.obtainedScore
        });
        return ret;
    }





    const resolveDispute = async (token) => {
        const rawResponse = await fetch(`http://localhost:3000/dispute/resolve`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                disputeId: dispute._id,
                facultyComment: comment ? comment : "Resolved"
            })
        });
        const content = await rawResponse.json();

        console.log(parseGrades(questions));

        console.log(content)
    };

    const updateMarks = async (token) => {
        const rawResponse = await fetch(`http://localhost:3000/studentanswer/grade`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                targetAnswerId: answerId,
                grades: parseGrades(questions)
            })
        });
        const content = await rawResponse.json();

        console.log(content)
    };


    const handleSubmit = async (token) => {
        setSaveStatus("Submitting...");
        await updateMarks(token);
        await resolveDispute(token);

        setSaveStatus("Submitted!");

    };


    const fetchAnswer = async (token) => {
        const rawResponse = await fetch(`http://localhost:3000/studentanswer/${answerId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const content = await rawResponse.json();
        const questions = parseQuestions(content.answerPaper);
        setQuestions(questions);
        setExamInfo(content);


        console.log(questions)


    };


    const [saveStatus, setSaveStatus] = useState('Saved!');

    useEffect(() => {
        fetchAnswer(token);
        setDispute(state.dispute);
    }, [state]);



    const onChangeInput = (e, id, max) => {
        const { name, value } = e.target;
        const editData = questions.map((item) => item._id === id && name ? { ...item, [name]: Math.max(0, Math.min(max, value)) } : item);
        setQuestions(editData);
    }



    return (
        <div>
            <Navbar name={"name"} email={"email"} role={"role"} token={token} getter={() => { }} />

            <div className="sm:mx-64 mx-4 mt-4">

                <div className="mb-4">
                    <ExamHeading
                        mode={"Dispute"}
                        graded={true}
                        published={true}
                        role={"student"}
                        saveStatus={dispute && dispute.resolved ? "Submitted!" : saveStatus}
                        heading={examInfo.examTitle}
                        onSave={() => {
                            handleSubmit(token);
                        }}
                        examDuration={20}
                        totalMarks={(() => {
                            let ret = 0;
                            questions.map(q => {
                                ret += q.score;
                            });
                            return ret;
                        })()}

                    />
                </div>




                <form method="POST" >
                    <div className="flex flex-row">
                        <div className="w-2/3">
                            <ul role="list" className="divide-y divide-gray-300">
                                {questions && questions.map((question, idx) => (
                                    <li key={question._id} className="flex flex-col gap-x-6 py-5">
                                        <div className="flex min-w-0 gap-x-4">
                                            <div className="min-w-0 flex flex-row space-x-4">
                                                <p className="text-xl leading-6 text-gray-900">{`${idx + 1}. `}
                                                    {`${question.type === "viva" ? "[Viva Question]" : question.description}`}</p>
                                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                                    {`${question.obtainedScore || 0} / ${question.score}`}
                                                </span>

                                            </div>

                                        </div>

                                        {question.type === "mcq" ? <div className="sm:w-1/3">
                                            <ListOptions
                                                correctAnswers={question.correctAnswer}
                                                disabled={true}
                                                graded={true}
                                                title={question.title}
                                                options={question.mcqOptions}
                                                defaultAnswer={question.myAnswer}
                                                getter={(ans) => { }}
                                            />
                                        </div>
                                            : question.type === "written" ?
                                                <div className="sm:col-span-2 w-4/5">
                                                    <div className="mt-6">
                                                        <textarea
                                                            disabled={true}
                                                            value={question.myAnswer || ""}
                                                            onChange={(e) => { onChangeInput(e, question._id) }}
                                                            id="myAnswer"
                                                            name="myAnswer"
                                                            rows={1}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        // defaultValue={''}
                                                        />
                                                    </div>


                                                    <p className="mt-2 font-normal text-md text-gray-900">
                                                        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                            Answer:
                                                        </span>
                                                        {`             ${question.correctAnswer}`}</p>

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

                                                            {question.myAnswer && question.myAnswer !== "" ?
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

                                        <div className="sm:col-span-4 flex flex-row items-center space-x-4">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                Score
                                            </label>
                                            <div className="mt-2 w-1/5">
                                                <input
                                                    value={question.obtainedScore}
                                                    onChange={(e) => onChangeInput(e, question._id, question.score)}
                                                    id="obtainedScore"
                                                    name="obtainedScore"
                                                    type="number"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 col-span-full">
                                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                    Comment
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        disabled={dispute && dispute.resolved}
                                        value={dispute ? dispute.facultyComment : ""}
                                        onChange={(e) => {
                                            setDispute({ ...dispute, ["facultyComment"]: e.target.value })
                                        }}
                                        id="comment"
                                        name="comment"
                                        rows={3}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={''}
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Write a comment.</p>
                            </div>


                        </div>




                    </div>

                </form>



            </div>
        </div>


    )
}
