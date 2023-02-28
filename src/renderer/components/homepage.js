import React from "react";
import SearchPerson from "./searchperson";
// import icon from '../../assets/icon.svg';

export default function Homepage() {

    const testEvent = async (e) => {
        console.log("test event");
    }

    return (
        <div>
        {/* <div className="Hello">
            <img width="200" alt="icon" src={icon} />
        </div> */}
        <h1 className="display-1">Distribution Manager</h1>
        <hr />
        <SearchPerson />
        </div>
    );

}