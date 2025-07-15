import { useSelector, useDispatch } from "react-redux";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { useState } from "react";
import { addUserData, editUserData, deleteUserData } from "../store/features/backendSlice";

const DateWiseData = () => {
  const userData = useSelector((state) => state.backend.data);
  const dateWiseData = userData?.DateWise || [];
  const dispatch = useDispatch();

  const [dateWiseFetchingData, setDateWiseFetchingData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [foodItem, setFoodItem] = useState("");
  const [calories, setCalories] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", calories: "" });

  const [dateChunkStart, setDateChunkStart] = useState(0);
  const chunkSize = 15;
  const paginatedDates = dateWiseData.slice(dateChunkStart, dateChunkStart + chunkSize);

  function formattingDate(date) {
    return format(parseISO(date), "MMMM do");
  }

  function getDateWiseData(date) {
    try {
      const found = dateWiseData.find((item) => item.date === date);
      if (!found) return toast.error("Unable to fetch datewise data");
      setDateWiseFetchingData(found);
    } catch (error) {
      console.error(error);
    }
  }

  const handlePrevDates = () => {
    if (dateChunkStart > 0) {
      setDateChunkStart(dateChunkStart - chunkSize);
    }
  };

  const handleNextDates = () => {
    if (dateChunkStart + chunkSize < dateWiseData.length) {
      setDateChunkStart(dateChunkStart + chunkSize);
    }
  };

  const handleAddEntry = () => {
    if (!foodItem || !calories || isNaN(Number(calories))) {
      toast.error("Enter valid food and calories");
      return;
    }

    const parsedCalories = Number(calories);

    dispatch(
      addUserData({
        name: foodItem,
        calories: parsedCalories,
        customDate: dateWiseFetchingData.date,
      })
    )
      .unwrap()
      .then((res) => {
        toast.success("Food added");
        setFoodItem("");
        setCalories("");
        setShowForm(false);

        const newItem = res?.newFood || {
          _id: Date.now().toString(), // fallback if no ID from backend
          name: foodItem,
          calories: parsedCalories,
        };

        setDateWiseFetchingData((prev) => ({
          ...prev,
          fooditems: [...prev.fooditems, newItem],
          totalCalories: prev.totalCalories + parsedCalories,
        }));
      })
      .catch(() => toast.error("Failed to add entry"));
  };


  const handleSaveEdit = () => {
    const parsed = Number(editValues.calories);

    if (!editValues.name || isNaN(parsed)) {
      return toast.error("Invalid input");
    }

    dispatch(
      editUserData({
        dateid: dateWiseFetchingData._id,
        fooditemid: editingId,
        name: editValues.name,
        calories: parsed,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Updated");

        // ✅ Update local state without refreshing
        setDateWiseFetchingData((prev) => {
  if (!prev || !Array.isArray(prev.fooditems)) return prev;

  const oldItem = prev.fooditems.find((item) => item._id === editingId);
  if (!oldItem) return prev;

  const newTotalCalories =
    prev.totalCalories - oldItem.calories + parsed;

  const updatedFoodItems = prev.fooditems.map((item) =>
    item._id === editingId
      ? { ...item, name: editValues.name, calories: parsed }
      : item
  );

  return {
    ...prev,
    fooditems: updatedFoodItems,
    totalCalories: newTotalCalories,
  };
});


        setEditingId(null);
      })
      .catch(() => toast.error("Failed to save"));
  };


  const handleDelete = (id) => {
    // Get the deleted item details before deleting it
    const deletedItem = dateWiseFetchingData.fooditems.find(item => item._id === id);
    const deletedCalories = deletedItem?.calories || 0;

    dispatch(
      deleteUserData({
        dateid: dateWiseFetchingData._id,
        fooditemid: id,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Deleted");

        // 👇 Manually update local state to reflect deletion without refresh
        setDateWiseFetchingData((prev) => ({
          ...prev,
          fooditems: prev.fooditems.filter((item) => item._id !== id),
          totalCalories: prev.totalCalories - deletedCalories,
        }));
      })
      .catch(() => toast.error("Failed to delete"));
  };


  return (
    <div className="max-w-2xl w-full mx-4 sm:mx-auto mt-6 p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-sm sm:text-base">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">View Date-wise Calorie Data</h2>

      {dateWiseData.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 overflow-x-auto">
          <button
            type="button"
            onClick={handlePrevDates}
            disabled={dateChunkStart === 0}
            className={`px-3 cursor-pointer py-1 rounded ${dateChunkStart === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
              }`}
          >
            ← Prev
          </button>

          {paginatedDates.map((currItem) => (
            <button
              type="button"
              key={currItem._id}
              onClick={() => getDateWiseData(currItem.date)}
              className={`px-3 cursor-pointer sm:px-4 py-1 sm:py-2 rounded font-medium ${dateWiseFetchingData?.date === currItem.date
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {formattingDate(currItem.date)}
            </button>
          ))}

          <button
            type="button"
            onClick={handleNextDates}
            disabled={dateChunkStart + chunkSize >= dateWiseData.length}
            className={`px-3 cursor-pointer py-1 rounded ${dateChunkStart + chunkSize >= dateWiseData.length
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
              }`}
          >
            Next →
          </button>
        </div>
      )}


      {dateWiseFetchingData && (
        <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-300 shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Date: <span className="text-blue-700">{formattingDate(dateWiseFetchingData.date)}</span>
          </h3>
          <p className="text-base text-gray-800">
            Total Calories: <span className="font-bold text-green-600">{dateWiseFetchingData.totalCalories} kcal</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 my-4">
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              {showForm ? "Close Form" : "Add Entry"}
            </button>
          </div>

          {showForm && (
            <div className="space-y-3 mt-4">
              <input
                type="text"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                placeholder="Food name"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Calories"
                className="w-full p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddEntry}
                className="w-full cursor-pointer py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Entry
              </button>
            </div>
          )}

          {dateWiseFetchingData.fooditems?.map((fItem) => (
            <div key={fItem._id} className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm mt-3">
              {editingId === fItem._id ? (
                <div className="space-y-2">
                  <input
                    value={editValues.name}
                    onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={editValues.calories}
                    onChange={(e) => setEditValues({ ...editValues, calories: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="bg-gray-200 cursor-pointer px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="bg-green-600 cursor-pointer text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <p className="font-semibold">{fItem.name}: {fItem.calories} kcal</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(fItem._id);
                        setEditValues({
                          name: fItem.name,
                          calories: fItem.calories.toString(),
                        });
                      }}
                      className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(fItem._id)}
                      className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateWiseData;