import React, { useEffect, useState } from 'react'

export default function AudioPlayer({ b64 }) {
    const [src, setSrc] = useState('');

    useEffect(() => {
        setSrc(b64);

    }, [b64])

    return (
        <div>
            <audio controls="controls">
                <source src={src} />
                {console.log(src)}
            </audio>
        </div>
    )
}
