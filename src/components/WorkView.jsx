import React, { useState, useRef, useEffect } from 'react';
import { PROJECTS } from '../data/projects';

const WorkView = ({ isLeaving, onProjectClick, isMuted }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [settledId, setSettledId] = useState(null);
  const [isFastHover, setIsFastHover] = useState(false);

  const hoverTimeoutRef = useRef(null);
  const videoTimeoutRef = useRef(null);
  const settleTimeoutRef = useRef(null);
  const globalLeaveTimeoutRef = useRef(null);
  const lastHoverTimeRef = useRef(0);

  const handleZoneEnter = (id) => {
    if (globalLeaveTimeoutRef.current) clearTimeout(globalLeaveTimeoutRef.current);

    setActiveVideoId(null);
    setSettledId(null);

    const now = Date.now();
    const timeSinceLastHover = now - lastHoverTimeRef.current;

    if (timeSinceLastHover < 250) {
      setIsFastHover(true);
    } else {
      setIsFastHover(false);
    }
    lastHoverTimeRef.current = now;

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredId(id);

      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
      videoTimeoutRef.current = setTimeout(() => {
        setActiveVideoId(id);
      }, 150);

      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = setTimeout(() => {
        setSettledId(id);
      }, 450);
    }, 15);
  };

  const handleGlobalLeave = () => {
    if (globalLeaveTimeoutRef.current) clearTimeout(globalLeaveTimeoutRef.current);
    globalLeaveTimeoutRef.current = setTimeout(() => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);

      setHoveredId(null);
      setActiveVideoId(null);
      setSettledId(null);
      setIsFastHover(false);
    }, 100);
  };

  const activeWork = settledId
    ? PROJECTS.find(w => w.id === settledId)
    : (!hoveredId ? { title: 'Featured Collection', id: 'default' } : null);

  return (
    <div className="home-content">
      <div
        className="strips-wrapper-fixed"
        onMouseLeave={handleGlobalLeave}
      >
        <div className="hit-zones-container">
          {PROJECTS.map((work) => (
            <div
              key={`hit-${work.id}`}
              className="hit-zone"
              onMouseEnter={() => handleZoneEnter(work.id)}
              onClick={() => onProjectClick(work.id)}
            />
          ))}
        </div>

        <div className={`strips-container ${isLeaving ? 'is-leaving' : ''}`}>
          {PROJECTS.map((work, i) => (
            <div
              key={work.id}
              className={`work-strip ${hoveredId === work.id ? 'is-hovered' : ''}`}
            >
              <div className="strip-image-wrapper">
                <img
                  className={`strip-image gray-wash ${hoveredId === work.id ? 'hide' : ''}`}
                  src={work.image}
                  alt={work.title}
                  loading="lazy"
                  onError={(e) => { e.target.style.background = `rgba(0,0,0,${0.1 + (i * 0.05)})`; e.target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; }}
                />
                <div className={`video-overlay ${activeVideoId === work.id ? 'active' : ''}`}>
                  {activeVideoId === work.id && (
                    <StripVideo src={work.video} isMuted={isMuted} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className={`featured-text-container ${isFastHover ? 'fast-mode' : ''} ${!activeWork ? 'hide-text' : ''}`}>
        <h2
          className="featured-title"
        >
          {/* We use a stable title wrapper to prevent glitchy re-mounts */}
          <span
            key={activeWork ? activeWork.id : 'none'}
            className="title-inner-reveal"
          >
            {(activeWork ? activeWork.title : 'Featured Work').split('').map((char, index) => (
              <span
                key={index}
                className={`char-reveal ${index % 2 === 0 ? 'from-top' : 'from-bottom'}`}
                style={{
                  animationDelay: isFastHover ? '0s' : `${0.2 + (index * 0.03)}s`,
                  animationDuration: isFastHover ? '0.2s' : '0.7s'
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h2>
        <span
          key={settledId ? `sub-${settledId}` : 'sub-default'}
          className="featured-subtitle animate-subtitle"
          style={{ animationDelay: isFastHover ? '0.1s' : '0.6s' }}
        >
          {settledId ? 'Explore Immersive View' : 'By Sankhadip'}
        </span>
      </div>
    </div>
  );
};

// Robust Video Component to ensure playback reliability
const StripVideo = ({ src, isMuted }) => {
  const videoRef = useRef(null);

  // Sync muted state dynamically without interrupting playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startPlayback = async () => {
      try {
        // Essential: Reset to source and ensure readiness
        await video.play();
      } catch (err) {
        // If sound is blocked by default browser policy, we fallback to muted
        // This ensures the visual interaction of the strip is never lost.
        video.muted = true;
        video.play().catch(e => console.warn("Playback failed:", e));
      }
    };

    startPlayback();
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="strip-video"
      loop
      muted={isMuted}
      playsInline
      src={src}
      preload="auto"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default WorkView;




