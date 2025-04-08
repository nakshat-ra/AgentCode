import React from 'react'
import { useState, useEffect } from 'react';

const Latency = () => {

  const [latency, setLatency] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const lat = 0;
      setLatency(lat);
    }, 1000);
    return () => clearInterval(interval); 
  }, []);

  return (
    <p className='text-black'>Latency : {latency}


    </p>
  )
}

export default Latency