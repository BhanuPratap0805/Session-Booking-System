import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FiUsers, FiCalendar } from 'react-icons/fi';
import ExpertListing from './pages/ExpertListing';
import ExpertDetail from './pages/ExpertDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

function App() {
    const [mousePos, setMousePos] = useState({ x: -300, y: -300 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <Router>
            <div className="app">
                <ParticleBackground />
                <div
                    className="cursor-glow"
                    style={{ left: mousePos.x, top: mousePos.y }}
                />

                <nav className="navbar">
                    <div className="navbar-container">
                        <NavLink to="/" className="logo">
                            <span className="logo-icon">⚡</span>
                            <span className="logo-text">ExpertBook</span>
                        </NavLink>
                        <div className="nav-links">
                            <NavLink
                                to="/"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                end
                            >
                                <FiUsers />
                                <span>Experts</span>
                            </NavLink>
                            <NavLink
                                to="/my-bookings"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <FiCalendar />
                                <span>My Bookings</span>
                            </NavLink>
                        </div>
                    </div>
                </nav>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<ExpertListing />} />
                        <Route path="/expert/:id" element={<ExpertDetail />} />
                        <Route path="/experts/:id" element={<ExpertDetail />} />
                        <Route path="/book/:expertId" element={<BookingForm />} />
                        <Route path="/my-bookings" element={<MyBookings />} />
                        <Route path="/bookings" element={<MyBookings />} />
                    </Routes>
                </main>

                <footer className="footer">
                    <p>© 2026 ExpertBook — Real-Time Session Booking</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
