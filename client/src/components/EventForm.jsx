import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventForm = ({ onEventAdded, initialDate }) => {
    const [type, setType] = useState('Event');

    const formatInitialDate = (date, isDateTime = true) => {
        if (!date) return '';
        const d = new Date(date);
        const z = d.getTimezoneOffset() * 60 * 1000;
        const local = new Date(d - z);
        const iso = local.toISOString();
        return isDateTime ? iso.slice(0, 16) : iso.slice(0, 10);
    };

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start: formatInitialDate(initialDate, true),
        end: '',
        isAllDay: false,
        repeat: 'Never',
        reminder: 'On start',
        alarm: false,
        guests: ''
    });

    useEffect(() => {
        if (initialDate) {
            const isDateTime = !(type === 'Birthday' || type === 'Anniversary');
            setFormData(prev => ({
                ...prev,
                start: formatInitialDate(initialDate, isDateTime)
            }));
        }
    }, [initialDate, type]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/events', { ...formData, type });
            onEventAdded(res.data);
            // Reset but keep some defaults
            setFormData({
                title: '',
                description: '',
                start: '',
                end: '',
                isAllDay: false,
                repeat: 'Never',
                reminder: 'On start',
                alarm: false,
                guests: ''
            });
        } catch (err) {
            console.error('Error adding event', err);
        }
    };

    const types = [
        { name: 'Event', icon: '📅' },
        { name: 'Birthday', icon: '🎂' },
        { name: 'Anniversary', icon: '🔖' },
        { name: 'Countdown', icon: '⏳' }
    ];

    return (
        <div className="form-container">
            <div className="tabs">
                {types.map(t => (
                    <button 
                        key={t.name}
                        className={`tab-btn ${t.name} ${type === t.name ? 'active' : ''}`}
                        onClick={() => setType(t.name)}
                    >
                        <span>{t.icon}</span>
                        {t.name}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} style={{border: 'none', padding: 0, margin: 0}}>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="title" 
                        placeholder={type === 'Birthday' ? 'Enter a name' : 'Enter event title'} 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                {type === 'Event' && (
                    <div className="form-group toggle-group">
                        <label>All day</label>
                        <input type="checkbox" name="isAllDay" checked={formData.isAllDay} onChange={handleChange} />
                    </div>
                )}

                <div className="form-group">
                    <label>{type === 'Event' ? 'From' : 'When'}</label>
                    <input 
                        type={type === 'Birthday' || type === 'Anniversary' ? "date" : "datetime-local"} 
                        name="start" 
                        value={formData.start} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                {type === 'Event' && !formData.isAllDay && (
                    <div className="form-group">
                        <label>To</label>
                        <input type="datetime-local" name="end" value={formData.end} onChange={handleChange} />
                    </div>
                )}

                {(type === 'Event' || type === 'Countdown') && (
                    <div className="form-group">
                        <label>Repeat</label>
                        <select name="repeat" value={formData.repeat} onChange={handleChange}>
                            <option>Never</option>
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>Reminders</label>
                    <select name="reminder" value={formData.reminder} onChange={handleChange}>
                        <option>When event starts</option>
                        <option>5 minutes before</option>
                        <option>1 hour before</option>
                        <option>1 day before</option>
                        <option>3 days before</option>
                    </select>
                </div>

                <div className="form-group toggle-group">
                    <label>Alarm reminders</label>
                    <input type="checkbox" name="alarm" checked={formData.alarm} onChange={handleChange} />
                </div>

                {type === 'Event' && (
                    <div className="form-group">
                        <input type="text" name="guests" placeholder="Guests" value={formData.guests} onChange={handleChange} />
                    </div>
                )}

                <div className="form-group">
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
                </div>

                <button type="submit" className="save-btn">Save {type}</button>
            </form>
        </div>
    );
};

export default EventForm;

