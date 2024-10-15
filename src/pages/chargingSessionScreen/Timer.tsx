
// import React, { useState, useEffect } from 'react';

// interface TimerProps {
//   startTime: number; // Start time in milliseconds
// }

// const Timer = (props : any) => {

//   const [time, setTime] = useState<Date>(new Date(props.startTime));

//   useEffect(() => {
//     console.log("timer start time --- ", props.startTime)
//     // Update the timer every second
//     const interval = setInterval(() => {
//       setTime((prevTime) => new Date(prevTime.getTime() + 1000));
//     }, 1000);

//     // Cleanup on component unmount
//     return () => clearInterval(interval);
//   }, [props.startTime]);

//   // Format the time: 0:00:0 (hours:minutes:seconds)
//   const formatTime = (date: Date) => {
//     const hours = date.getUTCHours();
//     const minutes = date.getUTCMinutes();
//     const seconds = date.getUTCSeconds();
//     return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`;
//   };

//   return (
//     <div>
//       <h1>{formatTime(time)}</h1>
//     </div>
//   );
// };

// export default Timer;

import React, { useState, useEffect } from 'react';

interface TimerProps {
  startTime: number; // Start time in milliseconds
}

const Timer= (props : any) => {
  const [time, setTime] = useState<Date>(new Date(props.startTime));
  const [isRunning, setIsRunning] = useState<boolean>(true); // State to track if the timer is running

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // User came back to the page, refresh the page
      window.location.reload();
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setIsRunning(!(props.isChargingStopped))
  }, [props.isChargingStopped])

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => new Date(prevTime.getTime() + 1000));
      }, 1000);
    }

    // Cleanup on component unmount or when the timer stops
    return () => clearInterval(interval);
  }, [isRunning]); // Add isRunning as a dependency to start/stop the timer

  // Function to toggle the timer on or off
  const toggleTimer = (run: boolean) => {
    setIsRunning(run);
  };

  // Format the time: 0:00:0 (hours:minutes:seconds)
  const formatTime = (date: Date) => {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>{formatTime(time)}</h1>
    </div>
  );
};

export default Timer;

