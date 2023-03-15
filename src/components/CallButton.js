import React from "react";
import '../style/components/CallButton.css'

const CallButton = ({ details, call, changeButtonStatus }) => { 
    const changeStatus = () => { 
        call(details.id)
        changeButtonStatus(details.id);
    }

    return (
        <button className={details.status}
            disabled={  details.status !== 'available' }
            onClick={() => changeStatus()}>
        {details.text}
      </button>
    );
}

export default CallButton