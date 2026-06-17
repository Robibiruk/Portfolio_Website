// ============================================
//  3D Portfolio — Interactive Layer
// ============================================

// Hamburger menu toggle
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Fade in buttons when they enter view
const animatedButtons = document.querySelectorAll('.btn-animate');

const btnObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

animatedButtons.forEach(btn => btnObserver.observe(btn));


// Highlight active nav link
const navbarHeight = 72;

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbarHeight;
    const sectionHeight = section.height || section.offsetHeight;

    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});


// Scroll-to-top button
document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.getElementById("scrollTopBtn");

  if (scrollBtn) {
    // Show/hide button on scroll
    window.addEventListener("scroll", () => {
      scrollBtn.style.display = window.scrollY > 400 ? "flex" : "none";
    });

    // Scroll smoothly to top on click
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// Fade in images when they enter view
const images = document.querySelectorAll('.project-preview img');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.6 }); // triggers when 60% of image is visible

images.forEach(img => observer.observe(img));

// Lightbox for mobile
const lightbox = document.getElementById("lightbox");
const lightboxImagesContainer = document.querySelector(".lightbox-images");
const closeLightbox = document.getElementById("closeLightbox");

// Attach click listener to each preview image
document.querySelectorAll(".project-preview img").forEach(img => {
  img.addEventListener("click", () => {
    if (window.innerWidth <= 768) { // Only on mobile
      // Clear old images
      lightboxImagesContainer.innerHTML = "";

      // Find all images inside the same project-preview when clicked
      const projectImages = img.closest(".project-preview").querySelectorAll("img");

      projectImages.forEach(projectImg => {
        const clone = projectImg.cloneNode(true);
        lightboxImagesContainer.appendChild(clone);
      });

      // Show the lightbox
      lightbox.classList.add("active");

      // Scroll directly to the clicked image
      const index = Array.from(projectImages).indexOf(img);
      const targetClone = lightboxImagesContainer.children[index];
      targetClone.scrollIntoView({ behavior: "instant", inline: "center" });
    }
  });
});

// Close lightbox
closeLightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});

// ============================================
//  3D Background — Three.js Particle Field
// ============================================
(function initThreeBackground() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050b1f, 0.0008);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = 600;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x050b1f, 1);

  // Particle field
  const PARTICLE_COUNT = 1400;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  const palette = [
    new THREE.Color(0x1DB954),
    new THREE.Color(0x00e0ff),
    new THREE.Color(0xff9900),
    new THREE.Color(0xff4500),
    new THREE.Color(0x9d4edd),
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 1800;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1800;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // A wireframe geometric "world" object drifting in the back
  const icosa = new THREE.Mesh(
    new THREE.IcosahedronGeometry(220, 1),
    new THREE.MeshBasicMaterial({
      color: 0x1DB954,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
  );
  icosa.position.set(0, 0, -400);
  scene.add(icosa);

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(150, 5, 12, 60),
    new THREE.MeshBasicMaterial({
      color: 0x00e0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
  );
  torus.position.set(300, 100, -300);
  scene.add(torus);

  // Mouse interaction — gentle parallax
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Smooth follow mouse
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    // Rotate particles
    particles.rotation.y = elapsed * 0.04 + mouseX * 0.3;
    particles.rotation.x = mouseY * 0.2;

    // Drift the geometric shapes
    icosa.rotation.x = elapsed * 0.1;
    icosa.rotation.y = elapsed * 0.07;
    torus.rotation.x = elapsed * 0.15;
    torus.rotation.y = elapsed * 0.2;
    torus.position.y = 100 + Math.sin(elapsed * 0.5) * 40;

    // Subtle camera parallax
    camera.position.x += (mouseX * 60 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 60 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ============================================
//  Card Tilt — Mouse-tracked 3D rotation
// ============================================
document.querySelectorAll('.tilt-3d').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ry = ((x - cx) / cx) * 8;   // rotateY degrees
    const rx = -((y - cy) / cy) * 8;  // rotateX degrees
    card.style.setProperty('--rx', `${rx}deg`);
    card.style.setProperty('--ry', `${ry}deg`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--rx', `0deg`);
    card.style.setProperty('--ry', `0deg`);
  });
});

// ============================================
//  Parallax layers on scroll
// ============================================
const parallaxLayers = document.querySelectorAll('[data-depth]');

function updateParallax() {
  const scrollY = window.pageYOffset;
  parallaxLayers.forEach(layer => {
    const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
    const offset = scrollY * depth * 0.4;
    layer.style.transform = `translate3d(0, ${-offset}px, 0)`;
  });
}

window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();
