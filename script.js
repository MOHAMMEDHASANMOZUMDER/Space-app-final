// Waste2Watt Website JavaScript - Interactive Functionality

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initializeAnimations();
    initializeSmoothScroll();
    initializeNavigation();
    initializeCounters();
    initializeVisualEffects();
    
    // Add loading animation to sections
    observeSections();
});

// Smooth scrolling functionality
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navigation scroll effects
function initializeNavigation() {
    const hero = document.querySelector('.hero-section');
    const nav = document.querySelector('.navbar');
    
    if (nav) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroHeight = hero ? hero.offsetHeight : 0;
            
            if (scrolled > heroHeight * 0.3) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
}

// Initialize animations
function initializeAnimations() {
    // Title animation
    const titleElements = document.querySelectorAll('.hero-title');
    titleElements.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            title.style.transition = 'all 1s ease-out';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 500);
    });
    
    // Subtitle animation
    const subtitleElements = document.querySelectorAll('.hero-subtitle, .hero-tagline');
    subtitleElements.forEach((subtitle, index) => {
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            subtitle.style.transition = 'all 0.8s ease-out';
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 800 + (index * 200));
    });
    
    // CTA buttons animation
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            btn.style.transition = 'all 0.6s ease-out';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 1200 + (index * 150));
    });
}

// Section observation for scroll animations
function observeSections() {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                animateSectionContent(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Animate section content
function animateSectionContent(section) {
    const cards = section.querySelectorAll('.dashboard-card, .team-member, .subsystem, .animation-item, .flowchart-item');
    const titles = section.querySelectorAll('.section-title');
    
    // Animate section titles
    titles.forEach((title, index) => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            title.style.transition = 'all 0.8s ease-out';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate cards with stagger effect
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, (index * 100) + 300);
    });
}

// Counter animations for statistics
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, 16);
}

// Visual effects and interactions
function initializeVisualEffects() {
    // Dashboard card hover effects
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Team member card interactions
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(10deg) scale(1.1)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        member.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });
    
    // Subsystem hover effects
    const subsystems = document.querySelectorAll('.subsystem');
    subsystems.forEach(subsystem => {
        subsystem.addEventListener('mouseenter', function() {
            const visual = this.querySelector('.cad-render');
            if (visual) {
                visual.style.transform = 'scale(1.05)';
                visual.style.transition = 'all 0.3s ease';
            }
        });
        
        subsystem.addEventListener('mouseleave', function() {
            const visual = this.querySelector('.cad-render');
            if (visual) {
                visual.style.transform = 'scale(1)';
            }
        });
    });
}

// Particle system for background effects
function createParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-system';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 1;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 107, 53, ${Math.random() * 0.5 + 0.1});
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        animation: float ${duration}s infinite linear;
    `;
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(container);
        }
    }, duration * 1000);
}

// Add floating animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding: 1rem 2rem;
        background: rgba(10, 15, 26, 0.9);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 1000;
        transition: all 0.3s ease;
        transform: translateY(-100%);
        opacity: 0;
    }
    
    .navbar.scrolled {
        transform: translateY(0);
        opacity: 1;
    }
    
    .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .nav-logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: #ffffff;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .nav-links {
        display: flex;
        gap: 2rem;
        list-style: none;
    }
    
    .nav-links a {
        color: #ffffff;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        padding: 0.5rem 1rem;
        border-radius: 20px;
    }
    
    .nav-links a:hover {
        background: rgba(255, 107, 53, 0.2);
        color: #ff6b35;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
        
        .navbar {
            padding: 0.5rem 1rem;
        }
    }
`;
document.head.appendChild(style);

// Create navigation
function createNavigation() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class="nav-container">
            <a href="#hero" class="nav-logo">
                <i class="fas fa-rocket"></i>
                Waste2Watt
            </a>
            <ul class="nav-links">
                <li><a href="#system-overview">System</a></li>
                <li><a href="#dashboards">Dashboards</a></li>
                <li><a href="#engineering">Engineering</a></li>
                <li><a href="#team">Team</a></li>
                <li><a href="./src/App.jsx" class="dashboard-link">
                    <i class="fas fa-external-link-alt"></i>
                    Launch App
                </a></li>
            </ul>
        </div>
    `;
    
    document.body.insertBefore(nav, document.body.firstChild);
}

// Interactive code examples
function initializeCodeExamples() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        // Add copy button
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.className = 'copy-btn';
        copyBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 107, 53, 0.8);
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;
        
        block.style.position = 'relative';
        block.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', function() {
            const codeText = block.textContent.replace('Copy', '').trim();
            navigator.clipboard.writeText(codeText).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.style.background = '#00ff88';
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.style.background = 'rgba(255, 107, 53, 0.8)';
                }, 2000);
            });
        });
        
        copyBtn.addEventListener('mouseenter', function() {
            this.style.background = '#ff6b35';
            this.style.transform = 'scale(1.1)';
        });
        
        copyBtn.addEventListener('mouseleave', function() {
            if (this.innerHTML.includes('copy')) {
                this.style.background = 'rgba(255, 107, 53, 0.8)';
            }
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize video controls
function initializeVideoControls() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Add play/pause on click
        video.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });
        
        // Add loading indicator
        video.addEventListener('loadstart', function() {
            const loader = document.createElement('div');
            loader.className = 'video-loader';
            loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            loader.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #ff6b35;
                font-size: 2rem;
                z-index: 10;
            `;
            
            this.parentNode.appendChild(loader);
        });
        
        video.addEventListener('canplay', function() {
            const loader = this.parentNode.querySelector('.video-loader');
            if (loader) {
                loader.remove();
            }
        });
    });
}

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ff6b35, #ffd700);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    createNavigation();
    createParticleSystem();
    createScrollProgress();
    initializeCodeExamples();
    initializeVideoControls();
    
    // Add smooth fade-in for the entire page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandlers = [];
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            originalScrollHandlers.forEach(handler => handler());
        }, 16); // ~60fps
    });
    
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

console.log('🚀 Waste2Watt website loaded successfully!');
console.log('🔴 Mars mission ready for deployment!');
console.log('♻️ Waste to energy conversion systems online!');