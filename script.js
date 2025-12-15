// Smooth scroll reveal using IntersectionObserver (with fallback)
const revealElements = document.querySelectorAll(".reveal");

if (typeof IntersectionObserver !== "undefined") {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback: just show all elements if IntersectionObserver is not supported
  revealElements.forEach((el) => el.classList.add("visible"));
}

// Cache navigation and sections
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelector(".nav-links");

// Smooth scroll for anchor links (fallback enhancement)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href").slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const headerEl = document.querySelector(".site-header");
    const headerOffset = headerEl ? headerEl.offsetHeight : 0;
    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset - 12;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Close mobile nav when a link is clicked
    if (navLinks) {
      navLinks.classList.remove("open");
    }
  });
});

// Active nav link based on scroll position

const makeNavActive = () => {
  const scrollPos = window.scrollY;
  const headerEl = document.querySelector(".site-header");
  const headerOffset = headerEl ? headerEl.offsetHeight : 0;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const top = rect.top + window.scrollY - headerOffset - 80;
    const bottom = top + section.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      const id = section.getAttribute("id");
      document
        .querySelectorAll(".nav-link")
        .forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
};

window.addEventListener("scroll", makeNavActive);
window.addEventListener("load", makeNavActive);

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// Simple parallax on hero orbit element
const orbit = document.querySelector(".data-orbit");
if (orbit) {
  window.addEventListener("mousemove", (e) => {
    const rect = orbit.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = y * -8;
    const rotateY = x * 10;

    orbit.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  });

  window.addEventListener("mouseleave", () => {
    orbit.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  });
}

// Dynamic year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// WhatsApp contact form handler
const whatsappForm = document.getElementById("whatsapp-form");
if (whatsappForm) {
  whatsappForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("wa-name");
    const messageInput = document.getElementById("wa-message");
    if (!nameInput || !messageInput) return;

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (!name || !message) return;

    const phone = "201028910296"; // WhatsApp phone number without +
    const text = `Name: ${name}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
    const url = `https://wa.me/${phone}?text=${text}`;

    window.open(url, "_blank");
  });
}

// Certificate preview modal logic
const certModal = document.getElementById("cert-modal");
const certModalImage = document.getElementById("cert-modal-image");
const certModalTitle = document.getElementById("cert-modal-title");

if (certModal && certModalImage && certModalTitle) {
  const openCertModal = (src, title) => {
    certModalImage.src = src;
    certModalImage.alt = title || "Certificate preview";
    certModalTitle.textContent = title || "";
    certModal.classList.add("open");
    certModal.setAttribute("aria-hidden", "false");
  };

  const closeCertModal = () => {
    certModal.classList.remove("open");
    certModal.setAttribute("aria-hidden", "true");
    certModalImage.src = "";
    certModalTitle.textContent = "";
  };

  document.querySelectorAll(".cert-preview").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-cert-src");
      const title = btn.getAttribute("data-cert-title");
      if (!src) return;
      openCertModal(src, title);
    });
  });

  certModal.addEventListener("click", (e) => {
    if (e.target.matches("[data-cert-close]")) {
      closeCertModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certModal.classList.contains("open")) {
      closeCertModal();
    }
  });
}