import React from "react";
import logo from "../cvs2.png";

const Header: React.FC = () => {
  return (
    <header
      className="p-2 d-flex align-items-center"
      style={{
        backgroundColor: "transparent",
        height: "50px", // Reduced height
      }}
    >
      <img
        src={logo}
        alt="CVS Health Logo"
        style={{
          height: "30px", // Smaller logo
          width: "auto",
        }}
      />
    </header>
  );
};

export default Header;
