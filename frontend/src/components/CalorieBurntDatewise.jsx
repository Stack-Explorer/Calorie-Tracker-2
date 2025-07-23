import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { Ban, SquarePen } from "lucide-react"
import toast from "react-hot-toast";
import { sendCalorieBurnt, sendEditedBurntCalories } from "../store/features/backendSlice";
import Calendar from "react-calendar";
import { format } from "date-fns";


const CalorieBurntDatewise = () => {
  const userData = useSelector((state) => state.backend.data);

  const [selectedDate, setSelectedDate] = useState(null);
  const [caloriesBurnt, setCaloriesBurnt] = useState(null);
  const [caloriesBurntText, setCaloriesBurntText] = useState(caloriesBurnt || "");
  const [found, setFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addEntry, setAddEntry] = useState(false);

  const dispatch = useDispatch();

  const dateArray = ["2025-07-12", "2025-07-13", "2025-07-14", "2025-07-15", "2025-07-16", "2025-07-17", "2025-07-18", "2025-07-19", "2025-07-20", "2025-07-21"
  ];

function convertedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function MyCalendar() {
    const handleDateChange = (date) => {
      const today = new Date();
      if (date > today) return toast.error("Date Selected cannot be > today");

      console.log("date from handleDateChange is :",date);

      const changedDate = convertedDate(date);
      console.log("changedDate is : ",changedDate)
      setSelectedDate(changedDate);
      fetchDataDateWise(changedDate);
    }
    return (
      <div>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          maxDate={new Date()}
          className="bg-black text-white"
          tileDisabled={({ date }) => date > new Date()}
        />

      </div>
    )

  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  }

  function dateFormatter(date) {
    return format(date, "dd-MMMM yyyy")
  }

  function fetchDataDateWise(date) {
    try {
      const formattedDate = new Date(date).toISOString().split("T")[0]; // "YYYY-MM-DD"
      const dateData = userData?.DateWise?.find((elem) => elem.date === formattedDate);
      if (dateData) {
        setCaloriesBurnt(dateData.caloriesBurnt);
        setCaloriesBurntText(dateData.caloriesBurnt);
        setFound(true);
      } else {
        setCaloriesBurnt(null);
        setFound(false);
      }
      if (dateData) {

      }
      if (!dateData) {
        return (
          <>

          </>
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDataDateWise(selectedDate)
  }, [userData, selectedDate])

  function handleSelectionDateClick(currItem) {
    setSelectedDate(currItem);
    fetchDataDateWise(currItem); // ✅ Use currItem directly
  }

  async function handleSubmit() {
    if (caloriesBurntText > 10000) return toast.error("Calories burnt cannot be > 10000");
    if (caloriesBurntText < 0) return toast.error("Calories burnt should be > 0");

    const parsedCalories = Number(caloriesBurntText);

    try {
      console.log("Handle Submit");
      console.log("caloriesBurntText:", caloriesBurntText, "Selected date is:", selectedDate);

      if (isNaN(parsedCalories)) return toast.error("Calories Burnt should be a number");

      console.log("I am before result💀");
      
      const result = await dispatch(sendCalorieBurnt({
        caloriesBurnt: parsedCalories,
        selectedDate
      }));

      if (result.payload?.data) {
        const updatedResponse = userData?.DateWise?.find(
          (elem) => elem.date === selectedDate
        );
        if (updatedResponse) {
          setCaloriesBurnt(updatedResponse?.caloriesBurnt);
          toast.success("Data added !");
        }
      }
      setAddEntry(false);
    } catch (error) {
      toast.error("Failed to update data");
      console.error(error);
    }
  }


  async function handleEditSave() {
    try {
      const parsedCalories = Number(caloriesBurntText)
      console.log("parsedCalories are :", parsedCalories);
      if (parsedCalories > 10000) return toast.error("Calories burnt cannot be > 10000");
      if (caloriesBurntText < 0) return toast.error("Calories burnt should be > 0");

      if (isNaN(parsedCalories)) return toast.error("Calories Burnt should be a number");

      const matched = userData?.DateWise?.find((elem) => elem.date === selectedDate);
      console.log("Matched is :", matched)
      const result = await dispatch(sendEditedBurntCalories({
        dateid: matched._id,
        caloriesBurnt: parsedCalories
      }))
      if (result.payload?.data) {
        const updatedResponse = result.payload.data.DateWise.find(
          (elem) => elem.date === selectedDate
        );

        if (updatedResponse) {
          setCaloriesBurnt(updatedResponse.caloriesBurnt);
          setCaloriesBurntText(updatedResponse.caloriesBurnt); // update text input too
          toast.success("Data Updated!");
        }
      }

      setEditOpen(false);
    } catch (error) {
      toast.error("Failed to update data.")
      console.log(error);
    }

  }

  function SelectionDate() {
    return (
      <>
        <MyCalendar />
        <div>
          {dateArray.map((currItem) =>
            <>
              <button onClick={() => handleSelectionDateClick(currItem)} className="black-button mt-2">{dateFormatter(currItem)}</button>
              <br />
            </>
          )
          }
          <p>Selected Date is : {selectedDate}</p>
        </div>
      </>
    )
  }

  return (
    <>
      {SelectionDate()}

      {found ? (
        <>
          <h2 className="text-2xl">Calories Burnt : {caloriesBurnt}</h2>
          {editOpen ? <>
            <input className="border" type="text" value={caloriesBurntText} onChange={(e) => setCaloriesBurntText(e.target.value)} />
            <button onClick={() => setEditOpen(false)}><Ban /></button>
            <button onClick={handleEditSave} className="black-button">Save</button>
          </>
            : <button onClick={() => setEditOpen(true)}><SquarePen /></button>}
        </>
      ) :
        <>
          <h2 className="text-2xl">No calories burnt for {dateFormatter(selectedDate)}</h2>
          {!addEntry && <button onClick={() => setAddEntry(true)} className="black-button">Add Entry</button>}
          {addEntry &&
            <>
              <input className="border" type="text" value={caloriesBurntText} onChange={(e) => setCaloriesBurntText(e.target.value)} />
              <button onClick={() => setAddEntry(false)}><Ban /></button>
              <button onClick={handleSubmit} className="black-button ml-2">Submit</button>
            </>
          }
        </>
      }
    </>
  )

}

export default CalorieBurntDatewise