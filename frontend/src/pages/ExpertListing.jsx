import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiStar, FiBriefcase, FiChevronLeft, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { getExperts, getCategories } from '../api';
import ScrollReveal from '../components/ScrollReveal';

const EMOJI_MAP = {
    Technology: '💻',
    Business: '📊',
    Health: '🧬',
    Design: '🎨',
    Education: '📚',
};

function ExpertListing() {
    const [experts, setExperts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        getCategories().then((res) => setCategories(res.data)).catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            getExperts({ page, limit: 6, search, category })
                .then((res) => {
                    setExperts(res.data.experts);
                    setTotalPages(res.data.totalPages);
                })
                .catch(() => setError('Something went wrong'))
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [page, search, category]);

    useEffect(() => { setPage(1); }, [search, category]);

    return (
        <div className="listing-page">
            {/* ── Cinematic Hero ── */}
            <section className="hero">
                <div className="hero-badge">✨ Discover World-Class Experts</div>
                <h1 className="hero-title">
                    Your Next <span className="gradient-text">Breakthrough</span>
                    <br />Starts Here
                </h1>
                <p className="hero-subtitle">
                    Book 1-on-1 sessions with industry leaders. Get personalized guidance that transforms your career.
                </p>

                <div className="hero-search">
                    <div className="search-input-wrapper">
                        <FiSearch />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search experts by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="hero-stats-row">
                    <div className="hero-stat-item">
                        <div className="hero-stat-number">500+</div>
                        <div className="hero-stat-label">Sessions Booked</div>
                    </div>
                    <div className="hero-stat-item">
                        <div className="hero-stat-number">50+</div>
                        <div className="hero-stat-label">Expert Mentors</div>
                    </div>
                    <div className="hero-stat-item">
                        <div className="hero-stat-number">4.9★</div>
                        <div className="hero-stat-label">Average Rating</div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <span>Scroll to explore</span>
                    <FiChevronDown className="scroll-chevron" />
                </div>
            </section>

            {/* ── How It Works ── */}
            <ScrollReveal>
                <section className="how-section">
                    <h2 className="how-section-title">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="how-section-sub">Three simple steps to transform your career</p>
                    <div className="how-steps">
                        <ScrollReveal delay={0}>
                            <div className="how-step">
                                <div className="how-step-number">1</div>
                                <div className="how-step-icon">🔍</div>
                                <h3>Browse Experts</h3>
                                <p>Explore our curated network of industry leaders across multiple domains</p>
                            </div>
                        </ScrollReveal>
                        <div className="how-connector" />
                        <ScrollReveal delay={150}>
                            <div className="how-step">
                                <div className="how-step-number">2</div>
                                <div className="how-step-icon">📅</div>
                                <h3>Book a Session</h3>
                                <p>Pick a time slot that works for you and confirm your booking instantly</p>
                            </div>
                        </ScrollReveal>
                        <div className="how-connector" />
                        <ScrollReveal delay={300}>
                            <div className="how-step">
                                <div className="how-step-number">3</div>
                                <div className="how-step-icon">🚀</div>
                                <h3>Transform</h3>
                                <p>Get personalized 1-on-1 guidance and accelerate your growth</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            </ScrollReveal>

            {/* ── Category Pills ── */}
            <ScrollReveal>
                <div className="category-pills">
                    <button
                        className={`pill ${category === '' ? 'active' : ''}`}
                        onClick={() => setCategory('')}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`pill ${category === cat ? 'active' : ''}`}
                            onClick={() => setCategory(cat)}
                        >
                            <span className="pill-emoji">{EMOJI_MAP[cat] || '📌'}</span>
                            {cat}
                        </button>
                    ))}
                </div>
            </ScrollReveal>

            {/* ── Content ── */}
            {loading ? (
                <div className="card-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="expert-card skeleton-card-v2">
                            <div className="skeleton-avatar-v2" />
                            <div className="skeleton-line-v2 w80" />
                            <div className="skeleton-line-v2 w50" />
                            <div className="skeleton-line-v2 w60" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="state-message">
                    <span className="state-icon">⚠️</span>
                    <h3>Something went wrong</h3>
                    <p>We couldn't load the experts. Please try again.</p>
                    <button className="btn-solid" onClick={() => window.location.reload()}>Retry</button>
                </div>
            ) : experts.length === 0 ? (
                <div className="state-message">
                    <span className="state-icon">🔍</span>
                    <h3>No experts found</h3>
                    <p>Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            ) : (
                <>
                    <div className="card-grid">
                        {experts.map((expert, idx) => (
                            <ScrollReveal key={expert._id} delay={idx * 80}>
                                <div
                                    className="expert-card"
                                    onClick={() => navigate(`/expert/${expert._id}`)}
                                >
                                    <div className="card-accent" />
                                    <div className="card-top">
                                        <div className="expert-avatar">
                                            {EMOJI_MAP[expert.category] || '👤'}
                                        </div>
                                        <div className="card-badge">{expert.category}</div>
                                    </div>
                                    <h3 className="card-name">{expert.name}</h3>
                                    <div className="card-stats">
                                        <span><FiStar className="stat-icon star" /> {expert.rating}</span>
                                        <span><FiBriefcase className="stat-icon" /> {expert.experience}y exp</span>
                                    </div>
                                    <div className="card-slots">
                                        {expert.availableSlotsCount ?? 0} slots available
                                    </div>
                                    <div className="card-cta">
                                        <span>View Profile</span>
                                        <FiArrowRight />
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <FiChevronLeft />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="page-btn"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ExpertListing;
