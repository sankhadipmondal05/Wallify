import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';

const ScribbleIcon = ({ containerRef }) => {
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  const pathLen = useRef(0);

  // Initialize path geometry correctly for a 100% precise look
  React.useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      pathLen.current = len;
      // Start hidden with a dash that's exactly 100% of the path
      gsap.set(pathRef.current, {
        strokeDasharray: len,
        strokeDashoffset: len
      });
    }

    if (containerRef.current) {
      const btn = containerRef.current;
      btn.addEventListener('mouseenter', handleEnter);
      btn.addEventListener('mouseleave', handleLeave);
      return () => {
        btn.removeEventListener('mouseenter', handleEnter);
        btn.removeEventListener('mouseleave', handleLeave);
      };
    }
  }, [containerRef]);

  const handleEnter = () => {
    // Precise draw-in: Slowed down to 1s for hand-drawn 'sketch' visibility
    gsap.to(svgRef.current, { opacity: 1, duration: 0.4 });
    gsap.to(pathRef.current, {
      strokeDashoffset: 0, // Back to exactly 100% (no overlap)
      duration: 1,
      ease: "power2.inOut",
      overwrite: true
    });
  };



  const handleLeave = () => {
    // Snappier, smooth reset
    gsap.to(svgRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(pathRef.current, {
      strokeDashoffset: pathLen.current, // Back to hidden
      duration: 0.6,
      ease: "power2.inOut",
      overwrite: true
    });
  };

  return (
    <svg
      className="scribble-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      ref={svgRef}
      style={{ pointerEvents: 'none' }}
    >
      <path
        ref={pathRef}
        d="M50,8 C70,4 96,18 96,48 C96,78 78,96 50,96 C22,96 4,76 4,46 C4,16 32,4 52,6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="scribble-path"
      />
    </svg>
  );
};

const Navbar = ({ viewMode, onToggleView, isIntro, isMuted, onToggleMute }) => {
  const toggleBtnRef = useRef(null);
  const muteBtnRef = useRef(null);

  return (
    <header className={`main-header ${isIntro ? 'intro-active' : ''}`}>
      <div className="header-left">
        {!isIntro && (
          <button
            className="nav-icon-btn circular-btn"
            ref={muteBtnRef}
            onClick={onToggleMute}
          >
            {isMuted ? (
              <svg viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
            )}
            <ScribbleIcon containerRef={muteBtnRef} />
          </button>
        )}
      </div>

      <div className="header-center">
        <h1 className={`wallify-brand ${isIntro ? 'is-intro' : 'is-morphed'}`}>
          Wallify
        </h1>
      </div>

      <div className="header-right">
        {!isIntro && (
          <button
            className="nav-icon-btn circular-btn"
            ref={toggleBtnRef}
            onClick={onToggleView}
          >
            {viewMode === 'grid' ? (
              <svg viewBox="0 0 20 20" width="16" fill="currentColor"><path d="M2 10h4v4H2v-4zm0-6h4v4H2V4zm6 6h4v4H8v-4zm0-6h4v4H8V4zm6 6h4v4h-4v-4zm0-6h4v4h-4V4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            )}
            <ScribbleIcon containerRef={toggleBtnRef} />
          </button>
        )}
      </div>
    </header>
  );
};


export default Navbar;
