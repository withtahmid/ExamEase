import { useEffect, useState } from "react"
import DisputeList from "./DisputeList";
import Navbar from "./Navbar";

import { SERVER_URL } from './../../variables';

const myDisputes = [
    {
        id: 1,
        rating: 5,
        content: `
      <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
    `,
        date: 'July 16, 2021',
        datetime: '2021-07-16',
        author: 'Emily Selman',
        avatarSrc:
            'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    },
    {
        id: 2,
        rating: 5,
        content: `
      <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
    `,
        date: 'July 12, 2021',
        datetime: '2021-07-12',
        author: 'Hector Gibbons',
        avatarSrc:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    },
    // More myDisputes...
]
let myTabs = [
    { name: 'Recent', href: '#', count: '', current: true },
    { name: 'Open', href: '#', count: '', current: false },
    { name: 'All', href: '#', count: '', current: false }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DisputeTabs() {
    const [tabs, setTabs] = useState(myTabs);
    const [disputes, setDisputes] = useState([]);


    const onChangeInput = (name, mode) => {
        const badge = tabs.map((item) => (item.name === "Open" && "count") ? { ...item, ["count"]: disputes.filter(d => !d.resolved).length } : (item.name === "All" && "count") ? { ...item, ["count"]: disputes.length } : (item.name === "Recent" && "count") ? { ...item, ["count"]: (() => disputes.slice(0, Math.min(10, disputes.length)))().length } : item);
        const toggle = tabs.map((item) => item.name === name && "current" ? { ...item, ["current"]: true } : item.name !== name ? { ...item, ["current"]: false } : item);
        mode === "Tab" ? setTabs(toggle) : setTabs(badge);
    }
    const token = localStorage.getItem('examease_token') || sessionStorage.getItem('examease_token');




    const fetchDisputes = async (token) => {
        const rawResponse = await fetch(`${SERVER_URL}/dispute`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const content = await rawResponse.json();
        setDisputes(content.disputes.reverse());



        console.log(content)

    }
    useEffect(() => {
        fetchDisputes(token);

    }, [])

    useEffect(() => {
        onChangeInput("Recent", "Badge");
        // if (disputes && disputes.length !== 0) {
        // }
    }, [disputes])

    const filterDisputes = () => {
        // if (tabs[1].current) {
        //     return disputes.filter(d => !d.resolved);
        // }
        return disputes;
    }



    return (
        <div>
            <Navbar name={"name"} email={"email"} role={"role"} token={token} getter={() => { }} />

            <div className="bg-white sm:mx-64 mx-4 mt-12">

                <div className="space-y-2 mb-2">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Disputes
                        </h2>
                    </div>
                </div>

                <div className="sm:hidden">
                    <label htmlFor="myTabs" className="sr-only">
                        Select a tab
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                        id="myTabs"
                        name="myTabs"
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue={tabs.find((tab) => tab.current).name}
                    >
                        {tabs && tabs.map((tab) => (
                            <option onClick={() => { onChangeInput(tab.name, "Tab") }} key={tab.name}>{tab.name}</option>
                        ))}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs && tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => { onChangeInput(tab.name, "Tab") }}
                                    // href="#"
                                    className={classNames(
                                        tab.current
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                                        'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm'
                                    )}
                                    aria-current={tab.current ? 'page' : undefined}
                                >
                                    {tab.name}
                                    {tab.count ? (
                                        <span
                                            className={classNames(
                                                tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                                                'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    ) : null}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
                <DisputeList disputes={tabs[1].current ? disputes.filter(d => !d.resolved) :
                    tabs[1].current ? (() => disputes.slice(0, Math.min(10, disputes.length)))() : disputes} />
            </div>
        </div>
    )
}
