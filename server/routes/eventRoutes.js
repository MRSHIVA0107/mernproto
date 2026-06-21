const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// @route   GET /api/events
// @desc    Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ start: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/events
// @desc    Create an event
router.post('/', async (req, res) => {
    const { title, description, start, end, type, isAllDay, repeat, reminder, alarm, guests } = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            start,
            end,
            type,
            isAllDay,
            repeat,
            reminder,
            alarm,
            guests
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        
        await event.deleteOne();
        res.json({ msg: 'Event removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
