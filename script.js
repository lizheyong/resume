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

  // 添加技能标签悬浮效果的手动处理，解决移动设备上的问题
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // 完全移除CSS过渡效果，改为完全使用JS控制
  function applyHoverStyles() {
    if (isTouchDevice) return; // 触摸设备不应用效果

    // 重置所有技能标签的样式为默认状态
    document.querySelectorAll(".skill-tag").forEach((tag) => {
      // 储存原始样式
      if (!tag.dataset.originalBg) {
        tag.dataset.originalBg = window.getComputedStyle(tag).backgroundColor;
        tag.dataset.originalColor = window.getComputedStyle(tag).color;
        tag.dataset.originalShadow = window.getComputedStyle(tag).boxShadow;
      }

      // 确保默认状态
      tag.style.transform = "";
      tag.style.boxShadow = tag.dataset.originalShadow || "";
      tag.style.backgroundColor = tag.dataset.originalBg || "";
      tag.style.color = tag.dataset.originalColor || "";

      // 移除旧事件监听器（如果有）
      tag.removeEventListener("mouseenter", handleMouseEnter);
      tag.removeEventListener("mouseleave", handleMouseLeave);

      // 添加新事件监听器
      tag.addEventListener("mouseenter", handleMouseEnter);
      tag.addEventListener("mouseleave", handleMouseLeave);
    });
  }

  function handleMouseEnter(e) {
    const tag = e.target;
    tag.style.transform = "translateY(-3px) rotateX(5deg)";

    if (tag.classList.contains("main-skill")) {
      // 主要技能已经是蓝色，只需应用阴影效果
      tag.style.boxShadow = "0 6px 16px rgba(var(--primary-color-rgb), 0.3)";
    } else if (tag.classList.contains("aux-skill")) {
      // 辅助技能变为深色
      tag.style.backgroundColor = "var(--secondary-color)";
      tag.style.color = "white";
      tag.style.boxShadow = "0 4px 12px rgba(var(--secondary-color-rgb), 0.2)";
    } else {
      // 普通技能变为蓝色
      tag.style.backgroundColor = "var(--primary-color)";
      tag.style.color = "white";
      tag.style.boxShadow = "0 4px 12px rgba(var(--primary-color-rgb), 0.2)";
    }
  }

  function handleMouseLeave(e) {
    const tag = e.target;
    tag.style.transform = "";
    tag.style.boxShadow = tag.dataset.originalShadow || "";

    if (!tag.classList.contains("main-skill")) {
      tag.style.backgroundColor = tag.dataset.originalBg || "";
      tag.style.color = tag.dataset.originalColor || "";
    }
  }

  // 应用悬浮效果
  applyHoverStyles();

  // 如果DOM发生变化，重新应用悬浮效果
  const observer = new MutationObserver(applyHoverStyles);
  observer.observe(document.body, { childList: true, subtree: true });

  // 确保手机端卡片完全可见
  function ensureCardsVisibility() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.querySelectorAll(".experience-list .card").forEach((card) => {
        card.style.backgroundColor = "#FFFFFF";
        card.style.opacity = "1";
        card.style.visibility = "visible";
        card.style.backdropFilter = "none";
        card.style.webkitBackdropFilter = "none";
        card.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
        card.style.transform = "none";
      });
    }
  }

  // 页面加载和调整大小时确保卡片可见
  window.addEventListener("load", ensureCardsVisibility);
  window.addEventListener("resize", ensureCardsVisibility);

  // 添加延迟检查确保完全加载后应用
  setTimeout(ensureCardsVisibility, 500);
  setTimeout(ensureCardsVisibility, 1000);
  setTimeout(ensureCardsVisibility, 2000);
});
