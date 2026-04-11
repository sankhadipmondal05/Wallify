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
const ResourcePreloader = ({ projects }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 1. Immediate Image Warm-up: These are light, fetch them all at once
    // Optimized for LCP: Images now get priority on the network.
    projects.forEach(p => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = p.image;
    });

    // 2. Delayed Sequential Video Warm-up
    // We delay the video preloading to ensure LCP images win the network race.
    const preloaderTimeout = setTimeout(() => {
      if (index >= projects.length) return;

      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = projects[index].video;
      video.preload = 'auto';
      video.muted = true;
      
      const onCanPlay = () => {
        setIndex(prev => prev + 1);
        video.removeEventListener('canplay', onCanPlay);
      };

      video.addEventListener('canplay', onCanPlay);
      
      const timeout = setTimeout(() => {
         setIndex(prev => prev + 1);
      }, 4000);

      return () => {
        video.removeEventListener('canplay', onCanPlay);
        clearTimeout(timeout);
      };
    }, 1500); // 1.5s delay prevents video from choking the image paint

    return () => clearTimeout(preloaderTimeout);
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
          <ResourcePreloader projects={PROJECTS} />
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


