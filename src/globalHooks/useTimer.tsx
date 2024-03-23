import { useCallback, useEffect, useMemo, useState } from 'react'

function useTimer() {
  const [hrs, setHrs] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);
  const [currTime, setCurrTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState('');
  const [startTimer, setStartTimer] = useState(false);
  const [intervalID, setIntervalID] = useState<any>(null);

  const increment = () => setCurrTime(oldCounter => oldCounter + 1);

  const onStartTimer = () => {
    if (intervalID === null) { // To prevent starting multiple intervals
      const hrs = String(Math.floor(currTime / 3600)).padStart(2, '0');
      const mins = String(Math.floor((currTime % 3600) / 60)).padStart(2, '0');
      const secs = String(Math.floor(currTime % 60)).padStart(2, '0');
      const fTime = `${hrs}:${mins}:${secs}`;
      // setCurrTime((init: number) => init + 1);
      setFormattedTime(fTime);
      setIntervalID(setInterval(increment, 1000));
    }
  }


//   const formattedTime = useMemo(() => `${hrs}: ${mins}, ${secs}`, [hrs, mins, secs]);
  const runTimer = () => {
    const interval = setInterval(() => {
      const hrs = String(Math.floor(currTime / 3600)).padStart(2, '0');
      const mins = String(Math.floor((currTime % 3600) / 60)).padStart(2, '0');
      const secs = String(Math.floor(currTime % 60)).padStart(2, '0');
      const fTime = `${hrs}:${mins}:${secs}`;
      setCurrTime((init: number) => init + 1);
      setFormattedTime(fTime);
    }, 900);
    return () => clearInterval(interval);
  };

  // if (startTimer) runTimer();
  
  return { formattedTime, setStartTimer, runTimer, onStartTimer }
}

export default useTimer;
