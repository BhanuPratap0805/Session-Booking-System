import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiBriefcase, FiClock, FiZap } from 'react-icons/fi';
import { getExpertById } from '../api';
import socket from '../socket';
import ScrollReveal from '../components/ScrollReveal';

function ExpertDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expert, setExpert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flashSlot, setFlashSlot] = useState(null);

    useEffect(() => {
        setLoading(true);
        getExpertById(id)
            .then((res) => setExpert(res.data))
            .catch(() => setError('Could not load expert'))
            .finally(() => setLoading(false));
    }, [id]);

    // Join the socket room for this expert
    useEffect(() => {
        if (!id) return;
        socket.emit('joinExpertRoom', id);
        return () => {
            socket.emit('leaveExpertRoom', id);
        };
    }, [id]);

    // Listen for real-time slot bookings
    useEffect(() => {
        const handleBooked = (data) => {
            if (!expert || data.expertId !== expert._id) return;

            // Flash the slot that was booked
            const slotKey = `${data.date}_${data.timeSlot}`;
            setFlashSlot(slotKey);
            setTimeout(() => setFlashSlot(null), 600);

            // Mark the slot as booked
            setExpert((prev) => ({
                ...prev,
                availableSlots: prev.availableSlots.map((s) =>
                    s.date === data.date && s.time === data.timeSlot
                        ? { ...s, isBooked: true }
                        : s
                ),
            }));
        };
        socket.on('slotBooked', handleBooked);
        return () => socket.off('slotBooked', handleBooked);
    }, [expert]);

    if (loading) {
        return (
            <div className="detail-loading">
                <div className="spinner" />
                <p style={{ color: 'var(--gray-400)' }}>Loading expert profile...</p>
            </div>
        );
    }

    if (error || !expert) {
        return (
            <div className="state-message">
                <span className="state-icon">😕</span>
                <h3>Expert not found</h3>
                <p>{error || 'The expert you\'re looking for doesn\'t exist.'}</p>
                <button className="btn-solid" onClick={() => navigate('/')}>Browse Experts</button>
            </div>
        );
    }

    // Group slots by date
    const slotsByDate = {};
    (expert.availableSlots || []).forEach((slot) => {
        const dateKey = new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
        });
        if (!slotsByDate[dateKey]) slotsByDate[dateKey] = { dateRaw: slot.date, slots: [] };
        slotsByDate[dateKey].slots.push(slot);
    });

    const available = (expert.availableSlots || []).filter((s) => !s.isBooked).length;

    const EMOJI_MAP = { Technology: '💻', Business: '📊', Health: '🧬', Design: '🎨', Education: '📚' };

    return (
        <div className="detail-page">
            <button className="back-btn" onClick={() => navigate('/')}>
                <FiArrowLeft /> Back to Experts
            </button>

            <ScrollReveal>
                <div className="detail-hero">
                    <div className="detail-hero-bg" />
                    <div className="detail-hero-content">
                        <div className="detail-avatar-large">
                            {EMOJI_MAP[expert.category] || '👤'}
                        </div>
                        <div className="detail-hero-info">
                            <div className="detail-badge">{expert.category}</div>
                            <h1>{expert.name}</h1>
                            <p className="detail-bio">{expert.bio}</p>
                            <div className="detail-hero-stats">
                                <div className="hero-stat">
                                    <FiStar className="hero-stat-icon star" />
                                    <strong>{expert.rating}</strong>
                                    <span>rating</span>
                                </div>
                                <div className="hero-stat">
                                    <FiBriefcase className="hero-stat-icon" />
                                    <strong>{expert.experience}y</strong>
                                    <span>experience</span>
                                </div>
                                <div className="hero-stat">
                                    <FiClock className="hero-stat-icon" />
                                    <strong>{available}</strong>
                                    <span>slots open</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {expert.specializations?.length > 0 && (
                <ScrollReveal delay={100}>
                    <div className="detail-section">
                        <h2 className="section-title">
                            <FiZap /> Specializations
                        </h2>
                        <div className="spec-pills">
                            {expert.specializations.map((spec) => (
                                <span key={spec} className="spec-pill">{spec}</span>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            )}

            <ScrollReveal delay={200}>
                <div className="detail-section">
                    <h2 className="section-title">
                        <FiClock /> Available Slots
                        <span className="live-dot" />
                        <span className="live-label">Live</span>
                    </h2>

                    {Object.keys(slotsByDate).length === 0 ? (
                        <div className="state-message compact">
                            <span className="state-icon">📅</span>
                            <h3>No slots available</h3>
                            <p>Check back later for new openings.</p>
                        </div>
                    ) : (
                        Object.entries(slotsByDate).map(([dateLabel, { dateRaw, slots }]) => (
                            <div key={dateLabel} className="date-block">
                                <div className="date-header">{dateLabel}</div>
                                <div className="slots-row">
                                    {slots.map((slot) => {
                                        const slotKey = `${slot.date}_${slot.time}`;
                                        return (
                                            <button
                                                key={slot._id}
                                                className={`slot-chip ${slot.isBooked ? 'booked' : ''} ${flashSlot === slotKey ? 'flash' : ''}`}
                                                disabled={slot.isBooked}
                                                onClick={() => !slot.isBooked && navigate(
                                                    `/book/${expert._id}?date=${slot.date}&time=${encodeURIComponent(slot.time)}`
                                                )}
                                            >
                                                {slot.time} {slot.isBooked ? '(Booked)' : ''}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollReveal>
        </div>
    );
}

export default ExpertDetail;
