import React, { useEffect, useState } from 'react'

function Timer() {
    const [currTime, setCurrTime] = useState(0);
    const [formattedTime, setFormattedTime] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
        const hrs = String(Math.floor(currTime / 3600)).padStart(2, '0');
        const mins = String(Math.floor((currTime % 3600) / 60)).padStart(2, '0');
        const secs = String(Math.floor(currTime % 60)).padStart(2, '0');
        const fTime = `${hrs}:${mins}:${secs}`;
        setCurrTime((init: number) => init + 1);
        setFormattedTime(fTime);
        }, 900);
        return () => clearInterval(interval);
    }, [currTime])

    return (
        <div>{formattedTime}</div>
    )
}

export default Timer