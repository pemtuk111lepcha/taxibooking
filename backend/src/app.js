require('dotenv').config({ path: '../.env' });
const express = require('express');
const path = require('path');
const { connectDB } = require('./utils/db');
const cors = require('cors');
const Booking = require('./models/Booking');
const nodemailer = require('nodemailer');


const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

app.use(express.static(path.join(__dirname, '../../frontend')));
// Direct route for getting all bookings

app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).send('Email is required');
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "pemtuk2002@gmail.com", // your Gmail address
                pass: process.env.EMAIL_PASS  // your Gmail app password
            }
        });
        await transporter.sendMail({
            from: "pemtuk2002@gmail.com", // must match the authenticated user
            to: "pemtuk2002@gmail.com", // <-- put your receiver email here
            subject: 'New Newsletter Signup',
            text: `New signup: ${email}`
        });
        res.send('Thank you for subscribing!');
    } catch (err) {
        console.error(err); // Add this to see the real error in your terminal
        res.status(500).send('Error sending email');
    }
});

// Direct route for creating a booking
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Create a new booking
app.post('/api/bookings', async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create booking' });
    }
});
app.get('/', (req, res) => {
    res.send('../../frontend/index.html');
});

app.patch('/api/bookings/:id/approve', async (req, res) => {
    try {
        const { approved, approvedBy } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { approved, approvedBy }, // Make sure both fields are updated
            { new: true }
        );
        res.json(booking);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update approval status' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});