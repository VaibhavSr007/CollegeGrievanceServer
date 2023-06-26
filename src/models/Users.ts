import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    regNo: {
        type: String,
        unique: true,
        uppercase: true
    },
    year: Number,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    pass: String,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;