// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// In-memory database
let users = [
    { id: 1, username: 'Bilal', password: '12345' },
    { id: 2, username: 'Abdullah', password: '67890' }
];

let events = [
    { id: 1, name: 'Team Meeting', description: 'Monthly team sync-up', date: '2025-03-15', time: '10:00 AM', category: 'Meetings', userId: 1, reminders: ['2025-03-15T09:45:00'] },
    { id: 2, name: 'Birthday Party', description: 'Celebrate Mike\'s birthday', date: '2025-03-20', time: '7:00 PM', category: 'Birthdays', userId: 2, reminders: ['2025-03-20T06:30:00'] },
    { id: 3, name: 'Doctor Appointment', description: 'Routine health check-up', date: '2025-03-22', time: '3:00 PM', category: 'Appointments', userId: 1, reminders: ['2025-03-22T02:30:00'] }
];

// Event Routes
app.post('/api/events', (req, res) => {
    const { name, description, date, time, category, userId } = req.body;
    const newEvent = { id: events.length + 1, name, description, date, time, category, userId, reminders: [] };
    events.push(newEvent);
    res.status(201).json(newEvent);
});

app.get('/api/events', (req, res) => {
    res.json(events);
});

app.get('/api/events/:id', (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
});

app.delete('/api/events/:id', (req, res) => {
    events = events.filter(e => e.id !== parseInt(req.params.id));
    res.json({ message: 'Event deleted' });
});

// User Routes
app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    res.status(201).json(newUser);
});


app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/events/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'Event not found' });
    res.json(user);
});

app.delete('/api/users/:id', (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.json({ message: 'User deleted' });
});

// Reminder Service
const sendReminders = () => {
    const now = new Date();
    events.forEach(event => {
        event.reminders.forEach(reminder => {
            const reminderTime = new Date(reminder);
            if (reminderTime <= now) {
                console.log(`Reminder: ${event.name} is happening soon!`);
            }
        });
    });
};

// Run reminder service every minute
setInterval(sendReminders, 60000);
module.exports = app;


if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
