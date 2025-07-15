// Backend
// postUserData

/*
first of all roundedTdeeCalc is being taken form user then if it is beng sent by user then it is setted as roundedTdeeCalc;
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