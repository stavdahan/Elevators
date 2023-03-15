import React, { useEffect, useState } from "react";
import "../style/components/Board.css";
import CallButton from "./CallButton";
import Floors from "./Floors";
import Elevator from "./Elevator";

function Board({ numberOfFloors, numberOfElevators }) {
  const [buttons, setButtons] = useState([]);
  const [calls, setCalls] = useState([]);
  const [elevators, setElevators] = useState([]);

  const createButtons = () => {
    let buttons = [];
    for (let i = 0; i < numberOfFloors; i++) {
      buttons.push({
        id: i,
        status: "available",
        text: "call",
      });
    }
    setButtons(buttons);
  };

  const createBuilding = () => {
    let createdElevators = [];
    for (let i = 0; i < numberOfElevators; i++) {
      let elevator = {
        id: i,
        currentFloor: 0,
        nextFloor: 0,
        target: -1,
        calls: [],
        staticCall: 0
      };
      createdElevators.push(elevator);
    }
    setElevators(createdElevators);
  };

  const addCall = (floor) => {
    let newCalls = [...calls];
    newCalls.push(floor);
    setCalls(newCalls);
  };

  const removeCallFromElevatorQueue = (floor, id) => {
    const copyElevators = [...elevators] 
    copyElevators[id].calls = copyElevators[id].calls.filter((call) => call !== floor);
    setElevators(copyElevators);
  };

  const callElevator = (floor) => {
   const copyElevators = [...elevators];
   const elevatorId = chooseElevator(floor);
   if (elevatorId === -1) {
     addCall(floor)
   } else if (copyElevators[elevatorId].calls.length == 1) {
     let gapFromNextCall = Math.abs(floor - copyElevators[elevatorId].currentFloor);
     if (gapFromNextCall) {
        for (let i = 0; i <= gapFromNextCall; i++) {
          moveElevator(floor, elevatorId, i);
        }
     } else { 
       copyElevators[elevatorId].staticCall++;
       setElevators(copyElevators)
     }
   }
 };
     
  const chooseElevator = (floor) => {
    let elevatorId = -1;
    let minGap = numberOfFloors;
    for (let elevator of elevators) {
      let gap;
      const isElevatorOnGround = ((!elevator.currentFloor && !elevator.target) || elevator.target === -1);
      const isElivatorGoingUp = elevator.target > elevator.currentFloor;
      const isElivatorGoingDown = elevator.target < elevator.currentFloor;
      const isFloorLowerThanElevator = elevator.target < floor && floor < elevator.currentFloor;
      const isFloorHigherThanElevator = elevator.target < floor;
      const isElevatorStatic = elevator.target === elevator.currentFloor;

      if (!isElevatorOnGround) {
        if (isElivatorGoingDown && isFloorLowerThanElevator) { 
          gap = elevator.currentFloor - floor;
        }
        else if (isFloorHigherThanElevator) {
          continue;
        }
        else if (isElivatorGoingUp) {
          const gapToTarget = elevator.target - elevator.currentFloor;
          const gapFromTarget = elevator.target - floor;
          gap = gapToTarget + gapFromTarget;
          
        } else if (isElevatorStatic) {
          gap = elevator.target - floor;
        }
      }
      else {
        gap = floor;
      }

      if (gap < minGap) {
        minGap = gap;
        elevatorId = elevator.id;
      }
    }

    if (elevatorId !== -1) {
      const copyElevators = [...elevators];
      copyElevators[elevatorId].calls.push(floor);
      copyElevators[elevatorId].calls.sort((a, b) => b - a);
      copyElevators[elevatorId].target = copyElevators[elevatorId].calls[0];
      setElevators(copyElevators);
    }
    return elevatorId;
  }
  
  const moveElevator = (floor, elevatorId, seconds) => {
    const copyElevators = [...elevators];
    let elevator = copyElevators[elevatorId];
    elevator.target = floor;
    setTimeout(() => {
      elevator.currentFloor = elevator.nextFloor;
      if (elevator.target > elevator.nextFloor) {
        elevator.nextFloor++;
      } else if (elevator.target < elevator.nextFloor) {
        elevator.nextFloor--;
      }
      setElevators(copyElevators);
    }, (seconds + 1) * 1000);
  }

  const continueToNextCall = (elevatorId) => {
    const copyElevators = [...elevators];
    let elevator = copyElevators[elevatorId];
    let nextFloor = elevator.calls.length ? elevator.calls[0] : 0;
    let gapFromNextCall = Math.abs(nextFloor - copyElevators[elevatorId].currentFloor);
    if (!gapFromNextCall){ 
      nextFloor = moveCallFromCallsToElevator()
      if (!!nextFloor) { 
        gapFromNextCall = nextFloor;
        elevator.calls.push(nextFloor);
      }
    }
    for (let i = 0; i <= gapFromNextCall; i++) {
      moveElevator(nextFloor, elevatorId, i);
    }
  }

  const moveCallFromCallsToElevator = () => {
    const copyCalls = [...calls];
    if (calls.length) {
      const floor = copyCalls.shift();
      setCalls(copyCalls);
      return floor;
    }
  };

  const changeButtonStatus = (buttonId) => { 
    const copyButtons = [...buttons]
    const status = buttons[buttonId].status
    switch (status) {
      case "available":
        copyButtons[buttonId].status = "unavailable";
        copyButtons[buttonId].text = "Waiting";
        break;
      case "unavailable":
        copyButtons[buttonId].status = "arrived";
        copyButtons[buttonId].text = "Arrived";
        break;
      case "arrived":
        copyButtons[buttonId].status = "available";
        copyButtons[buttonId].text = "Call";
        break;
    }
    setButtons(copyButtons)
  }

  useEffect(() => {
      createBuilding();
      createButtons();
    }, []);

  return (
    <div className="board">
      <Floors numberOfFloors={numberOfFloors} />
      <div className="building">
        {elevators &&
          elevators.map((elevatorDetails) => {
            return (
              <Elevator
                key={elevatorDetails.id}
                numberOfFloors={numberOfFloors}
                id={elevatorDetails.id}
                currentFloor={elevatorDetails.currentFloor}
                nextFloor={elevatorDetails.nextFloor}
                targetFloor={elevatorDetails.target}
                changeButtonStatus={changeButtonStatus}
                continueToNextCall={continueToNextCall}
                elevatorCalls={elevatorDetails.calls}
                removeCallFromElevatorQueue={removeCallFromElevatorQueue}
                staticCall={elevatorDetails.staticCall}
              />
            );
          })}
      </div>
      <div className="buttons">
        {buttons &&
          buttons.map((button) => {
            return (
              <CallButton
                key={button.id}
                details={button}
                call={callElevator}
                changeButtonStatus={changeButtonStatus}
              />
            );
          })}
      </div>
    </div>
  );
}

export default Board;
