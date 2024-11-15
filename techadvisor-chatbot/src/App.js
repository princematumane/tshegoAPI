import React, { useState } from "react";
import TUTHomePage from "./components/TUTHomePage/TUTHomePage";
import "./App.css";
import { UserProvider } from "./UserContext/UserContext";

const App = () => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep(step + 1);
  };

  return (
    <div className="App">
      <UserProvider>
        {step === 0 && <TUTHomePage onNext={handleNext} />}
      </UserProvider>
    </div>
  );
};

export default App;
