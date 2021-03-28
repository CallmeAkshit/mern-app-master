const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
    
    sessionId: {
        type: String,
        required: true
    },
    cartItems: [{ productId: String, qty: Number, pricePerUnit: Number }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    totalAmount: {type: Number}

});

module.exports = mongoose.model('Cart', cartSchema);