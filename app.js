// Parallax Effect
const parallax_el = document.querySelectorAll(".parallax");
const main = document.querySelector("main");

// Calculate the intensity of the parallax effect based on screen width
const getParallaxIntensity = () => {
    const screenWidth = window.innerWidth;
    return screenWidth < 725 ? 1.2 : 1;
};

// Handle both mousemove and touchmove events
const handleParallax = (x, y) => {
    xValue = (x - window.innerWidth / 2) * getParallaxIntensity();
    yValue = (y - window.innerHeight / 2) * getParallaxIntensity();

    parallax_el.forEach((el) => {
        let speedx = el.dataset.speedx;
        let speedy = el.dataset.speedy;

        el.style.transform = `translateX(calc( 0% + ${-xValue * speedx}px)) translateY(calc(0% + ${yValue * speedy}px))`;
    });
};

// Mousemove event for desktop
window.addEventListener("mousemove", (e) => {
    handleParallax(e.clientX, e.clientY);
});

// Touchmove event for mobile
window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    handleParallax(touch.clientX, touch.clientY);
});

if(window.innerWidth >= 725) {
    main.style.maxHeight = `${window.innerWidth * 0.6}px`;
} else {
    main.style.maxHeight = `${window.innerWidth * 1.6}px`;
}

// GSAP Animations
let timeline = gsap.timeline();

timeline.from(".text h2", {
    y: -150,
    opacity: 0,
    duration: 1,
}, "0.3")
.from(".hide", {
    opacity: 0,
    duration: 1.5,
}, "0.6");

// Intersection Observer for Animated Elements
const animatedElements = document.querySelectorAll("[data-animated='false']");

const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            target.setAttribute("data-animated", "true");

            gsap.fromTo(
                target,
                { y: "100%", opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
            );

            observer.unobserve(target);
        }
    });
}, observerOptions);

animatedElements.forEach((element) => {
    observer.observe(element);
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const listingsContainer = document.getElementById('listings-container');

if (searchButton) {
    searchButton.addEventListener('click', () => {
        // Search functionality moved to products.js
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        // Search functionality moved to products.js
    });
}

// Category Filtering
const categoryCards = document.querySelectorAll('.category-card');
if (categoryCards.length > 0) {
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Category filtering moved to products.js
        });
    });
}