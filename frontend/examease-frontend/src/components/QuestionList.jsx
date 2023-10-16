import { useState } from "react";
import Navbar from "./Navbar";
import NewQuestionModal from "./NewQuestionModal";

/* This example requires Tailwind CSS v2.0+ */
const questions = [
    { slno: 1, title: 'What\'s 10+5?', type: 'MCQ', mark: 5 },
    { slno: 2, title: 'What\'s 7-2?', type: 'Text', mark: 5 },
    // More people...
]

export default function QuestionList() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');
    const [newQuestionState, setnewQuestionState] = useState(false)
    return (
        <div>
            <Navbar name={name} email={email} role={role} token={token} getter={() => { }} />
            <div className="mt-4 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Questions</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the users in your account including their name, title, email and role.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            onClick={() => { setnewQuestionState(true) }}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Add question
                        </button>
                    </div>
                </div>
                <NewQuestionModal
                    faculty={"name"}
                    getter={() => { }}
                    token={""}
                    state={newQuestionState}
                    onSubmit={() => setnewQuestionState(false)}
                    onCancel={() => {
                        setnewQuestionState(false);
                        console.log("Canceled");
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
                                        {questions.map((question, questionIdx) => (
                                            <tr key={questionIdx} className={questionIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {question.slno}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{question.title}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{question.type}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{question.mark}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                        Edit<span className="sr-only">, {question.slno}</span>
                                                    </a>
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
        </div>
    )
}
