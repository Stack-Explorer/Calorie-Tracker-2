import mongoose from "mongoose";

const foodItemsSchema = new mongoose.Schema({
    name: String,
    calories: Number,
}, { timestamps: true });

const dateWiseSchema = new mongoose.Schema({
    date: String,
    totalCalories : Number,
    fooditems : [foodItemsSchema]
})

const calorieAndUserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    requiredCalorieIntake: { type: String },
    DateWise : [dateWiseSchema]
    // Before
  /*  DateWise: [
        {
            date: String,
            totalCalories: Number,
            fooditems: [foodItemsSchema]
        }
    ]*/
});

const Calorie = mongoose.model("Calorie", calorieAndUserSchema);

export default Calorie;