import React from "react";
import "../../Pages/Signup/signup.css";

export const Input = ({ type, placeholder, header, value, setter }) => {
  return (
    <div className="content">
        <h1 className="header">{header}</h1>
      <input
        type={type}
        className="text-left w-full h-12 rounded-2xl mt-2 mb-2 mr-6 pl-5 pr-5 italic font-thin focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setter(e.target.value);
        }}
      />
    </div>
  );
};
