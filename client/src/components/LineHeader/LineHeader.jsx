import React from "react";

function LineHeader({location}) {
  return (
    <div className="top-bar">
      <div className="tp-left">
        <div className="pageTile-top">
          <i className="bx bxs-home text-gray-600"></i>
          <span className="text-gray-600"> / {location}</span>
        </div>
        <div className="pageTile-bottom">
          <span className="pageName">{location}</span>
        </div>
      </div>
      <div className="tp-right">
        <i className="bx bxs-user-circle"></i>
        <i className="bx bxs-cog"></i>
        <i className="bx bxs-bell"></i>
      </div>
    </div>
  );
}

export default LineHeader;
