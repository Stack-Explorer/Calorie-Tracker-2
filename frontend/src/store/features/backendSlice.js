import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendUserData = createAsyncThunk("backend/sendUserData", async (userData, thunkAPI) => {
    try {
        const { email, password, username } = userData;
        console.log("Email : " + email + "Password is : " + password + "Username is : " + username);
        const response = await axios.post("http://localhost:5001/create-user", { email, password, username }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const sendCalorieBurnt = createAsyncThunk("backend/sendUserCalorie", async ({ caloriesBurnt,selectedDate }, thunkAPI) => {
    const customDate = selectedDate

    try {
        const response = await axios.post("http://localhost:5001/post-userdata", { caloriesBurnt,customDate }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const sendEditedBurntCalories = createAsyncThunk("backend/sendEditedBurntCalories", async ({ caloriesBurnt, dateid }, thunkAPI) => {
    try {
        const response = await axios.put(`http://localhost:5001/edit-calorieburnt/${dateid}`, { caloriesBurnt }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
})

export const loginUser = createAsyncThunk("backend/loginUser", async (userData, thunkAPI) => {
    try {
        const { email, password } = userData;
        const response = await axios.post("http://localhost:5001/login-user", { email, password }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const logoutUser = createAsyncThunk("backend/logoutUser", async (_, thunkAPI) => {
    try {
        const response = await axios.post("http://localhost:5001/logout-user", {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const checkUserSession = createAsyncThunk("backend/getUserData", async (_, thunkAPI) => {
    try {
        const response = await axios.get("http://localhost:5001/get-userdata", {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const addUserData = createAsyncThunk("backend/postUserData", async (updatedUserData, thunkAPI) => {
    try {
        const { name, calories, customDate } = updatedUserData;
        const response = await axios.post(
            "http://localhost:5001/post-userdata",
            { name, calories, customDate },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const setCalorieIntake = createAsyncThunk("backend/setCalorieIntake", async ({ roundedTdeeCalc }, thunkAPI) => {
    try {
        console.log("required calorie intake is : " + roundedTdeeCalc);
        const response = await axios.post("http://localhost:5001/post-userdata", { roundedTdeeCalc }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
})

export const editUserData = createAsyncThunk("backend/editUserData", async ({ dateid, fooditemid, name, calories }, thunkAPI) => {
    console.log("editUser hitted");
    try {
        console.log("Type of calories is :", typeof calories);
        const response = await axios.put(`http://localhost:5001/edit-userdata/${dateid}/${fooditemid}`, { name, calories }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteUserData = createAsyncThunk("backend/deleteUserData", async (userData, thunkAPI) => {
    try {
        const { dateid, fooditemid } = userData;
        const response = await axios.delete(`http://localhost:5001/delete-userdata/${dateid}/${fooditemid}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const editUserCredentials = createAsyncThunk("backend/editUserCredentials", async (updateUser, thunkAPI) => {
    const { updatedEmail, userGivenPassword, updatedPassword, updatedUsername } = updateUser;
    console.log("Email is : " + updatedEmail)
    try {
        const response = await axios.put("http://localhost:5001/edit-user", { updatedEmail, userGivenPassword, updatedPassword, updatedUsername }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteUsersWholeData = createAsyncThunk("backend/deleteUserWholeData", async ({ userGivenPassword }, thunkAPI) => {
    console.log("userGivenPassword is : " + userGivenPassword);
    try {
        const response = await axios.post("http://localhost:5001/delete-user", { userGivenPassword }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.message || error.message);
    }
})

const backendSlice = createSlice({
    name: "backend",
    initialState: { status: "idle", error: null, isAuthenticated: false, data: null, message: null }, // message state is also to be added.
    extraReducers: (builder) => {
        builder
            .addCase(sendEditedBurntCalories.pending, (state) => {
                state.status = "loading"
            })
            .addCase(sendEditedBurntCalories.fulfilled, (state, action) => {
                state.status = "successfull",
                    state.data = action.payload?.data

            })
            .addCase(sendEditedBurntCalories.rejected, (state, action) => {
                state.status = "rejected",
                    state.error = action.payload?.error
            })
            .addCase(sendCalorieBurnt.pending, (state) => {
                state.status = "idle";
            })
            .addCase(sendCalorieBurnt.fulfilled, (state, action) => {
                state.status = "successfull",
                    state.data = action.payload?.data
            })
            .addCase(sendCalorieBurnt.rejected, (state, action) => {
                state.status = "rejected",
                    state.error = action.payload?.error
            })
            .addCase(deleteUsersWholeData.pending, (state) => {
                state.status = "pending"
            })
            .addCase(deleteUsersWholeData.fulfilled, (state, action) => {
                state.status = "succeeded",
                    state.data = action.payload?.data
                state.message = action.payload?.message
            })
            .addCase(deleteUsersWholeData.rejected, (state, action) => {
                state.status = "rejected",
                    state.error = action.payload?.error
            })
            .addCase(editUserCredentials.pending, (state) => {
                state.status = "pending";
            })
            .addCase(editUserCredentials.fulfilled, (state, action) => {
                state.data = action.payload?.data,
                    state.status = "succeeded"
            })
            .addCase(editUserCredentials.rejected, (state, action) => {
                state.status = "failed",
                    state.error = action.payload?.error
            })
            .addCase(setCalorieIntake.pending, (state) => {
                state.status = "pending";
            })
            .addCase(setCalorieIntake.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.data = action.payload?.data
            })
            .addCase(setCalorieIntake.rejected, (state) => {
                state.status = "rejected";
                state.error = action.payload?.error;
            })
            .addCase(deleteUserData.pending, (state) => {
                state.status = "pending";
            })
            .addCase(deleteUserData.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.data = action.payload?.data
            })
            .addCase(deleteUserData.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload?.error;
            })
            .addCase(editUserData.pending, (state) => {
                state.status = "idle"
            })
            .addCase(editUserData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload?.data;
            })
            .addCase(editUserData.rejected, (state, action) => {
                state.error = action.payload?.error;
                state.data = null
                state.status = "rejected"
            })
            .addCase(addUserData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addUserData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload?.data; // ✅ Now this will update the Redux store correctly
            })
            .addCase(sendUserData.pending, (state) => {
                state.data = null;
                state.status = "loading";
            })
            .addCase(sendUserData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isAuthenticated = true;
                state.data = action.payload?.data;
            })
            .addCase(sendUserData.rejected, (state, action) => {
                state.status = "failed";
                state.data = null;
                state.error = action.payload;
                state.message = action.payload?.message
            })
            .addCase(loginUser.pending, (state) => {
                state.data = null;
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isAuthenticated = true;
                state.data = action.payload.data;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                state.message = action.payload?.message
            })
            .addCase(logoutUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(logoutUser.fulfilled, (state,) => {
                state.status = "succeeded";
                state.isAuthenticated = false;
                state.data = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(checkUserSession.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isAuthenticated = true;
                state.data = action.payload?.data;
            })
            .addCase(checkUserSession.rejected, (state, action) => {
                state.status = "failed";
                state.isAuthenticated = false;
                state.data = null;
            })
    }
});

export const { increment, decrement } = backendSlice.actions;
export default backendSlice.reducer;