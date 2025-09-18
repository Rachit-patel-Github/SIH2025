import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "scheduling", label: "Therapy Scheduling", path: "/scheduling" },
    {
      id: "notifications",
      label: "Notifications & Care",
      path: "/notifications",
    },
    { id: "progress", label: "Progress Tracking", path: "/progress" },
  ];

  return (
    <nav className="flex space-x-8 mb-8">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) =>
            `pb-2 px-1 border-b-2 font-medium text-sm ${
              isActive
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
