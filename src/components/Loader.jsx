import React, { useState, useEffect } from 'react';

const Loader = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // 2.5s reveal + 0.5s pause
    const timer = setTimeout(() => {
      setFade(true);
      onFinish(); 
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);


  return (
    <div className={`loader-container ${fade ? 'fade-out' : ''}`}>
      {/* Background/Backdrop only */}
    </div>
  );
};

export default Loader;
