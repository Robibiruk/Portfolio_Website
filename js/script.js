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
}, { threshold: 0.3 }); // triggers when 30% of button is visible

animatedButtons.forEach(btn => btnObserver.observe(btn));


// Highlight active nav link
const navbarHeight = 72; // same as your CSS --navbar-height

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbarHeight;
    const sectionHeight = section.offsetHeight;

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

      // Find all images inside the same project-preview as the clicked one
      const projectImages = img.closest(".project-preview").querySelectorAll("img");

      // Clone those images into the lightbox
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

