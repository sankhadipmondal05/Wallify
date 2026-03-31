import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import WorkView from '../components/WorkView';
import { PROJECTS } from '../data/projects';

// High-Fidelity Deferred Loading: Lower initial bundle weight
const ImmersiveView = lazy(() => import('../components/ImmersiveView'));

/**
 * High-Fidelity Video Preloader
 * Sequentially "warms up" the browser cache for project videos
 * to ensure stutter-free transitions on Vercel.
 */
const VideoPreloader = ({ projects }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= projects.length) return;

    // Use a light-weight background fetch
    const video = document.createElement('video');
    video.src = projects[index].video;
    video.preload = 'auto';
    video.muted = true;
    
    // Once one project is cached enough, move to the next
    const onCanPlay = () => {
      setIndex(prev => prev + 1);
      video.removeEventListener('canplay', onCanPlay);
    };

    video.addEventListener('canplay', onCanPlay);
    
    // Safety timeout: don't clog if one video fails
    const timeout = setTimeout(() => {
       setIndex(prev => prev + 1);
    }, 4000);

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      clearTimeout(timeout);
    };
  }, [index, projects]);

  return null;
};

const Home = ({ showLoader }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted to ensure browser gesture policy
  const [selectedProjectId, setSelectedProjectId] = useState(1);

  // High-performance view switcher with ID preservation & Jitter mitigation
  const triggerViewChange = (projectId = null) => {
    if (isTransitioning) return;
    if (projectId) setSelectedProjectId(projectId);
    
    setIsTransitioning(true);
    
    // Toggle the logical switch halfway through (coordinated with CSS wipe)
    setTimeout(() => {
      setViewMode(prev => prev === 'grid' ? 'immersive' : 'grid');
    }, 450);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // Slightly longer to ensure exit animations finish
  };

  return (
    <div className={`home-page ${isTransitioning ? 'view-transitioning' : ''}`}>
      <Navbar 
        viewMode={viewMode} 
        onToggleView={() => triggerViewChange()} 
        isIntro={showLoader} 
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />
      
      {!showLoader && (
        <>
          <VideoPreloader projects={PROJECTS} />
          <div className="view-layer">
            {/* Overlapping Render: Keep both alive during transition to eliminate stutter */}
            {(viewMode === 'grid' || isTransitioning) && (
              <div className={`view-instance ${viewMode === 'grid' ? 'show' : 'hide'}`}>
                <WorkView 
                  isLeaving={isTransitioning && viewMode === 'immersive'} 
                  onProjectClick={(id) => triggerViewChange(id)}
                  isMuted={isMuted}
                /> 
              </div>
            )}

            {(viewMode === 'immersive' || isTransitioning) && (
              <div className={`view-instance ${viewMode === 'immersive' ? 'show' : 'hide'}`}>
                <Suspense fallback={null}>
                  <ImmersiveView 
                    initialProjectId={selectedProjectId}
                    isMuted={isMuted} 
                  />
                </Suspense>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;


