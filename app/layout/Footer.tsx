import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-gray-400 py-4 px-6 text-center text-sm border-t-4 border-purple-900 rounded-t-3xl">
      &copy; {new Date().getFullYear()} n0c tech. All rights reserved.
    </footer>
  );
};

export default Footer;
