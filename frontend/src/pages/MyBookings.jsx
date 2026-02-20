import { useState } from 'react';
import { FiMail, FiSearch, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { getBookingsByEmail } from '../api';
import ScrollReveal from '../components/ScrollReveal';

function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    getBookingsByEmail(email)
      .then((res) => setBookings(res.data))
      .catch(() => setError('Could not fetch bookings'))
      .finally(() => setLoading(false));
  };

  const getStatusStyle = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'confirmed') return { background: 'var(--green-light)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.2)' };
    if (s === 'completed') return { background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' };
    // pending
    return { background: 'var(--amber-light)', color: 'var(--amber)', border: '1px solid rgba(212,167,66,0.2)' };
  };

  return (
    <div className="bookings-page">
      <section className="hero compact">
        <div className="hero-badge">📋 Your Sessions</div>
        <h1 className="hero-title">
          My <span className="gradient-text">Bookings</span>
        </h1>
        <p className="hero-subtitle">
          Track all your expert sessions in one place
        </p>
      </section>

      <ScrollReveal>
        <form className="email-search" onSubmit={handleSearch}>
          <div className="email-input-wrap">
            <FiMail className="email-icon" />
            <input
              type="email"
              placeholder="Enter your email to find bookings..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-solid" disabled={loading}>
            <FiSearch /> {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </ScrollReveal>

      {error && (
        <div className="state-message">
          <span className="state-icon">⚠️</span>
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      )}

      {bookings && bookings.length === 0 && (
        <ScrollReveal>
          <div className="state-message">
            <span className="state-icon">📭</span>
            <h3>No bookings found</h3>
            <p>No sessions found for this email. Book your first session!</p>
          </div>
        </ScrollReveal>
      )}

      {bookings && bookings.length > 0 && (
        <div className="bookings-grid">
          {bookings.map((booking, idx) => (
            <ScrollReveal key={booking._id} delay={idx * 100}>
              <div className="booking-card-v2">
                <div className="booking-card-top">
                  <h3>{booking.expertName || 'Expert'}</h3>
                  <span
                    className="status-chip"
                    style={getStatusStyle(booking.status)}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="booking-card-details">
                  <span>
                    <FiCalendar />{' '}
                    {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </span>
                  <span>
                    <FiClock /> {booking.timeSlot}
                  </span>
                  <span>
                    <FiUser /> {booking.userName}
                  </span>
                </div>
                {booking.notes && (
                  <div className="booking-card-notes">"{booking.notes}"</div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {!bookings && !error && (
        <ScrollReveal>
          <div className="state-message">
            <span className="state-icon">🔍</span>
            <h3>Find your sessions</h3>
            <p>Enter the email you used when booking to see your sessions</p>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}

export default MyBookings;
