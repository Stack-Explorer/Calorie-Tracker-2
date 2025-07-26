import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  addUserData,
  deleteUserData,
  editUserData,
  setCalorieIntake,
} from "../store/features/backendSlice";
import { format, parseISO } from "date-fns";
import CalorieSummary from "./CalorieSummary";
import CaloriesBurnt from "./CaloriesBurnt";
import WelcomeSection from "./WelcomeSection";
import ParagraphComponent from "./ParagraphComponent";

const CalorieTrackerRedux = () => {
  const [foodItem, setFoodItem] = useState("");
  const [calories, setCalories] = useState("");
  const [showRequiredCalorieInput, setShowRequiredCalorieInput] =
    useState(false);
  const [showForm, setShowForm] = useState(false);
  const [customCalories, setCustomCalories] = useState("");
  const [tdeeForm, setTdeeForm] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "",
    goal: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    calories: "",
  });

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.backend.data);
  const dateWiseData = userData?.DateWise;
  const username = userData?.username;
  const calorieIntake = userData?.requiredCalorieIntake;

  const netCalIntake = userData?.DateWise?.reduce((sum, currItem) => sum + currItem.totalCalories, 0);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayEntry = dateWiseData?.find(
    (entry) => format(parseISO(entry.date), "yyyy-MM-dd") === today
  );
  const totalConsumed = todayEntry?.totalCalories || 0;
  const remainingCalories = calorieIntake
    ? calorieIntake - totalConsumed
    : null;

  const formattingDate = (date) => format(parseISO(date), "do-MMMM");
  const formattingTime = (dateTime) => format(parseISO(dateTime), "hh:mm a");

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedCalories = Number(calories);

    // Validate overall calorie intake set
    if (!calorieIntake || calorieIntake <= 0 || calorieIntake > 5000) {
      return toast.error("Set a valid required calorie intake first");
    }

    // Validate individual food entry
    if (!foodItem.trim() || !calories.trim() || isNaN(parsedCalories) || parsedCalories <= 0) {
      return toast.error("Please enter a valid food item and numeric calories");
    }

    // Confirm if calories per meal are suspiciously high
    if (parsedCalories > 3000) {
      const confirmed = window.confirm("Sure to add such large number of calories per meal?");
      if (!confirmed) return;
    }

    // All checks passed — dispatch and reset
    dispatch(addUserData({ name: foodItem.trim(), calories: parsedCalories }));
    toast.success("Food item added");

    setFoodItem("");
    setCalories("");
    setShowForm(false);
  };

  const calculateTDEE = () => {
    const { age, height, weight, gender, goal } = tdeeForm;
    if (!age || !height || !weight || !gender || !goal)
      return toast.error("All fields are required");

    if (age > 85 || height > 244 || weight > 650)
      return toast.error("Unrealistic values");

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    let bmr =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    let tdee = bmr * 1.5;
    if (goal === "surplus") tdee += 300;
    if (goal === "deficit") tdee -= 300;

    dispatch(setCalorieIntake({ roundedTdeeCalc: Math.round(tdee) }));
    toast.success("TDEE Calculated!");
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditValues({ name: item.name, calories: item.calories.toString() });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    toast("Edit cancelled", { icon: "⚠️" });
  };

  const handleSaveEdit = () => {
    if (!editValues.name || !editValues.calories)
      return toast.error("All fields required");

    const parsedCalories = Number(editValues.calories);
    if (isNaN(parsedCalories))
      return toast.error("Enter numeric calories");

    if (parsedCalories <= 0) return toast.error("Calorie Intake cannot be negative or 0")

    if (parsedCalories > 1200) {
      const confirmed = window.confirm("You're entering more than 1200 calories for one item. Are you sure this is correct?");
      if (!confirmed) return;
    }

    const dateEntry = dateWiseData.find((entry) =>
      entry.fooditems.some((item) => item._id === editingId)
    );
    const foodItem = dateEntry?.fooditems.find((i) => i._id === editingId);

    if (!foodItem || !dateEntry)
      return toast.error("Item not found");

    dispatch(
      editUserData({
        dateid: dateEntry._id,
        fooditemid: editingId,
        name: editValues.name,
        calories: parsedCalories,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Saved!");
        setEditingId(null);
      })
      .catch((err) => toast.error(err.message || "Failed to save"));
  };

  const handleDelete = (id) => {
    const dateEntry = dateWiseData.find((entry) =>
      entry.fooditems.some((item) => item._id === id)
    );
    if (!dateEntry) return toast.error("Entry not found");

    dispatch(
      deleteUserData({ dateid: dateEntry._id, fooditemid: id })
    )
      .unwrap()
      .then(() => toast.success("Deleted"))
      .catch((err) => toast.error(err.message || "Delete failed"));
  };

  return (
    <div>
      <ParagraphComponent />
      <div className="w-[92%] sm:w-[90%] max-w-md mx-auto mt-6 p-4 sm:p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
        {userData && <WelcomeSection data={userData} />}
        <CalorieSummary netIntake={`🥗${netCalIntake}` ?? 0} netBurnt={`🔥${userData?.netCaloriesBurnt ?? 0}`} />
        <CaloriesBurnt />
        <Toaster />


        {calorieIntake !== null && (
          <div className="mb-5 mt-5 text-center text-sm text-gray-700 space-y-1">
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              Daily Requirement:{" "}
              {calorieIntake <= 0 ? "Invalid Calorie Value" : calorieIntake} kcal
            </p>
            <p>
              Remaining:{" "}
              <span
                className={`font-bold ${remainingCalories >= 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {remainingCalories >= 0
                  ? remainingCalories
                  : `Exceeded by ${Math.abs(remainingCalories)}`}
              </span>{" "}
              kcal
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() =>
              setShowRequiredCalorieInput(!showRequiredCalorieInput)
            }
            className="w-full py-2 pointer text-white bg-green-600 hover:bg-green-700 rounded-xl font-semibold"
          >
            {showRequiredCalorieInput ? "Hide Intake" : "Set Required Calories"}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full py-2 pointer text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
          >
            {showForm ? "Close Form" : "Add Entry"}
          </button>
        </div>

        {/* Intake Input */}
        {showRequiredCalorieInput && (
          <div className="mb-6 space-y-3">
            <input
              type="number"
              value={customCalories}
              onChange={(e) => setCustomCalories(e.target.value)}
              onBlur={() => {
                const val = parseInt(customCalories);
                if (!isNaN(val) && val > 0) {
                  dispatch(setCalorieIntake({ roundedTdeeCalc: val }));
                  toast.success("Custom Intake Set");
                } else {
                  toast.error("Enter valid number");
                }
              }}
              placeholder="Custom Calories e.g. 2000"
              className="w-full p-2 border rounded-xl focus:ring-green-400"
            />

            <div className="text-center text-gray-600 text-sm">
              or use TDEE Calculator
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Age"
                value={tdeeForm.age}
                onChange={(e) =>
                  setTdeeForm({ ...tdeeForm, age: e.target.value })
                }
                className="p-2 border rounded-xl"
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={tdeeForm.height}
                onChange={(e) =>
                  setTdeeForm({ ...tdeeForm, height: e.target.value })
                }
                className="p-2 border rounded-xl"
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={tdeeForm.weight}
                onChange={(e) =>
                  setTdeeForm({ ...tdeeForm, weight: e.target.value })
                }
                className="p-2 border rounded-xl"
              />
              <select
                value={tdeeForm.gender}
                onChange={(e) =>
                  setTdeeForm({ ...tdeeForm, gender: e.target.value })
                }
                className="p-2 border rounded-xl"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select
                value={tdeeForm.goal}
                onChange={(e) =>
                  setTdeeForm({ ...tdeeForm, goal: e.target.value })
                }
                className="col-span-1 sm:col-span-2 p-2 border rounded-xl"
              >
                <option value="">Goal</option>
                <option value="maintain">Maintain</option>
                <option value="surplus">Surplus</option>
                <option value="deficit">Deficit</option>
              </select>
            </div>

            <button
              onClick={calculateTDEE}
              className="w-full py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
            >
              Calculate TDEE
            </button>
          </div>
        )}

        {/* Add Entry Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <input
              type="text"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              placeholder="Food Item"
              className="w-full p-3 border rounded-xl"
            />
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Calories"
              className="w-full p-3 border rounded-xl"
            />
            <button
              type="submit"
              className="w-full pointer py-2 bg-blue-500 text-white rounded-xl font-semibold"
            >
              Save Entry
            </button>
          </form>
        )}

        {/* Today's Entries */}
        {todayEntry ? (
          <div className="mt-4">
            <h3 className="text-base font-semibold mb-2">
              Today's Entry ({formattingDate(todayEntry.date)})
            </h3>
            <div className="text-center">
              <p className="mb-3 bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium inline-block shadow-sm">
                Total <span className="font-semibold">{todayEntry.totalCalories ?? 0}</span> kcal
              </p>
            </div>

            <div className="space-y-3">
              {todayEntry.fooditems.map((fItem) => (
                <div
                  key={fItem._id}
                  className="p-3 bg-white border rounded-xl shadow-sm"
                >
                  {editingId === fItem._id ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              name: e.target.value,
                            })
                          }
                          placeholder="Name"
                          className="p-2 border rounded-xl"
                        />
                        <input
                          value={editValues.calories}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              calories: e.target.value,
                            })
                          }
                          type="number"
                          placeholder="Calories"
                          className="p-2 border rounded-xl"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 pointer py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 pointer py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <p className="font-medium text-sm">
                          {fItem.name}:{" "}
                          <span className="text-blue-600 font-semibold">
                            {fItem.calories} kcal
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {formattingTime(fItem.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(fItem)}
                          className="px-3 pointer py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(fItem._id)}
                          className="px-3 pointer py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-gray-500">
            No entries for today.
          </p>
        )}
      </div>
    </div>
  );
};

export default CalorieTrackerRedux;