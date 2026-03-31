import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import WorkView from '../components/WorkView';
import ImmersiveView from '../components/ImmersiveView';

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
              <ImmersiveView 
                initialProjectId={selectedProjectId}
                isMuted={isMuted} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;


