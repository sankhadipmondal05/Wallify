import React, { useState, useRef, useEffect } from 'react';
import { PROJECTS } from '../data/projects';

const ScribbleIcon = () => (
  <svg className="scribble-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path
      d="M50,3 C75.5,3.5 96.5,24.5 97,50 C97.5,75.5 76.5,96.5 50,97 C24.5,97.5 3.5,76.5 3,50 C2.5,24.5 24.5,3.5 50,3 Z M50,5 C26.5,4.5 5.5,24.5 5,50 C4.5,75.5 25.5,95.5 50,95 C74.5,94.5 95.5,74.5 95,50 C94.5,25.5 73.5,5.5 50,5 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="scribble-path"
    />
  </svg>
);

const MediaContent = ({ canvasRef }) => (
  <div className="slice-media-outer">
    <canvas
      ref={canvasRef}
      width={100}
      height={600}
      className="synced-canvas"
      style={{
        width: '100px',
        height: '600px',
        objectFit: 'cover',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%) translateZ(0)',
        willChange: 'transform'
      }}
    />
  </div>
);

const ImmersiveView = ({ initialProjectId = 1, isMuted }) => {
  const [currentIndex, setCurrentIndex] = useState(initialProjectId - 1);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const masterVideoRef = useRef(null);
  const canvasRefs = useRef([]);
  const contextsRef = useRef([]); // Static cache for canvas contexts

  // High-Fidelity Geometry
  const totalWidth = 1040;
  const baseWidth = 120;
  const titleSpace = 100;

  const project = PROJECTS[currentIndex];
  const isAlt = project.id % 2 === 0;

  // Pre-calculate per-strip offsets for common projection and metadata
  const offsets = Array.from({ length: 8 }, (_, i) => {
    let offset = i * baseWidth;
    if (!isAlt && i > 0) offset += titleSpace;
    if (isAlt && i > 5) offset += titleSpace;
    return offset;
  });

  useEffect(() => {
    let animationId;
    const master = masterVideoRef.current;

    // Static Context Initialization
    contextsRef.current = canvasRefs.current.map(canvas =>
      canvas ? canvas.getContext('2d', { alpha: false, desynchronized: true }) : null
    );

    let sw = 0, sh = 0;
    const projectSlices = offsets.map(o => (o / totalWidth));
    const sliceScale = (100 / totalWidth);

    const render = () => {
      if (master && master.readyState >= 2 && !master.paused) {
        if (sw === 0) { sw = master.videoWidth; sh = master.videoHeight; }
        const currentContexts = contextsRef.current;
        for (let i = 0; i < 8; i++) {
          const ctx = currentContexts[i];
          if (!ctx) continue;
          ctx.drawImage(master, projectSlices[i] * sw, 0, sliceScale * sw, sh, 0, 0, 100, 600);
        }
      }
      animationId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationId);
  }, [currentIndex]);

  const handleNav = (dir) => {
    const next = (currentIndex + dir + PROJECTS.length) % PROJECTS.length;
    setCurrentIndex(next);
  };

  const pullStyle = {
    transform: hoveredNav === 'prev' ? 'translateX(30px)' :
      hoveredNav === 'next' ? 'translateX(-30px)' : 'translateX(0)',
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  return (
    <div className="immersive-container">
      <video
        ref={masterVideoRef}
        src={project.video}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        style={{
          visibility: 'hidden',
          position: 'absolute',
          width: '1px',
          height: '1px',
          pointerEvents: 'none'
        }}
        key={project.id}
      />

      {/* Background Playback Lifecycle Manager */}
      <VideoLifecycle masterRef={masterVideoRef} isModalOpen={isModalOpen} />

      <div className={`immersive-navigation left ${hoveredNav === 'prev' ? 'active' : ''}`}
        onClick={() => handleNav(-1)}
        onMouseEnter={() => setHoveredNav('prev')}
        onMouseLeave={() => setHoveredNav(null)}
      >
        <span className="nav-project-name">{PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length].title}</span>
        <div className="nav-arrow-scribble">
          <svg width="80" height="40" viewBox="0 0 80 40">
            <path d="M70,20 C60,18 30,22 10,20 M10,20 L22,12 M10,20 L24,28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <ScribbleIcon />
      </div>

      <div className="immersive-layout-wrapper">
        <div className="immersive-gallery-group" key={project.id} style={pullStyle}>
          <div className="immersive-slice slice-1"><MediaContent canvasRef={el => canvasRefs.current[0] = el} /></div>

          {!isAlt ? (
            <IntegratedTitle project={project} />
          ) : null}

          <div className="immersive-slice slice-2">
            <MediaContent canvasRef={el => canvasRefs.current[1] = el} />
          </div>

          <div className="immersive-slice slice-3"><MediaContent canvasRef={el => canvasRefs.current[2] = el} /></div>
          <div className="immersive-slice slice-4"><MediaContent canvasRef={el => canvasRefs.current[3] = el} /></div>
          <div className="immersive-slice slice-5"><MediaContent canvasRef={el => canvasRefs.current[4] = el} /></div>

          <div className="immersive-slice slice-6">
            <MediaContent canvasRef={el => canvasRefs.current[5] = el} />
          </div>

          {isAlt ? (
            <IntegratedTitle project={project} />
          ) : null}

          <div className="immersive-slice slice-7">
            <MediaContent canvasRef={el => canvasRefs.current[6] = el} />
          </div>
          <div className="immersive-slice slice-8"><MediaContent canvasRef={el => canvasRefs.current[7] = el} /></div>

          {/* Root-level Metadata Overlays: Pushed to the end of the group to ensure they float above everything */}
          {isAlt && <SongLabel project={project} type="alt" offsets={offsets} onPlayClick={() => setIsModalOpen(true)} />}
          {!isAlt && <SongLabel project={project} type="base" offsets={offsets} onPlayClick={() => setIsModalOpen(true)} />}
        </div>
      </div>

      <div className={`immersive-navigation right ${hoveredNav === 'next' ? 'active' : ''}`}
        onClick={() => handleNav(1)}
        onMouseEnter={() => setHoveredNav('next')}
        onMouseLeave={() => setHoveredNav(null)}
      >
        <span className="nav-project-name">{PROJECTS[(currentIndex + 1) % PROJECTS.length].title}</span>
        <div className="nav-arrow-scribble">
          <svg width="80" height="40" viewBox="0 0 80 40">
            <path d="M10,20 C20,22 50,18 70,20 M70,20 L58,12 M70,20 L56,28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <ScribbleIcon />
      </div>

      {/* Cinematic Full-Screen Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoSrc={project.video}
      />
    </div>
  );
};

const IntegratedTitle = ({ project }) => (
  <div className="integrated-info-block">
    <h1 className="immersive-title-integrated">{project.title}</h1>
    <div className="immersive-meta-integrated">
      <span className="accent-letter-integrated">{project.accent || '終'}</span>
      <span className="extra-material-text-integrated">{project.extra}</span>
    </div>
  </div>
);

const SongLabel = ({ project, type, offsets, onPlayClick }) => {
  // We calculate the absolute position relative to the root group
  // Base: centered on the gap before slice 7
  // Alt: centered on the gap before slice 2
  const leftPos = type === 'alt' ? (offsets[1] - 30) : (offsets[6] - 10);

  return (
    <div className="vertical-label-container integrated overlay" style={{ left: `${leftPos}px` }}>
      <span className="vertical-song-title">{project.song}</span>
      <div className="play-icon-node" onClick={(e) => { e.stopPropagation(); onPlayClick(); }}>
        <svg width="10" height="12" viewBox="0 0 10 12"><path d="M2 2 L8 6 L2 10 Z" fill="white" /></svg>
      </div>
    </div>
  );
};

const VideoModal = ({ isOpen, onClose, videoSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <button className="modal-close-btn" onClick={onClose}>
        <svg width="30" height="30" viewBox="0 0 30 30">
          <path d="M5,5 L25,25 M25,5 L5,25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <video
          className="modal-video-full"
          src={videoSrc}
          autoPlay
          controls
          playsInline
        />
      </div>
    </div>
  );
};

const VideoLifecycle = ({ masterRef, isModalOpen }) => {
  useEffect(() => {
    const video = masterRef.current;
    if (!video) return;

    if (isModalOpen) {
      video.pause();
    } else {
      // Resume if we close modal, matching autoPlay behavior
      video.play().catch(() => {
        // Fallback for browser autoplay policies
      });
    }
  }, [isModalOpen, masterRef]);

  return null;
};


export default ImmersiveView;
