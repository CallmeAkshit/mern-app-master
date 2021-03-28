const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    // userId: {
    //     type: String,
    //     required: true,
    //     unique:true
    // },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    address:{
        houseNo: {
            type: Number,
            required: true,
            unique: true
        },
        Locality: {
            type: String,
            required: true,
            unique: true
        },
        City:{
            type: String,
            required: true,
            unique: true
        },
        Pincode:{
            type: Number,
            required: true,
            unique: true
        },
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);