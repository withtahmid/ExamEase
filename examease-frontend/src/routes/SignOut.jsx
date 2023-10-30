import React, { useEffect } from 'react'
import SignIn from './SignIn'
import { useNavigate } from 'react-router-dom';

export default function SignOut() {
    const navigate = useNavigate();
    useEffect(() => {
        if ('examease_token' in localStorage) {
            localStorage.removeItem('examease_token');
        }
        if ('examease_token' in sessionStorage) {
            sessionStorage.removeItem('examease_token');
        }
        // console.log(localStorage.getItem(examease_token));
        navigate('/login');

    }, [])

    return (
        <SignIn />
    )
}
