import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventForm from './components/EventForm';

const App = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/events');
            setEvents(res.data);
        } catch (err) {
            console.error('Error fetching events', err);
        }
    };

    const handleDateClick = (day) => {
        const date = new Date(2026, 5, day); // June 2026
        setSelectedDate(date);
        setShowForm(true);
    };

    const handleAddClick = () => {
        const now = new Date();
        setSelectedDate(now);
        setShowForm(true);
    };

    const handleTabClick = (view) => {
        alert(`${view} view is not implemented yet in this basic demo.`);
    };

    const deleteEvent = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/events/${id}`);
            setEvents(events.filter(event => event._id !== id));
        } catch (err) {
            console.error('Error deleting event', err);
        }
    };

    const getDaysRemaining = (date) => {
        const diff = new Date(date) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} days` : days === 0 ? 'Today' : 'Past';
    };

    const types = {
        Event: { icon: '📅', color: 'Event' },
        Birthday: { icon: '🎂', color: 'Birthday' },
        Anniversary: { icon: '🔖', color: 'Anniversary' },
        Countdown: { icon: '⏳', color: 'Countdown' }
    };

    return (
        <div className="container">
            <header>
                <div className="month-label">2026 / 6</div>
                <div style={{display: 'flex', gap: '15px', fontSize: '20px'}}>
                    <span style={{cursor: 'pointer'}} title="Add Event" onClick={() => {
                        if (showForm) {
                            setShowForm(false);
                        } else {
                            handleAddClick();
                        }
                    }}>{showForm ? '✕' : '+'}</span>
                    <span style={{cursor: 'pointer'}} title="Settings" onClick={() => alert('Settings menu coming soon!')}>⋮</span>
                </div>
            </header>

            {!showForm && (
                <div className="calendar-section">
                    <div className="days-grid">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="day-name">{d}</div>
                        ))}
                        {[...Array(30)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`day-number ${i + 1 === 21 ? 'today' : ''}`}
                                onClick={() => handleDateClick(i + 1)}
                                style={{cursor: 'pointer'}}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {showForm && (
                <EventForm 
                    initialDate={selectedDate}
                    onEventAdded={(newEvent) => {
                        setEvents([...events, newEvent]);
                        setShowForm(false);
                        setSelectedDate(null);
                    }} 
                />
            )}


            <div className="event-list">
                {events.map(event => (
                    <div key={event._id} className="event-card">
                        <div className="event-card-header">
                            <div className="event-card-title">
                                <span className={`dot ${event.type}`}></span>
                                {event.title}
                                {types[event.type]?.icon}
                            </div>
                            <div className="event-card-countdown">
                                {getDaysRemaining(event.start)}
                            </div>
                        </div>
                        <div className="event-card-subtitle">
                            {event.type} | {new Date(event.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <button 
                            onClick={() => deleteEvent(event._id)} 
                            style={{
                                position: 'absolute', 
                                right: '10px', 
                                bottom: '10px', 
                                background: 'transparent', 
                                border: 'none', 
                                color: '#444', 
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <nav style={{
                position: 'fixed', 
                bottom: 0, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                width: '100%', 
                maxWidth: '500px', 
                background: '#000', 
                display: 'flex', 
                justifyContent: 'space-around', 
                padding: '15px 0',
                borderTop: '1px solid #222'
            }}>
                <div onClick={() => handleTabClick('Year')} style={{display: 'flex', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#888'}}>
                    <span>📅</span>Year
                </div>
                <div onClick={() => setShowForm(false)} style={{display: 'flex', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'white'}}>
                    <span>📅</span>Month
                </div>
                <div onClick={() => handleTabClick('Week')} style={{display: 'flex', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#888'}}>
                    <span>📅</span>Week
                </div>
                <div onClick={() => handleTabClick('Day')} style={{display: 'flex', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#888'}}>
                    <span style={{fontWeight: 'bold'}}>21</span>Day
                </div>
            </nav>
        </div>
    );
};

export default App;

