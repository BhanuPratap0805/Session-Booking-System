import { useEffect, useRef } from 'react';

function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let mouse = { x: -1000, y: -1000 };

        const particles = [];
        const orbs = [];
        const PARTICLE_COUNT = 60;
        const ORB_COUNT = 4;
        const INTERACTION_RADIUS = 150;
        const PUSH_FORCE = 10;
        const CONNECTION_RANGE = 130;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createOrbs() {
            orbs.length = 0;
            const colors = [
                { r: 212, g: 167, b: 66 },
                { r: 240, g: 208, b: 120 },
                { r: 201, g: 162, b: 39 },
                { r: 255, g: 220, b: 140 },
            ];
            for (let i = 0; i < ORB_COUNT; i++) {
                orbs.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 200 + 120,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: (Math.random() - 0.5) * 0.15,
                    color: colors[i % colors.length],
                    opacity: Math.random() * 0.06 + 0.03,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }

        function createParticles() {
            particles.length = 0;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    baseX: 0,
                    baseY: 0,
                    size: Math.random() * 2.5 + 1,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
                    opacity: Math.random() * 0.5 + 0.15,
                    pulse: Math.random() * Math.PI * 2,
                });
                particles[i].baseX = particles[i].x;
                particles[i].baseY = particles[i].y;
            }
        }

        let time = 0;

        function animate() {
            time += 0.008;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw glowing orbs
            for (const orb of orbs) {
                orb.x += orb.vx;
                orb.y += orb.vy;
                orb.phase += 0.003;

                // Bounce softly
                if (orb.x < -orb.size) orb.x = canvas.width + orb.size;
                if (orb.x > canvas.width + orb.size) orb.x = -orb.size;
                if (orb.y < -orb.size) orb.y = canvas.height + orb.size;
                if (orb.y > canvas.height + orb.size) orb.y = -orb.size;

                // Mouse parallax on orbs
                const orbDx = mouse.x - orb.x;
                const orbDy = mouse.y - orb.y;
                const orbDist = Math.sqrt(orbDx * orbDx + orbDy * orbDy);
                const parallaxX = orbDist < 500 ? orbDx * 0.02 : 0;
                const parallaxY = orbDist < 500 ? orbDy * 0.02 : 0;

                const breathe = Math.sin(orb.phase) * 0.02;
                const currentOpacity = orb.opacity + breathe;

                const gradient = ctx.createRadialGradient(
                    orb.x + parallaxX, orb.y + parallaxY, 0,
                    orb.x + parallaxX, orb.y + parallaxY, orb.size
                );
                gradient.addColorStop(0, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${currentOpacity * 1.5})`);
                gradient.addColorStop(0.5, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${currentOpacity * 0.5})`);
                gradient.addColorStop(1, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, 0)`);

                ctx.beginPath();
                ctx.arc(orb.x + parallaxX, orb.y + parallaxY, orb.size, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.pulse += 0.015;

                p.baseX += p.vx;
                p.baseY += p.vy;

                if (p.baseX < -20) p.baseX = canvas.width + 20;
                if (p.baseX > canvas.width + 20) p.baseX = -20;
                if (p.baseY < -20) p.baseY = canvas.height + 20;
                if (p.baseY > canvas.height + 20) p.baseY = -20;

                const dx = mouse.x - p.baseX;
                const dy = mouse.y - p.baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < INTERACTION_RADIUS) {
                    const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
                    const angle = Math.atan2(dy, dx);
                    p.x = p.baseX - Math.cos(angle) * force * PUSH_FORCE * 5;
                    p.y = p.baseY - Math.sin(angle) * force * PUSH_FORCE * 5;
                } else {
                    p.x += (p.baseX - p.x) * 0.06;
                    p.y += (p.baseY - p.y) * 0.06;
                }

                const pulseFactor = Math.sin(p.pulse) * 0.3 + 1;

                // Glow effect
                const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                glowGrad.addColorStop(0, `rgba(212, 167, 66, ${p.opacity * pulseFactor * 0.4})`);
                glowGrad.addColorStop(1, `rgba(212, 167, 66, 0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = glowGrad;
                ctx.fill();

                // Core particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * pulseFactor, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 167, 66, ${p.opacity * pulseFactor})`;
                ctx.fill();

                // Constellation connections with pulse
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const cdx = p.x - p2.x;
                    const cdy = p.y - p2.y;
                    const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
                    if (cdist < CONNECTION_RANGE) {
                        const lineOpacity = 0.1 * (1 - cdist / CONNECTION_RANGE);
                        const pulseOp = lineOpacity * (Math.sin(time * 2 + i * 0.5) * 0.3 + 1);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(212, 167, 66, ${pulseOp})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        }

        function onMouseMove(e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }

        function onMouseLeave() {
            mouse.x = -1000;
            mouse.y = -1000;
        }

        resize();
        createOrbs();
        createParticles();
        animate();

        window.addEventListener('resize', () => {
            resize();
            createOrbs();
            createParticles();
        });
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
}

export default ParticleBackground;
