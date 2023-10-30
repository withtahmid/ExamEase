/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon, EllipsisVerticalIcon, EnvelopeIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CreateExamModal from './CreateExamModal';
import moment from "moment";
import ConditionalExamListing from './ConditionalExamListing';

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



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function getExamsArray(cohort) {
    let exams = [];
    for (let key in cohort.exams) {
        const newExam = {
            "_id": key,
            "title": cohort.exams[key].title,
            "description": cohort.exams[key].description,
            "color": cohort.exams[key].color,
            "startTime": cohort.exams[key].startTime,
            "endTime": cohort.exams[key].endTime,
            "duration": cohort.exams[key].duration,
            "graded": cohort.exams[key].graded,
            "published": cohort.exams[key].publised,
            "status": new Date() < new Date(cohort.exams[key].startTime) ? "future" : new Date() > new Date(cohort.exams[key].endTime) ? "past" : "present"
        }
        exams.push(newExam);
    }

    // exams.sort();

    return exams;
}

const getExamStatus = (startTime, endTime) => {
    const now = new Date();
    // console.log(now + " " + new Date(startTime));
    if (now > new Date(endTime)) {
        return `Finished`;
    }
    if (now >= new Date(startTime) && now <= new Date(endTime)) {
        return `Available now. Ends in ${moment(new Date(endTime)).from(now)}`;
    }
    return `Starts ${moment(new Date(startTime)).from(now)}`;

}

export default function ExamList(props) {
    const [newExamState, setnewExamState] = useState(false)
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');

    const [cohort, setCohort] = useState({});
    const [exams, setExams] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const cohortId = searchParams.get("c");

    const fetchCohort = async (token) => {
        const rawResponse = await fetch(`http://localhost:3000/cohorts/${cohortId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const content = await rawResponse.json();
        
        setCohort(content);
        setExams(getExamsArray(content));
        console.log(content)

    }


    useEffect(() => {
        fetchCohort(token);
    }, [newExamState]);

    // useEffect(() => {
    //     setCohort(props.cohort);
    // }, [newExamState])


    const naviagate = useNavigate();
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            {/* <div className="flex flex-row justify-end items-end items-end">
                <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Create exam
                </button>
            </div>





            <h2 className=" text-sm font-medium text-gray-500">Current or past exams</h2> */}






            <div className="flex">
                <div className='flex-1'>
                </div>
                {props.role === "faculty" ?
                    <div className='flex-reverse items-end'>
                        <button
                            onClick={() => setnewExamState(true)}
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Create exam
                        </button>
                    </div>
                    :
                    <></>
                }
            </div>



            <div>
                <CreateExamModal
                    state={newExamState}
                    onSubmit={() => setnewExamState(false)}
                    onCancel={() => {
                        setnewExamState(false);
                        // console.log("Canceled");
                    }}
                />
            </div>

            <div className="mb-6">
                <ConditionalExamListing comparator={function (a, b) {
                    return new Date(a.startTime) < new Date(b.startTime) ? 1 : -1;
                }} heading={"Current exam"} exams={exams ? exams.filter(e => e.status === "present") : exams} cohort={cohort} role={props.role} />
            </div>

            <div className="mb-6">
                <ConditionalExamListing comparator={function (a, b) {
                    return new Date(a.startTime) > new Date(b.startTime) ? 1 : -1;
                }} heading={"Upcoming exam(s)"} exams={exams ? exams.filter(e => e.status === "future") : exams} cohort={cohort} role={props.role} />
            </div>

            <div className="mb-6">
                <ConditionalExamListing comparator={function (a, b) {
                    return new Date(a.startTime) < new Date(b.startTime) ? 1 : -1;
                }} heading={"Past exam(s)"} exams={exams ? exams.filter(e => e.status === "past") : exams} cohort={cohort} role={props.role} />
            </div>
        </div>
    )
}
