import Empty from ".././components/Empty";
import Navbar from ".././components/Navbar";
import { Fragment, useEffect, useState } from 'react'

import { useLocation, useNavigate } from "react-router-dom";
import CohortList from "../components/CohortList";

import jwt_decode from "jwt-decode";
import { SERVER_URL } from "../../variables";
import Notification from "../components/Notification";

import FlipCountdown from '@rumess/react-flip-countdown';


function getColor(index) {
    const colors = ['bg-pink-600', 'bg-purple-600', 'bg-yellow-500', 'bg-green-500'];
    return colors[index];
}
function getInitials(name) {
    console.log(name)
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



const fetchCohortData = async (token, cohortId) => {
    const rawResponse = await fetch(`${SERVER_URL}/cohorts/${cohortId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const content = await rawResponse.json();
    return content;
}



const parseCohorts = async (cohorts, token) => {
    let list = new Array();
    console.log(cohorts)
    for (const key in cohorts) {
        const cohortData = await fetchCohortData(token, key);
        const cohort = {
            id: key,
            name: cohorts[key].title,
            description: cohorts[key].description,
            initials: getInitials(cohorts[key].title),
            faculty: cohortData.faculty_name,
            href: `/cohort?c=${key}`,
            members: cohortData.students.length,
            bgColor: getColor(cohorts[key].color)
        };
        list.push(cohort);
    }
    return list;

}


export default function Dashboard() {
    const navigate = useNavigate();
    // const location = useLocation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [cohorts, setCohorts] = useState(null);
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');


    const updCohorts = (newCohort) => {
        console.log(token)
        fetchUser(token);
    }

    // console.log(token)
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

        console.log('Token: ' + token);
        setName(content.user.name);
        setEmail(content.user.email);
        setRole(content.user.role);

        setCohorts(await parseCohorts(content.user.cohorts, token))

    }





    useEffect(() => {
        if (!('examease_token' in localStorage) && !('examease_token' in sessionStorage)) {
            console.log("bad")
            navigate('/signout');
            return;
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
        <Fragment>
            {token ?
                <div>
                    <Navbar name={name} email={email} role={role} token={token} getter={updCohorts} />
                    {cohorts && cohorts.length === 0 ? <Empty role={role} token={token} name={name} email={email} getter={updCohorts} /> : <CohortList cohorts={cohorts} faculty={name} role={role} />}
                    {/* <CohortList cohorts={cohorts} faculty={name} /> */}

                </div>
                : <></>
            }
        </Fragment>
    )
}
