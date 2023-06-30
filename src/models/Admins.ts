import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: String,
    empNo: {
        type: String,
        unique: true,
        uppercase: true
    },
    dept: String,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    pass: String,
    isSuperUser: Boolean
});

const AdminModel = mongoose.model("Admin", adminSchema);

export default AdminModel;