require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./models/Expert');

const experts = [
    {
        name: 'Dr. Sarah Chen',
        category: 'Technology',
        experience: 12,
        rating: 4.9,
        bio: 'Senior AI researcher with expertise in machine learning and deep learning. Former Google Brain team member.',
        avatar: '👩‍💻',
        specializations: ['Machine Learning', 'Deep Learning', 'Python'],
    },
    {
        name: 'James Rodriguez',
        category: 'Business',
        experience: 15,
        rating: 4.8,
        bio: 'Serial entrepreneur and business strategist. Has founded and scaled 3 startups to acquisition.',
        avatar: '👨‍💼',
        specializations: ['Startup Strategy', 'Fundraising', 'Growth'],
    },
    {
        name: 'Dr. Emily Watson',
        category: 'Health',
        experience: 10,
        rating: 4.7,
        bio: 'Board-certified nutritionist and wellness coach specializing in holistic health approaches.',
        avatar: '👩‍⚕️',
        specializations: ['Nutrition', 'Wellness', 'Mental Health'],
    },
    {
        name: 'Alex Kim',
        category: 'Design',
        experience: 8,
        rating: 4.9,
        bio: 'Award-winning UX designer. Previously led design at Spotify and Airbnb.',
        avatar: '🎨',
        specializations: ['UX/UI Design', 'Design Systems', 'Figma'],
    },
    {
        name: 'Prof. Michael Brown',
        category: 'Education',
        experience: 20,
        rating: 4.6,
        bio: 'Education technology pioneer. Developed curricula adopted by 50+ universities worldwide.',
        avatar: '👨‍🏫',
        specializations: ['EdTech', 'Curriculum Design', 'Online Learning'],
    },
    {
        name: 'Lisa Park',
        category: 'Technology',
        experience: 9,
        rating: 4.8,
        bio: 'Full-stack developer and cloud architect. AWS certified solutions architect.',
        avatar: '💻',
        specializations: ['Cloud Architecture', 'AWS', 'React'],
    },
    {
        name: 'David Martinez',
        category: 'Business',
        experience: 18,
        rating: 4.5,
        bio: 'Investment banker turned venture capitalist. Managing partner at TechVentures Capital.',
        avatar: '📊',
        specializations: ['Venture Capital', 'Financial Modeling', 'M&A'],
    },
    {
        name: 'Dr. Aisha Patel',
        category: 'Health',
        experience: 14,
        rating: 4.9,
        bio: 'Sports medicine specialist and performance coach for Olympic athletes.',
        avatar: '🏥',
        specializations: ['Sports Medicine', 'Performance', 'Rehabilitation'],
    },
    {
        name: 'Tom Anderson',
        category: 'Design',
        experience: 11,
        rating: 4.7,
        bio: 'Brand identity expert and creative director. Has worked with Fortune 500 companies.',
        avatar: '✏️',
        specializations: ['Brand Design', 'Visual Identity', 'Typography'],
    },
    {
        name: 'Prof. Rachel Green',
        category: 'Education',
        experience: 16,
        rating: 4.8,
        bio: 'Data science educator and author of bestselling data analytics textbooks.',
        avatar: '📚',
        specializations: ['Data Science', 'Statistics', 'R Programming'],
    },
    {
        name: 'Chris Yang',
        category: 'Technology',
        experience: 7,
        rating: 4.6,
        bio: 'Cybersecurity expert and ethical hacker. Lead security engineer at a major fintech company.',
        avatar: '🔐',
        specializations: ['Cybersecurity', 'Penetration Testing', 'DevSecOps'],
    },
    {
        name: 'Maria Gonzalez',
        category: 'Business',
        experience: 13,
        rating: 4.7,
        bio: 'Digital marketing strategist specializing in SaaS growth and content marketing.',
        avatar: '📈',
        specializations: ['Digital Marketing', 'SEO', 'Content Strategy'],
    },
    {
        name: 'Dr. Raj Krishnan',
        category: 'Technology',
        experience: 16,
        rating: 4.9,
        bio: 'Distributed systems architect and former principal engineer at Amazon. Expert in building planet-scale infrastructure.',
        avatar: '🌐',
        specializations: ['Distributed Systems', 'System Design', 'Go'],
    },
    {
        name: 'Sophie Laurent',
        category: 'Design',
        experience: 10,
        rating: 4.8,
        bio: 'Motion design specialist and creative technologist. Has crafted award-winning animations for Apple and Nike.',
        avatar: '🎬',
        specializations: ['Motion Design', 'After Effects', '3D Animation'],
    },
    {
        name: 'Dr. Marcus Thompson',
        category: 'Health',
        experience: 22,
        rating: 4.9,
        bio: 'Clinical psychologist specializing in cognitive behavioral therapy and workplace burnout prevention.',
        avatar: '🧠',
        specializations: ['CBT', 'Stress Management', 'Work-Life Balance'],
    },
    {
        name: 'Priya Sharma',
        category: 'Business',
        experience: 11,
        rating: 4.7,
        bio: 'Product management leader who scaled products from 0 to 10M users at two unicorn startups.',
        avatar: '🎯',
        specializations: ['Product Management', 'Agile', 'User Research'],
    },
    {
        name: 'Dr. Yuki Tanaka',
        category: 'Education',
        experience: 14,
        rating: 4.8,
        bio: 'Language acquisition researcher and polyglot educator. Developed immersive learning methods adopted globally.',
        avatar: '🌏',
        specializations: ['Language Learning', 'Immersive Education', 'Linguistics'],
    },
    {
        name: 'Nathan Brooks',
        category: 'Technology',
        experience: 6,
        rating: 4.6,
        bio: 'Mobile app developer and Flutter advocate. Published 15+ apps with millions of downloads on both platforms.',
        avatar: '📱',
        specializations: ['Flutter', 'iOS', 'Android'],
    },
    {
        name: 'Elena Vasquez',
        category: 'Business',
        experience: 19,
        rating: 4.9,
        bio: 'International trade consultant and supply chain optimization expert for Fortune 100 companies.',
        avatar: '🌍',
        specializations: ['Supply Chain', 'International Trade', 'Operations'],
    },
    {
        name: 'Dr. Hannah Fischer',
        category: 'Health',
        experience: 12,
        rating: 4.7,
        bio: 'Integrative medicine practitioner blending Eastern and Western approaches. Published researcher in holistic healing.',
        avatar: '🌿',
        specializations: ['Integrative Medicine', 'Ayurveda', 'Mindfulness'],
    },
    {
        name: 'Kai Nakamura',
        category: 'Design',
        experience: 7,
        rating: 4.8,
        bio: 'Game UI/UX designer who led interface design for three AAA game titles at major studios.',
        avatar: '🎮',
        specializations: ['Game UI', 'Interactive Design', 'Unity'],
    },
    {
        name: 'Prof. Samuel Okonkwo',
        category: 'Education',
        experience: 25,
        rating: 4.9,
        bio: 'STEM education visionary who pioneered hands-on robotics curricula adopted in 30+ countries.',
        avatar: '🤖',
        specializations: ['STEM Education', 'Robotics', 'Mentorship'],
    },
    {
        name: 'Diana Petrova',
        category: 'Technology',
        experience: 10,
        rating: 4.7,
        bio: 'Data engineering lead specializing in real-time analytics pipelines. Apache Spark and Kafka contributor.',
        avatar: '📊',
        specializations: ['Data Engineering', 'Apache Spark', 'Kafka'],
    },
    {
        name: 'Carlos Mendez',
        category: 'Business',
        experience: 14,
        rating: 4.6,
        bio: 'Franchise development specialist who has helped launch 200+ franchise locations across Latin America.',
        avatar: '🏪',
        specializations: ['Franchising', 'Business Development', 'Scaling'],
    },
    {
        name: 'Dr. Amara Osei',
        category: 'Health',
        experience: 9,
        rating: 4.8,
        bio: 'Dermatologist and skincare scientist. Developed clean beauty formulations for leading global brands.',
        avatar: '✨',
        specializations: ['Dermatology', 'Skincare Science', 'Clean Beauty'],
    },
    {
        name: 'Liam O\'Connor',
        category: 'Design',
        experience: 13,
        rating: 4.7,
        bio: 'Architectural visualization artist and industrial designer. Creates photorealistic renders for top firms.',
        avatar: '🏛️',
        specializations: ['3D Visualization', 'Industrial Design', 'Blender'],
    },
    {
        name: 'Prof. Mei-Lin Wu',
        category: 'Education',
        experience: 18,
        rating: 4.8,
        bio: 'Computer science professor and competitive programming coach. Mentored multiple ICPC world finalists.',
        avatar: '🏆',
        specializations: ['Competitive Programming', 'Algorithms', 'CS Education'],
    },
    {
        name: 'Zara Hussain',
        category: 'Technology',
        experience: 5,
        rating: 4.5,
        bio: 'Blockchain developer and Web3 strategist. Built DeFi protocols handling $500M+ in total value locked.',
        avatar: '⛓️',
        specializations: ['Blockchain', 'Solidity', 'DeFi'],
    },
    {
        name: 'Oliver Chang',
        category: 'Business',
        experience: 8,
        rating: 4.7,
        bio: 'E-commerce strategist who helped 50+ D2C brands scale past $1M ARR through data-driven growth.',
        avatar: '🛒',
        specializations: ['E-Commerce', 'D2C Growth', 'Analytics'],
    },
    {
        name: 'Dr. Ingrid Svensson',
        category: 'Health',
        experience: 17,
        rating: 4.9,
        bio: 'Sleep medicine specialist and circadian rhythm researcher. Consultant to Olympic training programs.',
        avatar: '😴',
        specializations: ['Sleep Medicine', 'Circadian Health', 'Performance'],
    },
    {
        name: 'Fatima Al-Rashidi',
        category: 'Design',
        experience: 9,
        rating: 4.8,
        bio: 'Accessibility design expert who ensures digital products are inclusive. W3C accessibility guidelines contributor.',
        avatar: '♿',
        specializations: ['Accessibility', 'Inclusive Design', 'WCAG'],
    },
    {
        name: 'Prof. David Nguyen',
        category: 'Education',
        experience: 12,
        rating: 4.6,
        bio: 'Finance professor and personal investing educator. His YouTube channel has 2M+ subscribers.',
        avatar: '💰',
        specializations: ['Personal Finance', 'Investing', 'Financial Literacy'],
    },
    {
        name: 'Ava Mitchell',
        category: 'Technology',
        experience: 8,
        rating: 4.7,
        bio: 'DevOps engineer and site reliability expert. Reduced downtime by 99.9% at a major SaaS platform.',
        avatar: '⚙️',
        specializations: ['DevOps', 'Kubernetes', 'CI/CD'],
    },
    {
        name: 'Roberto Silva',
        category: 'Business',
        experience: 20,
        rating: 4.8,
        bio: 'Executive leadership coach who has mentored 100+ C-suite leaders across Fortune 500 companies.',
        avatar: '👔',
        specializations: ['Executive Coaching', 'Leadership', 'Team Building'],
    },
    {
        name: 'Dr. Nadia Kovacs',
        category: 'Health',
        experience: 11,
        rating: 4.7,
        bio: 'Physiotherapist and biomechanics researcher. Pioneered movement assessment techniques for athletes.',
        avatar: '🦴',
        specializations: ['Physiotherapy', 'Biomechanics', 'Injury Prevention'],
    },
    {
        name: 'Jordan Lee',
        category: 'Design',
        experience: 6,
        rating: 4.6,
        bio: 'Product illustrator and visual storyteller. Has created iconic illustrations for Slack, Notion, and Stripe.',
        avatar: '🖌️',
        specializations: ['Illustration', 'Visual Storytelling', 'Procreate'],
    },
    {
        name: 'Prof. Ana Costa',
        category: 'Education',
        experience: 15,
        rating: 4.9,
        bio: 'Early childhood education expert and Montessori curriculum designer. Author of 5 bestselling parenting books.',
        avatar: '👶',
        specializations: ['Early Childhood', 'Montessori', 'Parenting'],
    },
];

function generateSlots() {
    const slots = [];
    const times = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '12:00 PM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM',
    ];

    // Generate slots for the next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

        // Randomly pick 6-10 time slots per day
        const numSlots = 6 + Math.floor(Math.random() * 5);
        const shuffledTimes = times.sort(() => Math.random() - 0.5).slice(0, numSlots);

        for (const time of shuffledTimes) {
            slots.push({
                date: dateStr,
                time,
                isBooked: Math.random() < 0.15, // 15% pre-booked
            });
        }
    }

    // Sort slots by date and time
    slots.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
    });

    return slots;
}

async function seed() {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/expert-booking'
        );
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Expert.deleteMany({});
        console.log('🗑  Cleared existing experts');

        // Insert experts with generated slots
        const expertsWithSlots = experts.map((expert) => ({
            ...expert,
            availableSlots: generateSlots(),
        }));

        await Expert.insertMany(expertsWithSlots);
        console.log(`✅ Seeded ${expertsWithSlots.length} experts with time slots`);

        await mongoose.disconnect();
        console.log('👋 Done! Database seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
