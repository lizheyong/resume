document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- THREE.JS BACKGROUND (Subtle) ---
    let scene, camera, renderer, particles;
    function initThree() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 70; // Further out for smaller feel

        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        document.getElementById('three-canvas').appendChild(renderer.domElement);

        const particleCount = 2500; // Fewer particles
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 250;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05, // Smaller
            color: 0x3A3A3C, // Match border color for subtlety
            transparent: true,
            opacity: 0.25, // More transparent
            blending: THREE.AdditiveBlending
        });
        particles = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particles);
        window.addEventListener('resize', onWindowResizeThree, false);
        animateThree();
    }
    function onWindowResizeThree() { /* ... same as before ... */ }
    function animateThree() { /* ... same as before, maybe slower rotation ... */ 
        requestAnimationFrame(animateThree);
        particles.rotation.x += 0.00005; // Slower
        particles.rotation.y += 0.0001;  // Slower
        if (camera) { /* ... mouse interaction ... */ }
        renderer.render(scene, camera);
    }
    if (document.getElementById('three-canvas')) initThree();

    // --- GSAP ANIMATIONS (Smooth & Professional) ---
    const defaultEase = "power2.out";

    // Hero
    gsap.from("#hero .name", { opacity: 0, y: 30, duration: 0.8, ease: defaultEase, delay: 0.2 });
    gsap.from("#hero .tagline", { opacity: 0, y: 20, duration: 0.7, ease: defaultEase, delay: 0.4 });
    gsap.from("#hero .contact-info span", { opacity: 0, y: 15, duration: 0.5, stagger: 0.1, ease: defaultEase, delay: 0.6 });
    gsap.from(".scroll-down-indicator", { opacity: 0, scale: 0.7, duration: 1, ease: "elastic.out(1, 0.7)", delay: 1 });

    // Sections & Titles
    gsap.utils.toArray('.resume-section').forEach((section, i) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none", // Play once
            }
        });

        const title = section.querySelector('.section-title');
        if (title) {
            tl.from(title, { opacity: 0, x: -30, duration: 0.7, ease: defaultEase });
            tl.from(title.querySelectorAll('::after'), { width: 0, duration: 0.6, ease: defaultEase }, "-=0.4"); // Animate pseudo-element (CSS var method preferred if possible)
        }
        
        const contentItems = section.querySelectorAll('.content-wrapper > *, .timeline-item, .experience-item, .skills-grid > .skill-tag');
        if (contentItems.length > 0) {
            tl.from(contentItems, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.1, // Subtle stagger
                ease: defaultEase
            }, title ? "-=0.3" : "+=0"); // Adjust delay based on title presence
        }
    });
    
    // Card hover (GSAP can add more finesse than CSS alone if desired)
    // gsap.utils.toArray(".experience-list .card").forEach(card => {
    //     card.addEventListener("mouseenter", () => gsap.to(card, { y: -5, boxShadow: "var(--shadow-lg)", duration: 0.2, ease: "power1.out" }));
    //     card.addEventListener("mouseleave", () => gsap.to(card, { y: 0, boxShadow: "var(--shadow-sm)", duration: 0.2, ease: "power1.out" }));
    // });

    // Footer current year
    if (document.getElementById('currentYear')) {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }
});
// Helper for Three.js resize
function onWindowResizeThree() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}