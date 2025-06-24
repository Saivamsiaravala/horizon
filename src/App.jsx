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
        <h1>Horizon A/V</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
