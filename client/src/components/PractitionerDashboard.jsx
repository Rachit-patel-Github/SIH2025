import React, { useEffect, useState } from "react";
import axios from "axios";

const PractitionerDashboard = ({ user }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`http://localhost:5000/api/dashboard/practitioner/${user._id}`)
      .then((res) => {
        console.log("✅ Practitioner Dashboard Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("❌ Practitioner Dashboard Error:", err));
  }, [user]);

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-lg shadow-sm text-white">
        <h2 className="text-lg font-semibold">
          Welcome back, Dr. {user.name} 👋
        </h2>
        <p className="text-sm opacity-90">
          Manage your patients, schedule therapies, and track progress all in
          one place.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold">Appointments</h3>
          <p className="text-sm text-gray-500">View and manage your schedule</p>
          <p className="mt-2 text-green-600 font-bold">
            {data?.appointments?.length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold">My Patients</h3>
          <p className="text-sm text-gray-500">
            Track patient progress & feedback
          </p>
          <p className="mt-2 text-green-600 font-bold">
            {data?.patients?.length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold">Therapies</h3>
          <p className="text-sm text-gray-500">Create and assign therapies</p>
          <p className="mt-2 text-green-600 font-bold">
            {data?.therapies || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold">Consultations</h3>
          <p className="text-sm text-gray-500">Provide online consultations</p>
          <p className="mt-2 text-green-600 font-bold">
            {data?.consultations || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDashboard;
