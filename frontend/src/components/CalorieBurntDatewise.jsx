import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SquarePen } from "lucide-react";
import toast from "react-hot-toast";
import { sendCalorieBurnt, sendEditedBurntCalories } from "../store/features/backendSlice";
import Calendar from "react-calendar";
import { format } from "date-fns";

const CalorieBurntDatewise = () => {
  const userData = useSelector((state) => state.backend.data);
  const [selectedDate, setSelectedDate] = useState(null);
  const [caloriesBurnt, setCaloriesBurnt] = useState(null);
  const [caloriesBurntText, setCaloriesBurntText] = useState("");
  const [found, setFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addEntry, setAddEntry] = useState(false);
  const dispatch = useDispatch();

   function convertedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function MyCalendar() {
    const handleDateChange = (date) => {
      const today = new Date();
      if (date > today) {
        toast.error("Cannot select future dates");
        return;
      }

      const changedDate = convertedDate(date);
      setSelectedDate(changedDate);
      fetchDataDateWise(changedDate);
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 max-w-md mx-auto">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          maxDate={new Date()}
          className="border-0 text-gray-800"
          tileDisabled={({ date }) => date > new Date()}
          tileClassName={({ date }) => {
            const formatted = convertedDate(date);
            const hasData = userData?.DateWise?.some(
              (item) => item.date === formatted
            );
            return hasData
              ? "cursor-pointer bg-green-100 text-black rounded-full hover:bg-green-200"
              : "bg-white text-gray-500 hover:bg-gray-100 rounded-full";
          }}
        />
      </div>
    );
  }

  function dateFormatter(date) {
    return format(new Date(date), "dd MMMM yyyy");
  }

  function fetchDataDateWise(date) {
    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const dateData = userData?.DateWise?.find((elem) => elem.date === formattedDate);
      if (dateData) {
        setCaloriesBurnt(dateData.caloriesBurnt);
        setCaloriesBurntText(dateData.caloriesBurnt.toString());
        setFound(true);
      } else {
        setCaloriesBurnt(null);
        setCaloriesBurntText("");
        setFound(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchDataDateWise(selectedDate);
    }
  }, [userData, selectedDate]);

  
  async function handleSubmit() {
    const parsedCalories = Number(caloriesBurntText);
    
    if (isNaN(parsedCalories)) {
      return toast.error("Please enter a valid number");
    }
    if (parsedCalories > 10000) {
      return toast.error("Maximum 10,000 calories allowed");
    }
    if (parsedCalories < 0) {
      return toast.error("Calories cannot be negative");
    }

    try {
      if (parsedCalories > 1200) {
        const confirmed = window.confirm(`You're entering ${parsedCalories} calories. Confirm this is correct?`);
        if (!confirmed) return;
      }

      const result = await dispatch(sendCalorieBurnt({
        caloriesBurnt: parsedCalories,
        selectedDate
      }));

      if (result.payload?.data) {
        const updatedResponse = result.payload.data.DateWise.find(
          (elem) => elem.date === selectedDate
        );
        if (updatedResponse) {
          setCaloriesBurnt(updatedResponse.caloriesBurnt);
          toast.success("Entry added successfully!");
        }
      }
      setAddEntry(false);
    } catch (error) {
      toast.error("Failed to add entry");
      console.error(error);
    }
  }

  async function handleEditSave() {
    const parsedCalories = Number(caloriesBurntText);
    
    if (isNaN(parsedCalories)) {
      return toast.error("Please enter a valid number");
    }
    if (parsedCalories > 10000) {
      return toast.error("Maximum 10,000 calories allowed");
    }
    if (parsedCalories < 0) {
      return toast.error("Calories cannot be negative");
    }

    try {
      if (parsedCalories > 1200) {
        const confirmed = window.confirm(`You're entering ${parsedCalories} calories. Confirm this is correct?`);
        if (!confirmed) return;
      }

      const matched = userData?.DateWise?.find((elem) => elem.date === selectedDate);
      const result = await dispatch(sendEditedBurntCalories({
        dateid: matched._id,
        caloriesBurnt: parsedCalories
      }));

      if (result.payload?.data) {
        const updatedResponse = result.payload.data.DateWise.find(
          (elem) => elem.date === selectedDate
        );
        if (updatedResponse) {
          setCaloriesBurnt(updatedResponse.caloriesBurnt);
          setCaloriesBurntText(updatedResponse.caloriesBurnt.toString());
          toast.success("Data updated successfully!");
        }
      }
      setEditOpen(false);
    } catch (error) {
      toast.error("Failed to update data");
      console.error(error);
    }
  }

  function SelectionDate() {
    return (
      <div className="mb-8">
        <MyCalendar />
        
      
        
        {selectedDate && (
          <div className="bg-blue-50 p-3 rounded-md mb-6">
            <p className="text-blue-800 font-medium">
              Selected: <span className="font-semibold">{dateFormatter(selectedDate)}</span>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      <SelectionDate />
      
      <div className="bg-white rounded-xl shadow-md p-6">
        {found ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Calories Burnt: <span className="text-blue-600">{caloriesBurnt}</span>
              </h2>
              {!editOpen && (
                <button 
                  onClick={() => setEditOpen(true)}
                  className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                  title="Edit entry"
                >
                  <SquarePen className="h-5 pointer w-5" />
                </button>
              )}
            </div>
            
            {editOpen && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edit Calories Burnt
                  </label>
                  <input
                    type="number"
                    value={caloriesBurntText}
                    onChange={(e) => setCaloriesBurntText(e.target.value)}
                    className="w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter calories burnt"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSave}
                    className="px-4 pointer py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditOpen(false)}
                    className="px-4 pointer py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            {selectedDate ? (
              <div className="space-y-6">
                <div className="text-gray-600">
                  No calorie data recorded for <span className="font-medium">{dateFormatter(selectedDate)}</span>
                </div>
                {!addEntry ? (
                  <button
                    onClick={() => setAddEntry(true)}
                    className="px-4 py-2 pointer bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Add New Entry
                  </button>
                ) : (
                  <div className="space-y-4 max-w-md mx-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Calories Burnt
                      </label>
                      <input
                        type="number"
                        value={caloriesBurntText}
                        onChange={(e) => setCaloriesBurntText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter calories burnt"
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleSubmit}
                        className="px-4 pointer py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => setAddEntry(false)}
                        className="px-4 pointer py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">
                Please select a date to view or add calorie data
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieBurntDatewise;