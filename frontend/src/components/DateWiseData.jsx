import dateformat from "dateformat";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleCheckBig, CircleX, Pencil, Trash } from "lucide-react"
import Calendar from "react-calendar";
import toast from "react-hot-toast";
import { addUserData, deleteUserData, editUserData, sendCalorieBurnt } from "../store/features/backendSlice";

const DateWiseData = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  function MyCalendar() {

    const handleDateChange = (date) => {
      const today = new Date();
      if (date > today) return; /*Date Will be passed as params.*/

      setSelectedDate(date);

      const matched = userData?.DateWise?.find(item =>
        formatDate(new Date(item.date)) === formatDate(date)
      ); /*Will make new date object of item.date and finds === of seleceted Date*/

      if (matched) {
        handleClick(matched._id);
      } else {
        setIsDataNotAvailable(true);
        setDateWiseData(null);
        setNoDataAvailableForDate(date);
      }
    };

    console.log("selectedDate is :", selectedDate)

    return (
      <div>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          maxDate={new Date()}
          className="bg-black text-white"
          tileDisabled={({ date }) => date > new Date()}
          tileClassName={({ date }) => {
            const formatted = formatDate(date);
            const hasData = userData?.DateWise?.some(
              (item) => formatDate(new Date(item.date)) === formatted
            );
            return hasData
              ? "cursor-pointer bg-green-100 text-black"
              : "bg-gray-300 text-gray-500";
          }}
        />
        {selectedDate && <p className="mt-2">Selected Date: {formatDate(selectedDate)}</p>}
      </div>
    );
  }

  const userData = useSelector((state) => state.backend.data);
  console.log("Data :", JSON.parse(JSON.stringify(userData)))

  const dispatch = useDispatch();

  const formatDate = (date) => {
    return dateformat(date, "dS-mmmm");
  }

  const [dateWiseData, setDateWiseData] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [foodObject, setFoodObject] = useState({
    name: "",
    calories: null
  })
  const [editingId, setEditingId] = useState(null)
  const [isDataNotAvailable, setIsDataNotAvailable] = useState(false);
  const [noDataAvailableForDate, setNoDataAvailableForDate] = useState(null)
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);

  useEffect(() => {
    if (!dateWiseData?._id || !userData?.DateWise) return;
    const updatedDateData = userData?.DateWise?.find(item => item._id === dateWiseData._id);
    if (updatedDateData && JSON.stringify(updatedDateData) !== JSON.stringify(dateWiseData)) {
      setDateWiseData(updatedDateData);
    }
  }, [userData, dateWiseData?._id]);

  async function handleEditSave(dateid, fooditemid) {
    const { name, calories } = foodObject;
    if (isNaN(calories)) return toast.error("Calories should be number")
    const parsedCalories = Number(calories)
    if (!name || !parsedCalories) {
      return toast.error("Food Item and calories cannot be empty!");
    }
    try {
      const result = await dispatch(editUserData({ dateid, fooditemid, name, calories }));
      if (result.payload?.data) {
        // Update the local state with the new date data
        const updatedDateData = result.payload.data.DateWise.find(item => item._id === dateid);
        setDateWiseData(updatedDateData);
        toast.success("Successfully updated!");
      }
    } catch (err) {
      console.error("❌ Error in handleEditSave:", err);
      toast.error("Something went wrong while updating!");
    }
    setEditOpen(false);
    setEditingId(null);

    console.log("Date id :", dateid, "FoodItem id :", fooditemid);
  }

  async function handleSave(name, calories, noDataAvailableForDate) {
    if (isNaN(calories)) return toast.error("Calories should be number")
    const parsedCalories = Number(calories)
    if (!name || !parsedCalories) {
      return toast.error("Food Item and calories cannot be empty!");
    }
    const userData = {
      name,
      calories,
      customDate: noDataAvailableForDate
    }

    try {
      const result = await dispatch(addUserData(userData));
      if (result.payload?.data) {
        // Find the newly created date entry
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
    })
    setIsAddEntryOpen(false);
  }

  function handleEdit(id) {
    setEditOpen(!editOpen)
    setEditingId(id);

    const itemToEdit = dateWiseData?.fooditems?.find(currItem => currItem._id === id)
    if (itemToEdit) {
      setFoodObject({
        name: itemToEdit.name,
        calories: itemToEdit.calories
      })
    }
    console.log(id);
  }

  function handleAddEntry() {
    setIsAddEntryOpen(!isAddEntryOpen);
  }

  function handleDelete(dateid, fooditemid) {
    console.log("handleDelete clicked")
    const userData = {
      dateid,
      fooditemid
    }
    dispatch(deleteUserData(userData));
  }

  function handleClick(id) {
    console.log("Id passed by myCalendar is :", id);
    const dateData = userData?.DateWise?.find((currItem) => currItem._id === id);
    console.log("Date data is :", dateData?.date);
    if (!dateData || !dateData.fooditems || dateData.fooditems.length === 0) {
      setIsDataNotAvailable(true);
      setDateWiseData(null);
      setNoDataAvailableForDate(dateData?.date)
    } else {
      setIsDataNotAvailable(false);
      setDateWiseData(dateData);
    }
  }

  console.log("dateWiseData is :", dateWiseData);
  console.log(isDataNotAvailable);
  console.log("Day having zero entry is :", noDataAvailableForDate)

  return (
    <>
      {dateWiseData ? dateWiseData?.fooditems?.map((currItem) => (
        <div className="flex" id={currItem._id}>
          <div className="px-6 ml-2 py-3 border mt-3">
            {editOpen && (editingId === currItem._id) ? <>
              <input placeholder="name" className="border ml-2 mt-3" type="text" value={foodObject.name} onChange={(e) => setFoodObject({ ...foodObject, name: e.target.value })} />
              <input placeholder="calories" className="border ml-2 mt-3" type="text" value={foodObject.calories} onChange={(e) => setFoodObject({ ...foodObject, calories: e.target.value })} />
              <button onClick={() => handleEditSave(dateWiseData?._id, currItem?._id)}><CircleCheckBig /></button>
              <button onClick={() => setEditOpen(!editOpen)} className="ml-3"><CircleX /></button>
            </> : <>
              <p>{currItem.name}</p>
              <p>{currItem.calories}</p>
              <button onClick={() => handleEdit(currItem?._id)} className="cursor-pointer"><Pencil /></button>
              <button onClick={() => handleDelete(dateWiseData?._id, currItem?._id)} className="cursor-pointer ml-3"><Trash /></button>
            </>
            }

            <p>{currItem._id}</p>

          </div>
        </div>
      )) : (
        <>
        
        
        
          <p>No entry found</p>
        </> 
        
        
      )
      }
      <div className="flex">
        
     
      
      </div>
      <>
        {selectedDate && (  // Only show if date is selected
          <>
            {isAddEntryOpen ? (
              <>
                <button
                  onClick={() => handleSave(foodObject.name, foodObject.calories, noDataAvailableForDate)}
                  className="px-4 py-2 ml-2 text-white bg-black"
                >
                  Save Entry
                </button>
                <input
                  placeholder="name"
                  className="border ml-2 mt-3"
                  type="text"
                  value={foodObject.name}
                  onChange={(e) => setFoodObject({ ...foodObject, name: e.target.value })}
                />
                <input
                  placeholder="calories"
                  className="border ml-2 mt-3"
                  type="text"
                  value={foodObject.calories}
                  onChange={(e) => setFoodObject({ ...foodObject, calories: e.target.value })}
                />
                <button
                  onClick={() => setIsAddEntryOpen(!isAddEntryOpen)}
                  className="ml-3"
                >
                  <CircleX />
                </button>
              </>
            ) : (
              <button
                onClick={handleAddEntry}
                className="px-4 py-2 ml-2 text-white bg-black"
              >  
         Add Entry
              </button>
            )}
          </>
        )}

      </>

      {isDataNotAvailable &&
        <>
          <p>Data Not Available for {formatDate(noDataAvailableForDate)}</p>
        </>
      }
      <MyCalendar />
      <button className="m-3 black-button">See Chart</button>
    </>

  )
}

export default DateWiseData;