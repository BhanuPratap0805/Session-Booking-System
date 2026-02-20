import { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { createBooking } from '../api';
import ScrollReveal from '../components/ScrollReveal';

function BookingForm() {
    const { expertId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const date = searchParams.get('date');
    const time = searchParams.get('time');

    const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
        if (!form.phone.trim()) errs.phone = 'Phone number is required';
        else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSubmitting(true);
        setServerError('');
        try {
            await createBooking({
                expertId,
                userName: form.name,
                email: form.email,
                phone: form.phone,
                date,
                timeSlot: time,
                notes: form.notes,
            });
            setSubmitted(true);
        } catch (err) {
            setServerError(err.response?.data?.message || err.message || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formattedDate = date
        ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        : '';

    if (submitted) {
        return (
            <div className="booking-page">
                <div className="success-card">
                    <div className="success-check"><FiCheckCircle /></div>
                    <h2>Booking Confirmed! 🎉</h2>
                    <p>Your session has been successfully booked.</p>
                    <div className="success-detail-row">
                        <span><FiCalendar /> {formattedDate}</span>
                        <span><FiClock /> {time}</span>
                    </div>
                    <div className="success-actions">
                        <Link to="/my-bookings" className="btn-solid">View My Bookings</Link>
                        <Link to="/" className="btn-ghost">Browse More</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
            </button>

            <ScrollReveal>
                <div className="booking-header">
                    <h1>Book Your <span className="gradient-text">Session</span></h1>
                    <p>Fill in your details to confirm your booking</p>
                </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <div className="session-preview">
                    {formattedDate && <div className="session-pill"><FiCalendar /> {formattedDate}</div>}
                    {time && <div className="session-pill"><FiClock /> {time}</div>}
                </div>
            </ScrollReveal>

            {serverError && <div className="error-banner">{serverError}</div>}

            <ScrollReveal delay={200}>
                <form className="premium-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-field">
                            <label>Full Name <span className="req">*</span></label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className={errors.name ? 'has-error' : ''}
                            />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>
                        <div className="form-field">
                            <label>Email <span className="req">*</span></label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className={errors.email ? 'has-error' : ''}
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>
                    </div>
                    <div className="form-field">
                        <label>Phone <span className="req">*</span></label>
                        <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className={errors.phone ? 'has-error' : ''}
                        />
                        {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>
                    <div className="form-field">
                        <label>Notes <span className="optional">(optional)</span></label>
                        <textarea
                            placeholder="What would you like to discuss?"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? (
                            <><div className="btn-spinner" /> Booking...</>
                        ) : (
                            <><FiSend /> Confirm Booking</>
                        )}
                    </button>
                </form>
            </ScrollReveal>
        </div>
    );
}

export default BookingForm;
