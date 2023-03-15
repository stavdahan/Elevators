import React from "react";
import '../style/components/Floors.css'

const Floors = ({ numberOfFloors }) => {
    let floors = []
    const createFloors = () => {
        for (let i = 0; i < numberOfFloors; i++) {
          let content;
          switch (i) {
            case 0:
              content = "Ground Floor";
              break;
            case 1:
              content = "1st";
              break;
            case 2:
              content = "2nd";
              break;
            case 3:
              content = "3rd";
              break;
            default:
              content = `${i}th`;
              break;
          }
          floors.push(
            <div className="floor" key={i}>
              {content}
            </div>
          );
        }
        return floors
    }
    return (
      <div className="floors">
        {createFloors()}
      </div>
    );
}

export default Floors;