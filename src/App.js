import React, { useState } from "react";
import "./style/App.css";
import Board from "./components/Board";

function App() {
  const [numberOfElevators, setNumberOfElevators] = useState(0)
  const [numberOfFloors, setNumberOfFloors] = useState(0);
  const areValuesEmpty = () => numberOfElevators && numberOfFloors;
  const initApp = () => {
    if (!areValuesEmpty()) {
      let answerElevators = prompt("Please enter the elevators number:","5");
      let answerFloors = prompt("Please enter the floors number:", "10");
      setNumberOfElevators(answerElevators);
      setNumberOfFloors(answerFloors);
    }
  }

  initApp()

  return (
    <div className="App">
      <div className="header">Elevators Exercise</div>
      <Board
        numberOfElevators={Number(numberOfElevators)}
        numberOfFloors={Number(numberOfFloors)}
      />
    </div>
  );
}

export default App;
