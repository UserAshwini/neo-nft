import { useRouter } from "next/navigation";
import React from "react";

const BtnPrimary = ({ children, to = "" }) => {
  const router = useRouter();
  const handleClick = () => {
    if (to) {
      router.push(to); // Navigate to the given route
    }
  };
  return to ? (
    <div onClick={handleClick} className="btn btn-primary">
      {children}
    </div>
  ) : (
    <button className="btn btn-primary">{children}</button>
  );
};

export default BtnPrimary;
