import bcryptjs from "bcryptjs";
import Calorie from "../models/calorie.model.js";
import { generateToken } from "./utils.js";

function trimChecker(value, fieldName, res) {
    if (!value) return res.status(400).json({ message: fieldName + " Cannot be empty" });
}

function regexChecker(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

export const createUser = async (req, res) => {
    const { email, password, username } = req.body;

    console.log("Email is : " + email);

    await trimChecker(email, "Email", res);
    await trimChecker(password, "Password", res);
    await trimChecker(username, "Username", res);
    /*Variable Name*/
    const ifEmailAlreadyExists = await Calorie.findOne({ email });

    console.log(email + "\n password is " + password);

    if (ifEmailAlreadyExists) return res.status(400).json({ message: "Email Already Exists ! Login !" });

    const userCreated = new Calorie({
        username,
        email,
        password
    });

    if (!userCreated) return res.status(404).json({ message: "Failed to create User !" })

    await userCreated.save();

    generateToken(userCreated._id, res);

    return res.status(201).json({ data: userCreated });
}

export const editUser = async (req, res) => {
    if (!req.user) return res.status(400).json({ message: "Unauthorized - User" });
    console.log("Request hitted");
    const userId = req.user._id;
    console.log("userId is : " + userId)
    const user = await Calorie.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const { updatedEmail, userGivenPassword, updatedPassword, updatedUsername } = req.body;

    const doEmailAlreadyExists = await Calorie.findOne({ email: updatedEmail });

    if (doEmailAlreadyExists && doEmailAlreadyExists._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Email already exists." });
    }

    console.log("updatedEmail is : " + updatedEmail)

    if (!userGivenPassword || !updatedPassword) return res.status(400).json({ message: "Both original and updated passwords are required." });

    console.log(userGivenPassword, "User password is : " + user.password);

    if (userGivenPassword) {
        const isPasswordIsIncorrect = user.password !== userGivenPassword;
        if (isPasswordIsIncorrect) {
            return res.status(400).json({ message: "Password is incorrect." })
        }
        user.password = updatedPassword
    }

    updatedEmail && (user.email = updatedEmail);
    updatedUsername && (user.username = updatedUsername);

    await user.save();

    return res.status(201).json({ data: user, message: "User Data updated successfully !" })

};

export const deleteUser = async (req, res) => {

    const userId = req.user._id;

    const user = await Calorie.findById(userId);

    if (!user) return res.status(400).json({ error : "User doesn't exists" });

    const { userGivenPassword } = req.body;

    console.log("userGivenPassword is : " + userGivenPassword)

    if (!userGivenPassword) {
        return res.status(400).json({ error : "Password is required !" });
    }
    // Password check (since you're not using bcryptjs for now)
    if (user.password !== userGivenPassword) {
        return res.status(401).json({ error : "Incorrect password" });
    }

    await Calorie.deleteOne({ _id: userId });

    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Account deleted successfully" });

    return res.status(200).json({ message: "User deleted successfully" });
};

export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        trimChecker(email, "Email", res);
        trimChecker(password, "Password", res);

        console.log("This is before regex checker")
        regexChecker(email);
        console.log("This is after regex checker");

        const user = await Calorie.findOne({ email });

        if (!user) console.log("Invalid Email");
        if (!user) return res.status(401).json({ message: "Invalid Email" });

        if (user) {

            if (user.password !== password) {
                return res.status(401).json({ message: "Incorrect password" });
            }

            generateToken(user._id, res);

            console.log("Token generated");

            res.status(200).json({ data: user })

        }

    } catch (error) {
        return res.status(201)
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "Strict", // or "Lax"
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error is : " + error);
    }
};