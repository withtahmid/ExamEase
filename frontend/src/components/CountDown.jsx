import React from 'react'
import './sticky.css'

export default function CountDown({ hours, minutes, seconds }) {
    return (
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": Math.floor(seconds / 3600) }}></span>
                </span>
                hour{Math.floor(seconds / 3600) > 1 ? "s" : ""}
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": Math.floor((seconds % 3600) / 60) }}></span>
                </span>
                min
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": seconds - 3600 * Math.floor(seconds / 3600) - 60 * Math.floor((seconds % 3600) / 60) }}></span>
                </span>
                sec
            </div>
        </div>
    )
}
