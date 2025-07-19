// Backend
// postUserData

/*
first of all roundedTdeeCalc loving taken form user then if it is beng sent by user then it is setted as roundedTdeeCalc;
if there is custom date then customDate or else today 
and for dateEntry findEntry for selectedDat or today;
if there is dateEntry 
find entry.date , ie:- Iterate over all date of entry that too userWise and retrun which is === to selectedData
custom date is for user selected date to be shown.
*/
  
/*
dateEntry = cutsomDate (by chance);
*/

// editUserData

/*
getting foodItemId, dateId as params 
name and calories as body params.
userId as req.user._id (which is coming fomr protectRoute)
dateEntry = find karo user.DateWise.id === dateId which is being sent by frontend.
same for foodEntry user.DateWise;
*/

// Frontend
// CaloriesBurnt.jsx

/*
Initial State
calories = '' (input is empty)
submitted = false (user hasn’t submitted yet)
isEditing = false (not in edit mode)
Before Submission
UI shows an input field and a Submit button.
Render condition: !submitted is true.
After Submit
submitted is set to true.
Since isEditing is still false, it displays:
The entered calorie value (e.g., 200 cal burnt)
An Edit button.
On Edit
isEditing becomes true.
UI switches back to an input field (pre-filled with the calorie value) and a Save button.
On Save
isEditing becomes false again.
Shows updated value with a success toast and Edit button.
Conditional Rendering Order
Logic flow is:
jsx
Copy
Edit
if (!submitted) {
  // Show input + Submit
} else {
  if (!isEditing) {
    // Show static text + Edit
  } else {
    // Show input + Save
  }
}
This ensures the UI behaves cleanly as the state changes.
*/

// DateWiseData

/*
first of all getting userData,
and then dateWiseData = if userData !== null the accessing datewise.

state for dateWiseFetchingData,and setting it , probably on clikcing user selected date and then fetching data nad showing buttons as per that.
showForm probably button for on Add Entry Event listening
editingId at first , completely null , onClicking edit button , dediting id will be set as fItem._id.
and if editingId === fItem._id then setting foodItem and colories as per 
*/

/*
So calendar compoenent do is :- 
selectedDate and seting selectedDate for avlue 
and hanleingdatecHnage will take date find data according to it sets data as per that , as you can see it has been passed to handleClick
And then conditionally rendering based on that.
Classyfying on the basis of date.
*/