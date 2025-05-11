document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- THREE.JS BACKGROUND (Vision OS Style) ---
    let scene, camera, renderer, particles;
    function initThree() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;

        renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        document.getElementById('three-canvas').appendChild(renderer.domElement);

        // 创建粒子系统
        const particleCount = 2000;
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 200;
            colorArray[i] = Math.random() * 0.5 + 0.5; // 柔和的颜色
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particles);

        // 添加鼠标交互
        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // 动画循环
        function animate() {
            requestAnimationFrame(animate);

            // 粒子旋转
            particles.rotation.x += 0.0001;
            particles.rotation.y += 0.0002;

            // 鼠标交互
            particles.rotation.x += mouseY * 0.0001;
            particles.rotation.y += mouseX * 0.0001;

            // 粒子大小呼吸效果
            const time = Date.now() * 0.001;
            particles.material.size = 0.1 + Math.sin(time) * 0.05;

            renderer.render(scene, camera);
        }

        animate();
        window.addEventListener('resize', onWindowResizeThree, false);
    }

    function onWindowResizeThree() {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    if (document.getElementById('three-canvas')) initThree();

    // --- GSAP ANIMATIONS (Smooth & Professional) ---
    const defaultEase = "power2.out";

    // Hero
    gsap.from("#hero .name", { 
        opacity: 0, 
        y: 30, 
        duration: 1, 
        ease: "power3.out", 
        delay: 0.2 
    });
    
    gsap.from("#hero .tagline", { 
        opacity: 0, 
        y: 20, 
        duration: 0.8, 
        ease: "power3.out", 
        delay: 0.4 
    });
    
    gsap.from("#hero .contact-info span", { 
        opacity: 0, 
        y: 15, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power3.out", 
        delay: 0.6 
    });
    
    gsap.from(".scroll-down-indicator", { 
        opacity: 0, 
        scale: 0.7, 
        duration: 1.2, 
        ease: "elastic.out(1, 0.7)", 
        delay: 1 
    });

    // Sections & Titles
    gsap.utils.toArray('.resume-section').forEach((section, i) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none",
            }
        });

        const title = section.querySelector('.section-title');
        if (title) {
            tl.from(title, { 
                opacity: 0, 
                x: -30, 
                duration: 0.8, 
                ease: "power3.out" 
            });
        }
        
        const contentItems = section.querySelectorAll('.content-wrapper > *, .timeline-item, .experience-item, .skills-grid > .skill-tag');
        if (contentItems.length > 0) {
            tl.from(contentItems, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out"
            }, title ? "-=0.3" : "+=0");
        }
    });

    // Footer current year
    if (document.getElementById('currentYear')) {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }
});