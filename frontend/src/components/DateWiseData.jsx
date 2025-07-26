import dateformat from "dateformat";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleCheckBig, CircleX, Pencil, Trash, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import Calendar from "react-calendar";
import toast from "react-hot-toast";
import { addUserData, deleteUserData, editUserData, sendCalorieBurnt } from "../store/features/backendSlice";
import ChartComponent from "./ChartComponent";
import CalorieBurntDatewise from "./CalorieBurntDatewise";
import ExportToExcel from "./ExporttoExcel";

const DateWiseData = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const userData = useSelector((state) => state.backend.data);
  const dispatch = useDispatch();

  function MyCalendar() {
    const handleDateChange = (date) => {
      const today = new Date();
      if (date > today) return;

      setSelectedDate(date);

      const matched = userData?.DateWise?.find(item =>
        formatDate(new Date(item.date)) === formatDate(date)
      );

      if (matched) {
        handleClick(matched._id);
      } else {
        setIsDataNotAvailable(true);
        setDateWiseData(null);
        setNoDataAvailableForDate(date);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          maxDate={new Date()}
          className="border-0 text-gray-800"
          tileDisabled={({ date }) => date > new Date()}
          tileClassName={({ date }) => {
            const formatted = formatDate(date);
            const hasData = userData?.DateWise?.some(
              (item) => formatDate(new Date(item.date)) === formatted
            );
            return hasData
              ? "cursor-pointer bg-green-100 text-black rounded-full hover:bg-green-200"
              : "bg-white text-gray-500 hover:bg-gray-100 rounded-full";
          }}
          prevLabel={<ArrowLeft className="h-4 w-4" />}
          nextLabel={<ArrowRight className="h-4 w-4" />}
          prev2Label={null}
          next2Label={null}
        />
        {selectedDate && (
          <p className="mt-2 text-center text-gray-600">
            Selected: <span className="font-medium">{formatDate(selectedDate)}</span>
          </p>
        )}
      </div>
    );
  }

  const formatDate = (date) => {
    return dateformat(date, "dS-mmmm");
  }

  const [dateWiseData, setDateWiseData] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [foodObject, setFoodObject] = useState({
    name: "",
    calories: null
  });
  const [editingId, setEditingId] = useState(null);
  const [isDataNotAvailable, setIsDataNotAvailable] = useState(false);
  const [noDataAvailableForDate, setNoDataAvailableForDate] = useState(null);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [calorieBurntHistoryOpen, setCalorieBurntHistoryOpen] = useState(false);

  useEffect(() => {
    if (!dateWiseData?._id || !userData?.DateWise) return;
    const updatedDateData = userData?.DateWise?.find(item => item._id === dateWiseData._id);
    if (updatedDateData && JSON.stringify(updatedDateData) !== JSON.stringify(dateWiseData)) {
      setDateWiseData(updatedDateData);
    }
  }, [userData, dateWiseData?._id]);

  async function handleEditSave(dateid, fooditemid) {
    const { name, calories } = foodObject;
    if (isNaN(calories)) return toast.error("Calories should be number");
    const parsedCalories = Number(calories);
    if (!name || !parsedCalories) {
      return toast.error("Food Item and calories cannot be empty!");
    }
    if (parsedCalories <= 0) return toast.error("Calorie Intake cannot be negative or zero");

    try {
      if (parsedCalories > 3000) {
        const confirmed = window.confirm("Are you sure you want to add this many calories per meal?");
        if (!confirmed) return;
      }

      const result = await dispatch(editUserData({ dateid, fooditemid, name, calories }));
      if (result.payload?.data) {
        const updatedDateData = result.payload.data.DateWise.find(item => item._id === dateid);
        setDateWiseData(updatedDateData);
        toast.success("Updated successfully!");
      }
    } catch (err) {
      console.error("Error in handleEditSave:", err);
      toast.error("Failed to update!");
    }
    setEditOpen(false);
    setEditingId(null);
  }

  function convertedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function handleSave(name, calories) {
    if (isNaN(calories)) return toast.error("Calories should be number.");
    const parsedCalories = Number(calories);
    if (!name || !parsedCalories) {
      return toast.error("Food Item and calories cannot be empty!");
    }
    if (parsedCalories <= 0) return toast.error("Calorie Intake cannot be negative or zero");

    const updatedUserData = {
      name,
      calories,
      customDate: convertedDate(selectedDate)
    }

    try {
      if (parsedCalories > 3000) {
        const confirmed = window.confirm("Are you sure you want to add this many calories per meal?");
        if (!confirmed) return;
      }

      const result = await dispatch(addUserData(updatedUserData));
      if (result.payload?.data) {
        const newDateEntry = result.payload.data.DateWise.find(item =>
          formatDate(new Date(item.date)) === formatDate(new Date(noDataAvailableForDate))
        );

        if (newDateEntry) {
          setDateWiseData(newDateEntry);
          setIsDataNotAvailable(false);
        }
        toast.success("Entry added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add entry");
    }

    setFoodObject({
      name: "",
      calories: ""
    });
    setIsAddEntryOpen(false);
  }

  function handleEdit(id) {
    setEditOpen(!editOpen);
    setEditingId(id);

    const itemToEdit = dateWiseData?.fooditems?.find(currItem => currItem._id === id);
    if (itemToEdit) {
      setFoodObject({
        name: itemToEdit.name,
        calories: itemToEdit.calories
      });
    }
  }

  function handleDelete(dateid, fooditemid) {
    dispatch(deleteUserData({ dateid, fooditemid }));
  }

  function handleClick(id) {
    const dateData = userData?.DateWise?.find((currItem) => currItem._id === id);
    if (!dateData || !dateData.fooditems || dateData.fooditems.length === 0) {
      setIsDataNotAvailable(true);
      setDateWiseData(null);
      setNoDataAvailableForDate(dateData?.date);
    } else {
      setIsDataNotAvailable(false);
      setDateWiseData(dateData);
    }
  }

  // Calculate total calories for the selected date
  const totalCalories = dateWiseData?.fooditems?.reduce((sum, item) => sum + item.calories, 0) || 0;

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Calendar and Add Entry */}
          <div className="lg:w-1/3">
            <MyCalendar />

            {selectedDate && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                {isAddEntryOpen ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Add New Food Entry</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
                      <input
                        placeholder="e.g. Yogurt"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={foodObject.name}
                        onChange={(e) => setFoodObject({ ...foodObject, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                      <input
                        placeholder="e.g. 150"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="number"
                        value={foodObject.calories}
                        onChange={(e) => setFoodObject({ ...foodObject, calories: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(foodObject.name, foodObject.calories)}
                        className="px-4 pointer py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-1"
                      >
                        <CircleCheckBig className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsAddEntryOpen(false)}
                        className="px-4 pointer py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center gap-1"
                      >
                        <CircleX className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddEntryOpen(true)}
                    className="w-full pointer px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Food Entry
                  </button>
                )}
              </div>
            )}
                <ExportToExcel />

          </div>

          {/* Right Column - Food Entries and Summary */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedDate ? formatDate(selectedDate) : "Select a date"}
                </h2>
                {selectedDate && (
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {dateWiseData?.fooditems?.length || 0} entries
                    </span>
                    <span className="text-sm font-medium">
                      Total: <span className="text-blue-600">{totalCalories}</span> calories
                    </span>
                  </div>
                )}
              </div>

              {isDataNotAvailable ? (
                <div className="p-8 text-center">
                  <div className="text-gray-500 mb-4">No entries found for {formatDate(noDataAvailableForDate)}</div>
                  <button
                    onClick={() => setIsAddEntryOpen(true)}
                    className="px-4 pointer py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add First Entry
                  </button>
                </div>
              ) : dateWiseData?.fooditems?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {dateWiseData.fooditems.map((currItem) => (
                    <li key={currItem._id} className="p-4 hover:bg-gray-50">
                      {editOpen && editingId === currItem._id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                              value={foodObject.name}
                              onChange={(e) => setFoodObject({ ...foodObject, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="number"
                              value={foodObject.calories}
                              onChange={(e) => setFoodObject({ ...foodObject, calories: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSave(dateWiseData._id, currItem._id)}
                              className="px-3 py-1 pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                            >
                              <CircleCheckBig className="h-4 w-4" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditOpen(false)}
                              className="px-3 pointer py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center gap-1"
                            >
                              <CircleX className="h-4 w-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900">{currItem.name}</h3>
                            <p className="text-sm text-gray-500">{currItem.calories} calories</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(currItem._id)}
                              className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                              title="Edit"
                            >
                              <Pencil className="h-4 pointer w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(dateWiseData._id, currItem._id)}
                              className="p-2 pointer text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  {selectedDate ? "No entries for selected date" : "Please select a date to view entries"}
                </div>
              )}
            </div>

            {/* 📱 Message only for mobile */}
            <p className="block mt-4 md:hidden text-sm text-gray-500 text-center">
              Please view on tablet or larger screen to see the chart.
            </p>

            {/* 💻 Chart only for tablet and larger */}

            {/* Chart Section */}
            <div className="hidden  md:block mt-8 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Calorie Intake Overview</h3>
              <ChartComponent />
            </div>


            {/* Calorie Burnt Toggle */}

            {/* Calorie Burnt Section */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DateWiseData;