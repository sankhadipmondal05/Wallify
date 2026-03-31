import React, { useState } from 'react';
import Loader from './components/Loader';
import Home from './pages/Home';

function App() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <div className="site-wrapper">
      <Loader onFinish={() => setShowLoader(false)} />
      <Home showLoader={showLoader} />
    </div>
  );
}


export default App;

