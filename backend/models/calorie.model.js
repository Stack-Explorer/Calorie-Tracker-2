import mongoose from "mongoose";

const foodItemsSchema = new mongoose.Schema({
    name: String,
    calories: Number,
}, { timestamps: true });

const dateWiseSchema = new mongoose.Schema({
    date: String,
    totalCalories : Number,
    fooditems : [foodItemsSchema],
    caloriesBurnt : {type : Number,default : 0}
});

const calorieAndUserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    requiredCalorieIntake: { type: String },
    netCaloriesBurnt : Number,
    netCaloriesIntake : Number,
    DateWise : [dateWiseSchema]
});

const Calorie = mongoose.model("Calorie", calorieAndUserSchema);

export default Calorie;