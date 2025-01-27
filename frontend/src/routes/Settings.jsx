import { Fragment, useEffect, useState } from 'react'
import { Dialog, Switch, Transition } from '@headlessui/react'
import {
    ArrowLeftOnRectangleIcon,
    Bars3BottomLeftIcon,
    BellIcon,
    BriefcaseIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    CogIcon,
    DocumentMagnifyingGlassIcon,
    HomeIcon,
    PhotoIcon,
    QuestionMarkCircleIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Navbar from '../components/Navbar'
import Notification from '../components/Notification'
import { SERVER_URL } from './../../variables';

const navigation = [
    { name: 'Home', href: '#', icon: HomeIcon, current: false },
    { name: 'Jobs', href: '#', icon: BriefcaseIcon, current: false },
    { name: 'Applications', href: '#', icon: DocumentMagnifyingGlassIcon, current: false },
    { name: 'Messages', href: '#', icon: ChatBubbleOvalLeftEllipsisIcon, current: false },
    { name: 'Team', href: '#', icon: UsersIcon, current: false },
    { name: 'Settings', href: '#', icon: CogIcon, current: true },
]
const secondaryNavigation = [
    { name: 'Help', href: '#', icon: QuestionMarkCircleIcon },
    { name: 'Logout', href: '#', icon: ArrowLeftOnRectangleIcon },
]
const tabs = [
    { name: 'General', href: '#', current: true },
    { name: 'Password', href: '#', current: false },
    { name: 'Notifications', href: '#', current: false },
    { name: 'Plan', href: '#', current: false },
    { name: 'Billing', href: '#', current: false },
    { name: 'Team Members', href: '#', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Settings() {
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');


    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true)
    const [autoUpdateApplicantDataEnabled, setAutoUpdateApplicantDataEnabled] = useState(false)


    const [saveStatus, setSaveStatus] = useState('');

    const [nameToggle, setNameToggle] = useState(false);
    const [name, setName] = useState('');
    const [nameChangeNotification, setNameChangeNotification] = useState(false);
    const [imageChangeNotification, setImageChangeNotification] = useState(false);


    const [image, setImage] = useState('' || sessionStorage.getItem('profile_image'));

    const [imageChosen, setImageChosen] = useState(false);

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });



    const handleUpdate = async (token) => {
        const rawResponse = await fetch(`${SERVER_URL}/user/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user: {
                    name: name
                }
            })
        });
        const content = await rawResponse.json();
        console.log(content);
    }
    const handleImage = async (token) => {
        const rawResponse = await fetch(`${SERVER_URL}/user/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user: {
                    dp: image.split(',')[1]
                }
            })
        });
        const content = await rawResponse.json();
        console.log(content);
    }
    const fetchInfo = async (token) => {
        const rawResponse = await fetch(`${SERVER_URL}/user/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const content = await rawResponse.json();
        console.log(content);
        setName(content.user.name);
        setImage(content.user.dp);
    }

    useEffect(() => {
        fetchInfo(token);
    }, [])


    return (
        <>
            <Navbar name={"" || name} email={"email"} role={"role"} token={"token"} getter={() => { }} />
            {/*
        This example requires updating your template:
        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
            <div>

                <Notification
                    heading={"Name updated!"}
                    body={""}
                    state={nameChangeNotification}
                    getter={() => { setNameChangeNotification(false) }}
                />
                <Notification
                    heading={"Profile picture updated!"}
                    body={""}
                    state={imageChangeNotification}
                    getter={() => { setImageChangeNotification(false) }}
                />

                <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">

                    <main className="flex-1">
                        <div className="relative mx-auto max-w-4xl md:px-8 xl:px-0">
                            <div className="pt-10 pb-16">
                                <div className="px-4 sm:px-6 md:px-0">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                                </div>
                                <div className="px-4 sm:px-6 md:px-0">
                                    <div className="py-6">
                                        {/* Tabs */}
                                        <div className="lg:hidden">
                                            <label htmlFor="selected-tab" className="sr-only">
                                                Select a tab
                                            </label>
                                            <select
                                                id="selected-tab"
                                                name="selected-tab"
                                                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                defaultValue={tabs.find((tab) => tab.current).name}
                                            >
                                                {tabs.map((tab) => (
                                                    <option key={tab.name}>{tab.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="hidden lg:block">
                                            <div className="border-b border-gray-200">
                                                <nav className="-mb-px flex space-x-8">
                                                    {tabs.map((tab) => (
                                                        <a
                                                            key={tab.name}
                                                            href={tab.href}
                                                            className={classNames(
                                                                tab.current
                                                                    ? 'border-indigo-500 text-indigo-600'
                                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                                            )}
                                                        >
                                                            {tab.name}
                                                        </a>
                                                    ))}
                                                </nav>
                                            </div>
                                        </div>

                                        {/* Description list with inline editing */}
                                        <div className="mt-10 divide-y divide-gray-200">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                                                <p className="max-w-2xl text-sm text-gray-500">
                                                    This information will be displayed publicly so be careful what you share.
                                                </p>
                                            </div>
                                            <div className="mt-6">
                                                <dl className="divide-y divide-gray-200">
                                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                                        <div className="flex flex-row items-center space-x-2">
                                                            <dt className="text-sm font-medium text-gray-500">Name </dt>

                                                            {saveStatus === `Name saving...` ?
                                                                <svg className="animate-spin -ml-0.5 mr-1.5 w-5 h-5 fill-indigo-600" viewBox="3 3 18 18">
                                                                    <path className="opacity-40" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                                                    </path>
                                                                    <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                                                    </path>
                                                                </svg>
                                                                :
                                                                <></>
                                                            }
                                                        </div>
                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            {nameToggle ?
                                                                <input
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                    id="name"
                                                                    name="name"
                                                                    type="text"
                                                                    className="-my-3 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                                :
                                                                <span className="ml-3 flex-grow">{name}</span>
                                                            }

                                                            <span className={`ml-4 flex-shrink-0`}>
                                                                <button
                                                                    onClick={async () => {
                                                                        if (nameToggle) {
                                                                            setSaveStatus('Name saving...');
                                                                            await handleUpdate(token);
                                                                            setSaveStatus('Saved!');
                                                                            setNameChangeNotification(true);
                                                                            setTimeout(() => {
                                                                                setNameChangeNotification(false);
                                                                            }, 5000);
                                                                        }
                                                                        setNameToggle(nameToggle ^ true)
                                                                    }}
                                                                    type="button"
                                                                    className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                >
                                                                    Update
                                                                </button>
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                                                        <div className="flex flex-row items-center space-x-2">
                                                            <dt className="text-sm font-medium text-gray-500">Photo </dt>

                                                            {saveStatus === `Image saving...` ?
                                                                <svg className="animate-spin -ml-0.5 mr-1.5 w-5 h-5 fill-indigo-600" viewBox="3 3 18 18">
                                                                    <path className="opacity-40" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                                                    </path>
                                                                    <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                                                    </path>
                                                                </svg>
                                                                :
                                                                <></>
                                                            }
                                                        </div>
                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <span className="flex-grow">
                                                                <img
                                                                    className="h-8 w-8 rounded-full"
                                                                    src={`${image && image.includes('base64') ? image : 'data:image/png;base64,' + image}`}
                                                                    alt=""
                                                                />
                                                            </span>
                                                            <span className="ml-4 flex flex-shrink-0 items-start space-x-4">
                                                                <label
                                                                    htmlFor="file-upload"
                                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                                >
                                                                    <span>Chose file</span>
                                                                    {/* <input id="file-upload" name="file-upload" type="file" className="sr-only" /> */}
                                                                </label>
                                                                <input
                                                                    onInput={async (e) => {
                                                                        setImage(await toBase64(e.target.files[0]));
                                                                        setImageChosen(true);

                                                                    }} id="file-upload" name="file-upload" type="file"
                                                                    className="sr-only"
                                                                    accept=".png, .jpeg, .jpg, .gif"

                                                                />
                                                                {imageChosen ?
                                                                    <Fragment>
                                                                        <span className="text-gray-300" aria-hidden="true">
                                                                            |
                                                                        </span>
                                                                        <button
                                                                            onClick={async () => {
                                                                                setSaveStatus('Image saving...');
                                                                                sessionStorage.removeItem('profile_image');
                                                                                await handleImage(token);
                                                                                setSaveStatus('Saved!');
                                                                                setImageChangeNotification(true);
                                                                                setTimeout(() => {
                                                                                    setImageChangeNotification(false);
                                                                                }, 5000);
                                                                            }
                                                                            }
                                                                            type="button"
                                                                            className="rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                        >
                                                                            Save changes
                                                                        </button>
                                                                    </Fragment>

                                                                    :
                                                                    <></>
                                                                }

                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <span className="flex-grow">chelsea.hagon@example.com</span>
                                                            <span className="ml-4 flex-shrink-0">
                                                                <button
                                                                    type="button"
                                                                    className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                >
                                                                    Update
                                                                </button>
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200 sm:py-5">
                                                        <dt className="text-sm font-medium text-gray-500">Job title</dt>
                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <span className="flex-grow">Human Resources Manager</span>
                                                            <span className="ml-4 flex-shrink-0">
                                                                <button
                                                                    type="button"
                                                                    className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                >
                                                                    Update
                                                                </button>
                                                            </span>
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>

                                        <div className="mt-10 divide-y divide-gray-200">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-medium leading-6 text-gray-900">Account</h3>
                                                <p className="max-w-2xl text-sm text-gray-500">
                                                    Manage how information is displayed on your account.
                                                </p>
                                            </div>
                                            <div className="mt-6">
                                                <dl className="divide-y divide-gray-200">
                                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                                        <dt className="text-sm font-medium text-gray-500">Language</dt>
                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <span className="flex-grow">English</span>
                                                            <span className="ml-4 flex-shrink-0">
                                                                <button
                                                                    type="button"
                                                                    className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                >
                                                                    Update
                                                                </button>
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                                                        <dt className="text-sm font-medium text-gray-500">Date format</dt>
                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <span className="flex-grow">DD-MM-YYYY</span>
                                                            <span className="ml-4 flex flex-shrink-0 items-start space-x-4">
                                                                <button
                                                                    type="button"
                                                                    className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                >
                                                                    Update
                                                                </button>
                                                                <span className="text-gray-300" aria-hidden="true">
                                                                    |
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <Switch.Group as="div" className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                                                        <Switch.Label as="dt" className="text-sm font-medium text-gray-500" passive>
                                                            Automatic timezone
                                                        </Switch.Label>
                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <Switch
                                                                checked={automaticTimezoneEnabled}
                                                                onChange={setAutomaticTimezoneEnabled}
                                                                className={classNames(
                                                                    automaticTimezoneEnabled ? 'bg-indigo-600' : 'bg-gray-200',
                                                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-auto'
                                                                )}
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={classNames(
                                                                        automaticTimezoneEnabled ? 'translate-x-5' : 'translate-x-0',
                                                                        'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                                    )}
                                                                />
                                                            </Switch>
                                                        </dd>
                                                    </Switch.Group>
                                                    <Switch.Group
                                                        as="div"
                                                        className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200 sm:py-5"
                                                    >
                                                        <Switch.Label as="dt" className="text-sm font-medium text-gray-500" passive>
                                                            Auto-update applicant data
                                                        </Switch.Label>
                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <Switch
                                                                checked={autoUpdateApplicantDataEnabled}
                                                                onChange={setAutoUpdateApplicantDataEnabled}
                                                                className={classNames(
                                                                    autoUpdateApplicantDataEnabled ? 'bg-indigo-600' : 'bg-gray-200',
                                                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-auto'
                                                                )}
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={classNames(
                                                                        autoUpdateApplicantDataEnabled ? 'translate-x-5' : 'translate-x-0',
                                                                        'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                                    )}
                                                                />
                                                            </Switch>
                                                        </dd>
                                                    </Switch.Group>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

            </div>
        </>
    )
}
