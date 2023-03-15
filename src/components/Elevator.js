import React, { useEffect, useState } from "react";
import "../style/components/Elevator.css";
import { ReactComponent as Logo } from "../style/elevator.svg";
import bell from "../sounds/ElevatorBellDing.mp3";

const Elevator = ({
  numberOfFloors,
  id,
  currentFloor,
  nextFloor,
  targetFloor,
  changeButtonStatus,
  continueToNextCall,
  elevatorCalls,
  removeCallFromElevatorQueue,
  staticCall
}) => {
  const [floors, setFloors] = useState()
  const getComponentName = () => `elevator-${id}-logo`;
  const isElevatorArriving = () => currentFloor === targetFloor;
  const isElevatorMoving = () => currentFloor !== nextFloor;
  const getElevatorElement = () => document.querySelector(`#${getComponentName()}`);

  const createFloors = () => {
    let floors = [];
    for (let i = 0; i < numberOfFloors; i++) {
      const floor = {
        index: (numberOfFloors - i - 1),
        time: 0,
      };
      floors.push(floor);
    }
    setFloors(floors);
  };

  const updatesOnFinish = () => {
    if (isElevatorArriving()) {
      const elevator = getElevatorElement();
      elevator.style.stroke = "#77d59b";
      elevator.style.bottom = `${nextFloor * 50 }px`;
      playSound();
      if (elevatorCalls.length) {
        if (targetFloor) {
        changeButtonStatus(currentFloor);
        removeCallFromElevatorQueue(currentFloor, id);
        } else if (elevatorCalls[0] === targetFloor) { 
        changeButtonStatus(currentFloor);
        removeCallFromElevatorQueue(currentFloor, id);
        }
      }

    setTimeout(() => {
      const elevator = getElevatorElement();
      elevator.style.stroke = "none";
      if (elevatorCalls.length) {
        if (targetFloor) {
          changeButtonStatus(targetFloor);
        } else if (elevatorCalls[0] === targetFloor) { 
          changeButtonStatus(targetFloor);
        }
      }
      continueToNextCall(id);
      }, 2000);
    }
  };

  const createMovingAnimation = () => {
    if (isElevatorMoving()) {
      const currentFloorPosition = `${currentFloor * 50 }px`;
      const nextFloorPosition = `${nextFloor * 50}px`;
      const elevator = getElevatorElement();
      elevator.style.bottom = `${currentFloor * 50}px`;
      elevator.animate(
        [{ bottom: currentFloorPosition }, { bottom: nextFloorPosition }],
        { duration: 1000, animationFillMode: "forward" }
      );
      elevator.style.stroke = "#f07276";
    }
  };

  const playSound = () => { 
    const audio = new Audio(bell);
    audio.play()
  }

  const calcTime = () => { 
    const gap = Math.abs(targetFloor - currentFloor);
    if (!isElevatorArriving()) {
      return `${gap} Sec.`
    }else { 
      return ``
    }
  }

  const gotStaticCall = () => { 
    if(staticCall){
      const elevator = getElevatorElement();
      elevator.style.stroke = "#77d59b";
      playSound();
      changeButtonStatus(currentFloor);
      removeCallFromElevatorQueue(currentFloor, id);
      setTimeout(() => {
        const elevator = getElevatorElement();
        elevator.style.stroke = "none";
        changeButtonStatus(targetFloor);
        continueToNextCall(id);
      }, 2000);
    }
  }

  createMovingAnimation();
  useEffect(() => createFloors(), []);
  useEffect(() => updatesOnFinish(), [currentFloor, nextFloor]);
  useEffect(() => gotStaticCall(), [staticCall]);

  return (
    <div className="column">
      <Logo id={getComponentName()} className="elevator" />
      {floors &&
        floors.map((floor, index) => (
          <div className="cell" key={index}>
            {floor.index === elevatorCalls[0] ? calcTime() : null}
          </div>
        ))}
    </div>
  );
};

export default React.memo(
  Elevator,
  (pP, nP) =>
    pP.nextFloor === nP.nextFloor &&
    pP.currentFloor === nP.currentFloor &&
    pP.staticCall === nP.staticCall
);
