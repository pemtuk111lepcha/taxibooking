const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    from: String,
    to: String,
    datetime: String,
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
    approvedBy: { type: String, default: null },
    expiresAt: { type: Date, default: () => Date.now() + 24*60*60*1000, index: { expires: 0 } }
});

mongoose.set('useFindAndModify', false);
module.exports = mongoose.model('Booking', bookingSchema);