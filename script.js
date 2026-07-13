/* ============================================
   DevOps Roadmap 2026 — JavaScript
   ============================================ */

// ==========================================
// Navbar scroll effect
// ==========================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================
// Mobile nav toggle
// ==========================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Close nav when link clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// ==========================================
// Active nav link on scroll
// ==========================================
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ==========================================
// Module accordion toggle
// ==========================================
function toggleModule(headerEl) {
    const moduleEl = headerEl.closest('.roadmap-module');
    const wasOpen = moduleEl.classList.contains('open');

    // Close all modules
    document.querySelectorAll('.roadmap-module.open').forEach(m => {
        m.classList.remove('open');
    });

    // Toggle current
    if (!wasOpen) {
        moduleEl.classList.add('open');
        // Smooth scroll to module
        setTimeout(() => {
            moduleEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// ==========================================
// Filter tabs
// ==========================================
const filterTabs = document.querySelectorAll('.filter-tab');
const modules = document.querySelectorAll('.roadmap-module');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        modules.forEach(mod => {
            if (filter === 'all' || mod.getAttribute('data-level') === filter) {
                mod.classList.remove('hidden');
                // Re-trigger visibility animation
                mod.style.opacity = '0';
                mod.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    mod.style.opacity = '1';
                    mod.style.transform = 'translateY(0)';
                }, 50);
            } else {
                mod.classList.add('hidden');
                mod.classList.remove('open');
            }
        });
    });
});

// ==========================================
// Scroll reveal animation
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.overview-card, .roadmap-module, .schedule-phase, .stat-card').forEach(el => {
    observer.observe(el);
});

// ==========================================
// Hero counter animation
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.hero-stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, stepTime);
    });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.getElementById('hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ==========================================
// Smooth scroll for all anchor links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// Keyboard accessibility for modules
// ==========================================
document.querySelectorAll('.module-header').forEach(header => {
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');

    header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleModule(header);
            const isOpen = header.closest('.roadmap-module').classList.contains('open');
            header.setAttribute('aria-expanded', isOpen.toString());
        }
    });
});

// ==========================================
// Modules nav dropdown
// ==========================================
const modulesDropdown = document.getElementById('modulesDropdown');
const modulesBtn = document.getElementById('modulesBtn');

if (modulesDropdown && modulesBtn) {
    modulesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modulesDropdown.classList.toggle('open');
        modulesBtn.setAttribute('aria-expanded', modulesDropdown.classList.contains('open').toString());
    });

    document.addEventListener('click', (e) => {
        if (!modulesDropdown.contains(e.target)) {
            modulesDropdown.classList.remove('open');
            modulesBtn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modulesDropdown.classList.remove('open');
            modulesBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Dropdown links to in-page modules: expand the module card and scroll to it
    modulesDropdown.querySelectorAll('.dropdown-item[href^="#module-"]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(item.getAttribute('href'));
            modulesDropdown.classList.remove('open');
            modulesBtn.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('open');
            if (target) {
                document.querySelectorAll('.roadmap-module.open').forEach(m => m.classList.remove('open'));
                target.classList.remove('hidden');
                target.classList.add('open', 'visible');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ==========================================
// Animated network background (constellation + data packets)
// ==========================================
(function () {
    const canvas = document.getElementById('bgNetwork');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const LINK_DIST = 150;
    const COLORS = ['79, 139, 255', '0, 212, 255', '168, 85, 247'];

    let W, H, nodes = [], packets = [], raf = null;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * DPR;
        canvas.height = H * DPR;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        const target = Math.min(90, Math.floor((W * H) / 22000));
        while (nodes.length < target) nodes.push(makeNode());
        nodes.length = target;
    }

    function makeNode() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: 1 + Math.random() * 1.8,
            c: COLORS[Math.floor(Math.random() * COLORS.length)],
            pulse: Math.random() * Math.PI * 2
        };
    }

    const mouse = { x: -9999, y: -9999 };
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; });

    function spawnPacket() {
        // pick a random pair of currently-linked nodes and send a glowing dot along the line
        for (let tries = 0; tries < 12; tries++) {
            const a = nodes[Math.floor(Math.random() * nodes.length)];
            const b = nodes[Math.floor(Math.random() * nodes.length)];
            if (!a || !b || a === b) continue;
            const dx = b.x - a.x, dy = b.y - a.y;
            if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) {
                packets.push({ a, b, t: 0, speed: 0.008 + Math.random() * 0.012, c: a.c });
                return;
            }
        }
    }

    function frame() {
        ctx.clearRect(0, 0, W, H);

        // move nodes
        for (const n of nodes) {
            n.x += n.vx; n.y += n.vy;
            n.pulse += 0.02;
            // gentle repulsion from cursor
            const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
            const md2 = mdx * mdx + mdy * mdy;
            if (md2 < 14400) { // 120px
                const md = Math.sqrt(md2) || 1;
                n.x += (mdx / md) * 0.6;
                n.y += (mdy / md) * 0.6;
            }
            if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
            if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
        }

        // links
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < LINK_DIST * LINK_DIST) {
                    const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.22;
                    ctx.strokeStyle = `rgba(${a.c}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // nodes (soft pulsing dots)
        for (const n of nodes) {
            const r = n.r + Math.sin(n.pulse) * 0.4;
            ctx.fillStyle = `rgba(${n.c}, 0.75)`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, Math.max(r, 0.4), 0, Math.PI * 2);
            ctx.fill();
        }

        // data packets traveling along links
        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.t += p.speed;
            if (p.t >= 1) { packets.splice(i, 1); continue; }
            const x = p.a.x + (p.b.x - p.a.x) * p.t;
            const y = p.a.y + (p.b.y - p.a.y) * p.t;
            const glow = ctx.createRadialGradient(x, y, 0, x, y, 7);
            glow.addColorStop(0, `rgba(${p.c}, 0.9)`);
            glow.addColorStop(1, `rgba(${p.c}, 0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, 7, 0, Math.PI * 2);
            ctx.fill();
        }
        if (Math.random() < 0.03 && packets.length < 6) spawnPacket();

        raf = requestAnimationFrame(frame);
    }

    // pause when the tab is hidden — free performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf) raf = requestAnimationFrame(frame);
    });

    window.addEventListener('resize', resize, { passive: true });
    resize();
    raf = requestAnimationFrame(frame);
})();
