import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { sendCalorieBurnt, sendEditedBurntCalories } from '../store/features/backendSlice';
import { useLocation } from "react-router-dom"

const CaloriesBurnt = () => {
  const [caloriesBurnt, setCaloriesBurnt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCaloriesBurntComponent, setShowCaloriesBurntComponent] = useState(false);

  const location = useLocation();

  function checkCurrentPath(location) {
    if (location === "/datewisedata" || location === "/login" || location === "/signup" || !userData) {
      setShowCaloriesBurntComponent(false);
    } else {
      setShowCaloriesBurntComponent(true);
    }
  }

  useEffect(() => {
    checkCurrentPath(location.pathname)
  }, [location.pathname]);

  const today = new Date().toISOString().split("T")[0];
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.backend.data);

  const burntCaloriesDate = userData?.DateWise.find((currItem) => currItem.date === today);

  const todayCalorie = burntCaloriesDate?.caloriesBurnt;

  const message = userData?.message

  const handleSubmit = async () => {
    const parsedCalories = Number(caloriesBurnt);
    if (caloriesBurnt.trim() === '' || isNaN(caloriesBurnt)) return toast.error("Enter valid value !");

    if (parsedCalories > 10000) return toast.error("Calories Burnt cannot be > 10000");
    if (parsedCalories < 0) return toast.error("Calories Burnt Cannot be negative");


    if (parsedCalories > 1200) {
      const confirmed = window.confirm("You’re burning more than 1200 calories. Are you sure this is accurate?");
      if (!confirmed) return;
      await dispatch(sendCalorieBurnt({ caloriesBurnt }));
      if (message) {
        toast.success('Calories burnt added!');
      }
    } else {
      await dispatch(sendCalorieBurnt({ caloriesBurnt }));
      if (message) {
        toast.success('Calories burnt added!');
      }
    }
    setCaloriesBurnt('');
  };

  const handleSave = async () => {
    const parsedCalories = Number(caloriesBurnt);
    if (caloriesBurnt.trim() === '' || isNaN(caloriesBurnt)) return toast.error("Enter valid value !");

    if (parsedCalories > 10000) return toast.error("Calories Burnt cannot be > 10000");
    if (parsedCalories < 0) return toast.error("Calories Burnt Cannot be negative");

    const dateid = burntCaloriesDate?._id

    if (parsedCalories > 1200) {
      const confirmed = window.confirm("You’re burning more than 1200 calories. Are you sure this is accurate?");
      if (!confirmed) return;
      await dispatch(sendEditedBurntCalories({ dateid, caloriesBurnt }));
      toast.success('Calories burnt updated!');
    } else {
      await dispatch(sendEditedBurntCalories({ dateid, caloriesBurnt }));
      toast.success('Calories burnt updated!');
    }

    setIsEditing(false);
    setCaloriesBurnt('');
  };

  const handleEdit = () => {
    setCaloriesBurnt(todayCalorie?.toString() || '');
    setIsEditing(true);
  };

  return (
    showCaloriesBurntComponent && (
      <div className="flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-2xl max-w-sm mx-auto mt-10">
        <h2 className="text-xl font-semibold text-gray-800">Net Calories Burnt</h2>

        {todayCalorie && !isEditing ? (
          <>
            <div className="text-lg font-medium text-green-700">
              {todayCalorie} cal burnt today
            </div>
            <button
              onClick={handleEdit}
              className="bg-yellow-500 pointer text-white px-6 py-2 rounded-xl hover:bg-yellow-600 transition duration-300"
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <input
              type="number"
              placeholder="Enter calories burnt..."
              value={caloriesBurnt}
              onChange={(e) => setCaloriesBurnt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={todayCalorie ? handleSave : handleSubmit}
              className={`${todayCalorie ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-xl pointer transition duration-300`}
            >
              {todayCalorie ? 'Save' : 'Submit'}
            </button>
          </>
        )}

        {!todayCalorie && !isEditing && (
          <div className="text-sm text-gray-500">No calories burnt today. Add entry now.</div>
        )}
      </div>
    )
  );
};

export default CaloriesBurnt;