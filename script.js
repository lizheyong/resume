document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // --- THREE.JS BACKGROUND (Vision OS Style) ---
  let scene, camera, renderer, particles;

  // 确保THREE库已加载
  function ensureThreeLoaded(callback) {
    if (typeof THREE !== "undefined") {
      callback();
    } else {
      console.log("THREE.js not loaded yet, waiting...");
      setTimeout(() => ensureThreeLoaded(callback), 100);
    }
  }

  function initThree() {
    console.log("初始化Three.js背景...");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const canvasContainer = document.getElementById("three-canvas");
    if (!canvasContainer) {
      console.error("找不到canvas容器元素!");
      return;
    }

    // 清空可能存在的旧canvas
    while (canvasContainer.firstChild) {
      canvasContainer.removeChild(canvasContainer.firstChild);
    }

    canvasContainer.appendChild(renderer.domElement);
    console.log("Three.js渲染器已附加到DOM");

    // 创建粒子系统
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 200;
      colorArray[i] = Math.random() * 0.5 + 0.5; // 柔和的颜色
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colorArray, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.3, // 增大粒子尺寸
      vertexColors: true,
      transparent: true,
      opacity: 0.8, // 增加不透明度
      blending: THREE.AdditiveBlending,
    });

    particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);
    console.log("粒子系统已添加到场景");

    // 添加鼠标交互
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener("mousemove", (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 动画循环
    function animate() {
      requestAnimationFrame(animate);

      // 粒子旋转
      particles.rotation.x += 0.0002;
      particles.rotation.y += 0.0003;

      // 鼠标交互
      particles.rotation.x += mouseY * 0.0002;
      particles.rotation.y += mouseX * 0.0002;

      // 粒子大小呼吸效果
      const time = Date.now() * 0.001;
      particles.material.size = 0.3 + Math.sin(time) * 0.1;

      renderer.render(scene, camera);
    }

    animate();
    window.addEventListener("resize", onWindowResizeThree, false);
    console.log("Three.js背景初始化完成");
  }

  function onWindowResizeThree() {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // 确保THREE库加载后再初始化
  ensureThreeLoaded(() => {
    if (document.getElementById("three-canvas")) {
      initThree();
    } else {
      console.error("找不到three-canvas元素");
    }
  });

  // --- GSAP ANIMATIONS (Smooth & Professional) ---
  const defaultEase = "power2.out";

  // Hero
  gsap.from("#hero .name", {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power3.out",
    delay: 0.2,
  });

  gsap.from("#hero .tagline", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.4,
  });

  gsap.from("#hero .contact-info span", {
    opacity: 0,
    y: 15,
    duration: 0.6,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.6,
  });

  gsap.from(".scroll-down-indicator", {
    opacity: 0,
    scale: 0.7,
    duration: 1.2,
    ease: "elastic.out(1, 0.7)",
    delay: 1,
  });

  // 修复向下箭头滚动问题
  document
    .querySelector(".scroll-down-indicator")
    .addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = document.querySelector("#objective-skills");
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });

  // 修改滚动触发器配置，确保内容正确显示
  gsap.utils.toArray(".resume-section").forEach((section, i) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 90%", // 更改触发位置，使内容更早显示
        toggleActions: "play none none reset", // 更改动作，确保内容显示后不会消失
        once: false, // 确保每次滚动都会触发
      },
    });

    const title = section.querySelector(".section-title");
    if (title) {
      tl.from(title, {
        opacity: 0,
        x: -30,
        duration: 0.6, // 减少动画时间
        ease: "power2.out",
      });
    }

    // 更精确地选择内容元素
    const contentItems = section.querySelectorAll(
      ".content-wrapper > *, .timeline-item, .experience-item, .skills-grid > *"
    );
    if (contentItems.length > 0) {
      tl.from(
        contentItems,
        {
          opacity: 0,
          y: 20,
          duration: 0.4, // 减少动画时间
          stagger: 0.05, // 减少错开时间
          ease: "power2.out",
        },
        title ? "-=0.2" : "+=0"
      );
    }
  });

  // 确保所有元素初始时可见（防止GSAP动画失败时元素不可见）
  setTimeout(() => {
    document.querySelectorAll(".resume-section *").forEach((el) => {
      el.style.opacity = 1;
    });
  }, 2000);

  // Footer current year
  if (document.getElementById("currentYear")) {
    document.getElementById("currentYear").textContent =
      new Date().getFullYear();
  }
});
