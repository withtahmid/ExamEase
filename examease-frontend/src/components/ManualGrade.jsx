import { Fragment, useEffect, useState } from "react"
import Navbar from "./Navbar"
import ListOptions from "./ListOptions"
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import './sticky.css'
import { useLocation, useSearchParams } from "react-router-dom"
import { SERVER_URL } from './../../variables'
import ExamHeading from "./ExamHeading"

export default function ManualGrade() {
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');
    const [audioKey, setAudioKey] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const answerId = searchParams.get("ans");

    const [questions, setQuestions] = useState(null);


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
                studentAnswer: questions[key].studentAnswer,
                audio: "" || questions[key].audio,
                studentAudioAnswer: "" || questions[key].studentAudioAnswer,
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
        const rawResponse = await fetch(`${SERVER_URL}/dispute/resolve`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                disputeId: dispute._id,
                facultyComment: dispute && dispute.facultyComment ? dispute.facultyComment : "Resolved"
            })
        });
        const content = await rawResponse.json();

        console.log(parseGrades(questions));

        console.log(content)
    };

    const updateMarks = async (token) => {
        const rawResponse = await fetch(`${SERVER_URL}/studentanswer/grade`, {
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
        const rawResponse = await fetch(`${SERVER_URL}/studentanswer/${answerId}`, {
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


        console.log(content)


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

            {questions ?
                <Fragment>
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

                        <div className="rounded-md bg-blue-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">{dispute ? dispute.subject : ""}</h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <p>
                                            {dispute ? dispute.studentComment : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                                                        defaultAnswer={question.studentAnswer}
                                                        getter={(ans) => { }}
                                                    />
                                                </div>
                                                    : question.type === "written" ?
                                                        <div className="sm:col-span-2 w-4/5">
                                                            <div className="mt-6">
                                                                <textarea
                                                                    disabled={true}
                                                                    value={question.studentAnswer || ""}
                                                                    onChange={(e) => { onChangeInput(e, question._id) }}
                                                                    id="studentAnswer"
                                                                    name="studentAnswer"
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
                                                        <div className="flex flex-col space-y-4 mb-4">
                                                            <p>{question.title}</p>
                                                            <div className="">
                                                                <p className="text-sm text-gray-700">Question</p>
                                                                <audio key={1} style={{ height: "40px" }} controls="controls" autobuffer="autobuffer">
                                                                    <source src={question.audio} />
                                                                </audio>
                                                                <div className="mt-2"> <p className="text-sm text-gray-700">Student's answer</p> </div>
                                                                <div className="flex flex-row space-x-4 -mb-4">

                                                                    {question.studentAnswer && question.studentAnswer !== "" ?
                                                                        <audio key={audioKey} style={{ height: "40px" }} controls="controls" autobuffer="autobuffer">
                                                                            <source src={question.studentAudioAnswer} />
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
                                            />
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-gray-600">Write a comment.</p>
                                    </div>


                                </div>
                                {/* <p>{dispute ? dispute.subject : ""}</p>
                        <p>{dispute ? dispute.studentComment : ""}</p> */}





                            </div>

                        </form>



                    </div>
                    <div className="mt-12">
                        <p dangerouslySetInnerHTML={{ __html: "&nbsp;" }}></p>
                    </div>
                </Fragment>
                :
                <Fragment>
                    <div className="flex h-screen">
                        <div className="m-auto">
                            <div className="flex flex-row space-x-2 items-center">
                                <span className="loading loading-ring loading-lg text-indigo-700"></span>
                                <p className="text-indigo-900 font-medium text-md">Loading dispute</p>
                            </div>
                        </div>
                    </div>

                </Fragment>
            }
        </div>


    )
}