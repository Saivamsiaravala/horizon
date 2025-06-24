import React, { createContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const App = () => {
  const [audioMode, setAudioMode] = useState(true);
  const navigate = useNavigate();

  const handleToggle = () => {
    setAudioMode(!audioMode);
    if (audioMode) {
      navigate("/video");
    } else {
      navigate("");
    }
  };

  return (
    <div className="app">
      <label className="toggle-switch">
        <input type="checkbox" onChange={handleToggle} />
        <span className="slider"></span>
      </label>
      <header>
        <h1>Horizon A/V recorder</h1>
      </header>
      {/* <nav>
        <button onClick={setPage}>
          Switch to {audioMode ? <>Video</> : <>Audio</>}
        </button>
      </nav> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
