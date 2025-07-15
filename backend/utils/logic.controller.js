import Calorie from "../models/calorie.model.js";
import cron from "node-cron";

function trimChecker(value, fieldName, res) {
    if (!value) return res.status(400).json({ message: fieldName + " Cannot be empty" });
}

export const getUserData = async (req, res) => {
    try {

        const userId = req.user._id;
        if (!userId) return res.status(401).json({ message: "Invalid User" });
        console.log(userId);
        const user = await Calorie.findById(userId);

        return res.status(200).json({ message: "Take this data", data: user });

    } catch (error) {
        console.log("Error is : " + error);
    }
}

export const postUserData = async (req, res) => {
    if (!req.user) return;

    const { name, calories, roundedTdeeCalc } = req.body;

    console.log("requiredCalorieIntake is : " + roundedTdeeCalc);
    if (name) {
        console.log("Food Item : " + name);
        trimChecker(name, "foodName", res);
    }

    if (calories) {
        trimChecker(calories, "Calories", res);
    }

    const userId = req.user._id;
    const today = new Date().toISOString().split("T")[0];
    const selectedDate = req.body.customDate || today;

    try {
        const user = await Calorie.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const dateEntry = user.DateWise.find(entry => entry.date === selectedDate);

        if (roundedTdeeCalc) {
            user.requiredCalorieIntake = roundedTdeeCalc
        }

        if (dateEntry) {
            if (name && calories) {
                dateEntry.fooditems.push({ name, calories });
                dateEntry.totalCalories += calories;
            }
        } else {
            if (name && calories) {
                user.DateWise.push({
                    date: selectedDate,
                    totalCalories: calories,
                    fooditems: [{ name, calories }]
                })
            }
        }

        await user.save();

        return res.status(200).json({ message: "food Item Added Successfully", data: user });
    } catch (error) {
        console.log("Error is : " + error)
    }

}

export const editUserData = async (req, res) => {
    const { dateid, fooditemid } = req.params;
    const { name, calories } = req.body;
    trimChecker(dateid, "Date Id", res);
    trimChecker(fooditemid, "Food Item Id", res);

    console.log(dateid, fooditemid, name, "calories are : " + calories);

    const userId = req.user._id;

    try {

        const user = await Calorie.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const dateEntry = user.DateWise.id(dateid);
        if (!dateEntry) return res.status(404).json({ message: "Date entry not found" });

        const foodItem = dateEntry.fooditems.id(fooditemid);

        if (!foodItem) return res.status(400).json({ message: "FoodItem not found" });

        if (name) foodItem.name = name;
        if (calories) foodItem.calories = calories;

        dateEntry.totalCalories = dateEntry.fooditems.reduce((sum, item) => sum + item.calories, 0)

        await user.save();

        return res.status(201).json({ message: "foodItem modified Successfully", data: foodItem });

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