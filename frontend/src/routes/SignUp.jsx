import React, { Fragment, useEffect, useState } from 'react'
import Select from '../components/Select'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SERVER_URL } from '../../variables';

const userTypes = [
    { id: 1, name: 'Student' },
    { id: 2, name: 'Faculty' }
]

export default function SignUp() {
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [message, setMessage] = useState('');

    const [restricted, setRestricted] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.has('email')) {
            setEmail(searchParams.get('email'));
            setRestricted(true);
        }
    }, [])



    const navigate = useNavigate();

    const getRole = (role) => {
        setRole(role);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const rawResponse = await fetch(`${SERVER_URL}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": fname + " " + lname,
                "email": email,
                "password": password,
                "role": role.toLowerCase()
            })
        });
        const content = await rawResponse.json();


        if (!content['success']) {
            setMessage(content.message);
        }
        else {

            const token = content['accessToken'];
            localStorage.setItem('examease_token', token);
            navigate('/dashboard');

            console.log(content);
            console.log(fname + " " + lname + " " + email + " " + password + " " + role)
            return;
        }
    }


    useEffect(() => {
        setMessage('');
    }, [fname, lname, email, password, role])

    return (
        <Fragment>

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://i.ibb.co/CVv52Zg/free-vector-ee-train-clip-art-116884-Ee-Train-clip-art-hight.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create a new account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6 -mx-12" action="#" method="POST" onSubmit={handleSubmit}>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First name
                                </label>
                                <div className="mt-2">
                                    <input
                                        autoComplete="off"
                                        value={fname}
                                        onChange={(e) => { setFName(e.target.value) }}
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Last name
                                </label>
                                <div className="mt-2">
                                    <input
                                        autoComplete="off"
                                        value={lname}
                                        onChange={(e) => { setLName(e.target.value) }}
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    autoComplete="off"
                                    value={email}
                                    disabled={restricted}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-red-600">{message}</p>

                            {/* {message !== "" ?
                                <div className="toast toast-bottom toast-end">
                                    <div className="alert alert-error">
                                        <span>{message}</span>
                                    </div>
                                </div>
                                :
                                <></>
                            } */}
                        </div>



                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>

                            </div>
                            <div className="mt-2">
                                <input
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-600">At least 8 characters</p>
                        </div>
                        <div>
                            <Select
                                current={0}
                                heading={'User type'}
                                getter={getRole}
                                options={restricted ? [{ id: 1, name: 'Student' }] : userTypes} />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already a member?{' '}
                        <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </Fragment>
    )

}
