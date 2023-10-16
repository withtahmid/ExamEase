import Empty from ".././components/Empty";
import Modal from ".././components/Modal";
import Navbar from ".././components/Navbar";
import Sidebar from ".././components/Sidebar";
import { Fragment, useEffect, useState } from 'react'
import Settings from "./Settings";

import { useLocation, useNavigate } from "react-router-dom";
import CohortList from "../components/CohortList";

import jwt_decode from "jwt-decode";
import QuestionList from "../components/QuestionList";

const colors = ['pink-600', 'purple-600', 'yellow-500', 'green-500'];

function getColor() {
    return colors[Math.floor(Math.random() * 4)];
}
function getInitials(name) {
    let words = name.split(' ');
    if (words.length === 1) {
        return name.substring(0, 2).toUpperCase();
    }
    return (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase();
}

const dummy_cohorts = [
    // { name: 'Graph API', initials: 'GA', href: '#', members: 16, bgColor: 'bg-pink-600' },
    // { name: 'Component Design', initials: 'CD', href: '#', members: 12, bgColor: 'bg-purple-600' },
    // { name: 'Templates', initials: 'T', href: '#', members: 16, bgColor: 'bg-yellow-500' },
    // { name: 'React Components', initials: 'RC', href: '#', members: 8, bgColor: 'bg-green-500' },
]

function compareCohortsArray(a, b) {
    for (let i = 0; i < a.length; ++i) {
        if (a[i].id !== b[i].id) return false;
    }
    return true;
}


const parseCohorts = (cohorts) => {
    // return dummy_cohorts;
    // return [{ name: 'Graph API', initials: 'GA', href: '#', members: 16, bgColor: 'bg-pink-600' }];
    let list = new Array();
    for (const key in cohorts) {
        const cohort = { id: key, name: cohorts[key], initials: getInitials(cohorts[key]), href: `/cohort`, members: 16, bgColor: `bg-${getColor()}` };
        list.push(cohort);
    }
    return list;
    // for (let i = 0; i < cohorts.length; ++i) {
    //     const cohort ={ name: cohorts[i], initials: 'GA', href: '#', members: 16, bgColor: 'bg-pink-600' }

    // }
}


export default function Dashboard() {
    const navigate = useNavigate();
    // const location = useLocation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [cohorts, setCohorts] = useState(dummy_cohorts);
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');


    const updCohorts = (newCohort) => {
        setCohorts(cohorts.concat([{
            id: newCohort.cohort._id,
            name: newCohort.cohort.title,
            initials: 'GA',
            href: '#',
            members: 16,
            bgColor: 'bg-pink-600'
        }]));
    }


    const fetchUser = async (token) => {
        const rawResponse = await fetch('http://localhost:3000/user', {
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

        setCohorts(parseCohorts(content.user.cohorts))



    }




    useEffect(() => {
        if (!('examease_token' in localStorage) && !('examease_token' in sessionStorage)) {
            console.log("bad")
            navigate('/signout');
        }

        const decoded = jwt_decode(token);
        const curTime = new Date().getTime();
        const expTime = decoded['exp'] * 1000;

        console.log(curTime + " " + expTime);
        if (curTime > expTime) {
            navigate('/signout');
        }

        fetchUser(token);

    }, [])




    return (
        <div>
            <Navbar name={name} email={email} role={role} token={token} getter={updCohorts} />
            {cohorts.length === 0 ? <Empty token={token} name={name} /> : <CohortList cohorts={cohorts} />}


        </div>
    )
}
