import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventForm from './components/EventForm';

const App = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentView, setCurrentView] = useState('Month'); // 'Year', 'Month', 'Week', 'Day'

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/events');
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
        setCurrentView(view);
        setShowForm(false);
    };

    const deleteEvent = async (id) => {
        try {
            await axios.delete(`/api/events/${id}`);
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

    const renderYearView = () => {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        return (
            <div className="year-grid animate-in">
                {months.map((month, idx) => (
                    <div key={month} className="year-month-card glass" onClick={() => handleTabClick('Month')}>
                        <div className="year-month-name">{month}</div>
                        <div className="mini-days-grid">
                            {[...Array(30)].map((_, i) => (
                                <div key={i} className="mini-day">·</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container">
            <header className="animate-in">
                <div className="month-label">{currentView === 'Year' ? '2026' : 'June 2026'}</div>
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                    <div 
                        className="glass"
                        style={{
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '24px'
                        }}
                        onClick={() => {
                            if (showForm) {
                                setShowForm(false);
                            } else {
                                handleAddClick();
                            }
                        }}
                    >
                        {showForm ? '✕' : '+'}
                    </div>
                    <span style={{cursor: 'pointer', fontSize: '24px'}} title="Settings" onClick={() => alert('Settings menu coming soon!')}>⋮</span>
                </div>
            </header>

            {!showForm && currentView === 'Month' && (
                <div className="calendar-section animate-in">
                    <div className="days-grid">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="day-name">{d}</div>
                        ))}
                        {[...Array(30)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`day-number ${i + 1 === 21 ? 'today glass' : ''}`}
                                onClick={() => handleDateClick(i + 1)}
                                style={{cursor: 'pointer'}}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!showForm && currentView === 'Year' && renderYearView()}
            
            {showForm && (
                <div className="animate-in">
                    <EventForm 
                        initialDate={selectedDate}
                        onEventAdded={(newEvent) => {
                            setEvents([...events, newEvent]);
                            setShowForm(false);
                            setSelectedDate(null);
                        }} 
                    />
                </div>
            )}

            <div className="event-list animate-in">
                {events.map(event => (
                    <div key={event._id} className="event-card glass">
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

            <nav className="glass" style={{
                position: 'fixed', 
                bottom: 25, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                width: 'calc(100% - 40px)', 
                maxWidth: '430px', 
                borderRadius: '30px',
                display: 'flex', 
                justifyContent: 'space-around', 
                padding: '15px 0',
                zIndex: 1000,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}>
                <div onClick={() => handleTabClick('Year')} style={{display: 'flex', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '600', color: currentView === 'Year' ? 'white' : '#777', transition: '0.3s'}}>
                    <span style={{fontSize: '18px', opacity: currentView === 'Year' ? 1 : 0.5}}>🗓️</span>Year
                </div>
                <div onClick={() => handleTabClick('Month')} style={{display: 'flex', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '600', color: currentView === 'Month' ? 'white' : '#777', transition: '0.3s'}}>
                    <span style={{fontSize: '18px', opacity: currentView === 'Month' ? 1 : 0.5}}>📅</span>Month
                </div>
                <div onClick={() => handleTabClick('Week')} style={{display: 'flex', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '600', color: currentView === 'Week' ? 'white' : '#777', transition: '0.3s'}}>
                    <span style={{fontSize: '18px', opacity: currentView === 'Week' ? 1 : 0.5}}>🗓️</span>Week
                </div>
                <div onClick={() => handleTabClick('Day')} style={{display: 'flex', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '600', color: currentView === 'Day' ? 'white' : '#777', transition: '0.3s'}}>
                    <div style={{
                        width: '24px', 
                        height: '24px', 
                        background: currentView === 'Day' ? 'white' : 'transparent',
                        color: currentView === 'Day' ? 'black' : '#777',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        border: currentView === 'Day' ? 'none' : '2px solid #777'
                    }}>21</div>Day
                </div>
            </nav>
        </div>
    );
};

export default App;
