import React from "react";
import { useHistory } from "react-router-dom";

export const GroupRecord = ({ group }) => {
  const history = useHistory();
  const eventStatus = () => {
    if (group.private === true) {
      return "events: Private";
    } else {
      return "events: Public";
    }
  };

  const groupHistory = () => {
    history.push(`/groups/${group.id}`);
  };

  return (
    <div onClick={groupHistory} className="group-record-div">
      <img
        className="group-record-img"
        width="250"
        height="150"
        src={group.previewImage}
        alt="Group Preview"
      ></img>
      <div
        className="group-individual-record"
        to={{ pathname: `/groups/${group.id}`, state: {} }}
      >
        {group.name}
      </div>
      <p className="group-location">
        {group.city}, {group.state}
      </p>
      <p className="group-about">{group.about}</p>
      <p className="group-event">
        {group.Events} · {eventStatus()}
      </p>
    </div>
  );
};