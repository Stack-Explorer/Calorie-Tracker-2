import Calorie from "../models/calorie.model.js";
import cron from "node-cron";

function trimChecker(value, fieldName, res) {
    if (!value) return res.status(400).json({ error: fieldName + " Cannot be empty" });
}

export const getUserData = async (req, res) => {
    try {

        const userId = req.user._id;
        if (!userId) return res.status(401).json({ error: "Invalid User" });
        console.log(userId);
        const user = await Calorie.findById(userId);

        return res.status(200).json({ message: "Take this data", data: user });

    } catch (error) {
        console.log("Error is : " + error);
    }
}

export const postUserData = async (req, res) => {
    console.log("Request hitted !");
    const { name, calories, roundedTdeeCalc, caloriesBurnt,customDate } = req.body;
    const userId = req.user._id;
    const user = await Calorie.findById(userId);
    if (!user) return res.status(400).json({ error: "User dont exists" });

    const today = new Date().toISOString().split("T")[0];

    const selectedDate = customDate || today;

    const dateEntry = await user.DateWise.find((currItem) => currItem.date === selectedDate);

    user.netCaloriesBurnt = user.DateWise.reduce((sum, currItem) => sum + currItem.caloriesBurnt, 0);

    roundedTdeeCalc ? user.requiredCalorieIntake = roundedTdeeCalc : 0;

    if (!dateEntry) console.log("No entry for today");

    if (dateEntry) {
        if (name && calories) {
            dateEntry.fooditems.push({ name, calories })
        }
        dateEntry.totalCalories = dateEntry.fooditems.reduce((sum, currItem) => sum + currItem.calories, 0);
        if (caloriesBurnt) dateEntry.caloriesBurnt = caloriesBurnt
    } else {
        await user.DateWise.push({
            date: selectedDate,
            fooditems: name && calories ? [{ name, calories }] : [], // to add frontend validation.
            caloriesBurnt: caloriesBurnt || 0,
            totalCalories: calories || 0
        })
    }

    user.netCaloriesBurnt = user.DateWise.reduce((sum, currItem) => sum + currItem.caloriesBurnt, 0);
    const totalCalorieIntakeArray = user.DateWise.map((currItem) => currItem.totalCalories);

    const totalCalorieIntake = totalCalorieIntakeArray.reduce((sum, item) => sum + item, 0);
    user.netCaloriesIntake = totalCalorieIntake;

    console.log("Net cal Intake is :", totalCalorieIntake)

    await user.save();

    return res.status(201).json({ message: "Data Added successfully", data: user });

}

export const editUserCalorieBurnt = async (req, res) => {
    const { dateid } = req.params; // will be sent by user as per.
    const { caloriesBurnt } = req.body;
    console.log("dateid is :", dateid, "calories burnt are :", caloriesBurnt);
    const userId = req.user._id;
    try {

        await trimChecker(caloriesBurnt);
        const user = await Calorie.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const dateEntry = await user.DateWise.id(dateid);
        if (!dateEntry) return res.status(404).json({ error: "Date Entry not found" });


        if (caloriesBurnt) dateEntry.caloriesBurnt = caloriesBurnt;
        user.netCaloriesBurnt = user.DateWise.reduce((sum, item) => sum + item.caloriesBurnt, 0);

        const totalCalorieIntakeArray = user.DateWise.map((currItem) => currItem.totalCalories);

        const totalCalorieIntake = totalCalorieIntakeArray.reduce((sum, item) => sum + item, 0);
        user.netCaloriesIntake = totalCalorieIntake;

        await user.save();

        return res.status(201).json({ message: "burn Calories updated successfully !", data: user });

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const editUserData = async (req, res) => {
   
    console.log("Request hitted !")

    const { dateid, fooditemid } = req.params;
    const { name, calories } = req.body;
    trimChecker(dateid, "Date Id", res);
    trimChecker(fooditemid, "Food Item Id", res);

    console.log(dateid, fooditemid, name, "calories are : " + calories);

    const userId = req.user._id;

    try {
        const user = await Calorie.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const dateEntry = user.DateWise.id(dateid);
        if (!dateEntry) return res.status(404).json({ error: "Date entry not found" });

        const foodItem = dateEntry.fooditems.id(fooditemid);

        if (!foodItem) return res.status(400).json({ error: "FoodItem not found" });

        if (name) foodItem.name = name;
        if (calories) foodItem.calories = calories;

        dateEntry.totalCalories = dateEntry.fooditems.reduce((sum, item) => {
            return sum + item.calories;
        }, 0);


        await user.save();

        return res.status(201).json({ message: "foodItem modified Successfully", data: user });

    } catch (error) {
        console.log("Edit error : " + error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteUserData = async (req, res) => {
    const { dateid, fooditemid } = req.params;
    trimChecker(dateid, "Date Id", res);
    trimChecker(fooditemid, "Food Id", res);

    const userId = req.user._id;
    try {
        const user = await Calorie.findById(userId);

        if (!user) return res.status(400).json({ message: "User not found !" });

        const dateEntry = user.DateWise.id(dateid);

        if (!dateEntry) return res.status(400).json({ message: "Date Entry not found" });

        const foodItem = dateEntry.fooditems.id(fooditemid);

        if (!foodItem) return res.status(400).json({ message: "FoodItem Entry not found" });

        await foodItem.deleteOne();

        dateEntry.totalCalories = dateEntry.fooditems.reduce((sum, item) => sum + item.calories, 0)

        await user.save();

        return res.status(200).json({
            message: "Food Item Deleted Successfully",
            data: user
        });
    } catch (error) {
        console.error("Error while deleting user data:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

cron.schedule("0 0 * * *", async () => {
    const today = new Date().toISOString().split("T")[0];

    // on each and every day create new date object that also came from cron.schedule

    try {
        const allUsers = await Calorie.find(); // returns cursor.

        for (const user of allUsers) {
            const alreadyExists = user.DateWise.some(entry => entry.date === today);

            if (!alreadyExists) {
                user.DateWise.push({
                    date: today,
                    totalCalories: 0,
                    fooditems: []
                });

                await user.save();
                console.log(`Added ${today} for ${user.username}`);
            }
            console.log("Daily empty entries created");
        }
    } catch (error) {
        console.log("❌ Error in daily cron job : " + error);
    }
});