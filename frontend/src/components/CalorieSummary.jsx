import React from "react";

const CalorieSummary = ({ netIntake, netBurnt }) => {

  return (
    <div className="flex justify-center gap-6 mt-4">
      <div className="bg-white shadow-md rounded-2xl p-4 w-48 text-center border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-600">Net Intake</h2>
        <p className="text-xl font-bold text-green-600">{netIntake} kcal</p>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-4 w-48 text-center border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-600">Net Burnt</h2>
        <p className="text-xl font-bold text-red-600">{netBurnt} kcal</p>
      </div>
    </div>
  );
};

export default CalorieSummary;