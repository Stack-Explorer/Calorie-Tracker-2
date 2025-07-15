import React, { useState } from "react";

const DeleteConfirmation = ({ username, onConfirm, onCancel }) => {
  const [password, setPassword] = useState("");

  const handleConfirmClick = () => {
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-md sm:max-w-sm p-5 sm:p-6 rounded-2xl shadow-2xl border border-red-200 relative animate-fadeIn">
        <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">
          Delete Account
        </h2>
        <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
          Are you sure you want to delete your account{" "}
          <span className="font-semibold text-black">{username}</span>? <br />
          This action is{" "}
          <span className="font-bold text-red-500">irreversible</span>.
        </p>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4 text-sm sm:text-base"
        />

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 cursor-pointer rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmClick}
            className="w-full sm:w-auto px-4 py-2 rounded-lg cursor-pointer bg-red-600 text-white hover:bg-red-700 font-semibold transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;