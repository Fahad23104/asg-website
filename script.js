// REPLACE WITH YOUR GOOGLE APPS SCRIPT URL
const DEPLOYMENT_API_ENDPOINT = "https://script.google.com/macros/s/AKfycbyYREfoWZhsrcJWhFD2w4NAyegG7QMk1dKxgWK3UZxZl3TKawRRIKKW0d5bpkOXTKPP/exec";

// Mobile Menu Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileCloseBtn = document.getElementById('mobile-close-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('translate-x-full');
}

if (mobileMenuBtn && mobileCloseBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileCloseBtn.addEventListener('click', toggleMobileMenu);
    
    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
}

// Dynamic Navbar Background on Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-asg-dark/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-800');
        navbar.classList.remove('bg-asg-dark/0', 'py-4');
        navbar.classList.add('py-2');
    } else {
        navbar.classList.remove('bg-asg-dark/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-800', 'py-2');
        navbar.classList.add('bg-asg-dark/0', 'py-4');
    }
});

// Tab Swapping Logic
function switchTab(target) {
    const btnClient = document.getElementById('tab-client');
    const btnGuard = document.getElementById('tab-guard');
    const formClient = document.getElementById('form-client');
    const formGuard = document.getElementById('form-guard');

    const activeBtnClass = "flex-1 py-3 md:py-4 text-[11px] md:text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-asg-accent text-asg-dark shadow-md rounded-sm";
    const inactiveBtnClass = "flex-1 py-3 md:py-4 text-[11px] md:text-sm font-bold uppercase tracking-widest transition-all duration-300 text-slate-400 hover:text-white rounded-sm";

    if (target === 'client') {
        btnClient.className = activeBtnClass;
        btnGuard.className = inactiveBtnClass;
        formClient.classList.remove('hidden');
        formGuard.classList.add('hidden');
    } else {
        btnGuard.className = activeBtnClass;
        btnClient.className = inactiveBtnClass;
        formGuard.classList.remove('hidden');
        formClient.classList.add('hidden');
    }
}

// Staggered Scroll Animations (IntersectionObserver)
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
});

// Form Processing & UI Overlay
const forms = [document.getElementById('form-client'), document.getElementById('form-guard')];
const overlay = document.getElementById('form-overlay');
const spinner = document.getElementById('overlay-spinner');
const successIcon = document.getElementById('overlay-icon');
const msg = document.getElementById('overlay-message');

forms.forEach(form => {
    if(!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Activate UI Block
        overlay.classList.remove('pointer-events-none');
        overlay.classList.add('opacity-100');
        spinner.classList.remove('hidden');
        successIcon.classList.add('hidden');
        msg.textContent = "Authenticating & Transmitting...";
        msg.classList.remove('text-red-400');
        msg.classList.add('text-white');

        const formData = new FormData(form);
        const searchParams = new URLSearchParams();
        
        for (const pair of formData.entries()) {
            searchParams.append(pair[0], pair[1]);
        }

        try {
            // Send to Google Sheets Apps Script
            const response = await fetch(DEPLOYMENT_API_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: searchParams.toString()
            });

            // Success UI state
            spinner.classList.add('hidden');
            successIcon.classList.remove('hidden');
            msg.textContent = "Data Secured. Protocol Initiated.";
            form.reset();

            setTimeout(() => {
                overlay.classList.add('pointer-events-none');
                overlay.classList.remove('opacity-100');
            }, 3000);

        } catch (error) {
            console.error('Submission Error:', error);
            spinner.classList.add('hidden');
            msg.textContent = "Transmission Failed. Check Connection.";
            msg.classList.remove('text-white');
            msg.classList.add('text-red-400');
            
            setTimeout(() => {
                overlay.classList.add('pointer-events-none');
                overlay.classList.remove('opacity-100');
            }, 3500);
        }
    });
});