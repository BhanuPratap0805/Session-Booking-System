import { useEffect, useRef, useState } from 'react';

function ScrollReveal({ children, direction = 'up', delay = 0, className = '', threshold = 0.15 }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    const dirClass = `sr-${direction}`;

    return (
        <div
            ref={ref}
            className={`scroll-reveal ${dirClass} ${isVisible ? 'sr-visible' : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export default ScrollReveal;
