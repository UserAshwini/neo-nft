import { useRouter } from "next/navigation";
import React from "react";

const BtnMain = ({ children, to = "" }) => {
  const router = useRouter();
  const handleClick = () => {
    if (to) {
      router.push(to); // Navigate to the given route
    }
  };
  return to ? (
    <div className="btn btn-main" onClick={handleClick}>
      {" "}
      {children}{" "}
    </div>
  ) : (
    <button className="btn btn-main"> {children} </button>
  );
};

export default BtnMain;
