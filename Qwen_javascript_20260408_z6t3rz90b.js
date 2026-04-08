document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const bars = document.querySelectorAll('.bar');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    
    // Animate hamburger
    bars.forEach((bar, i) => {
      if (isOpen) {
        if (i === 0) bar.style.transform = 'translateY(9px) rotate(45deg)';
        if (i === 1) bar.style.opacity = '0';
        if (i === 2) bar.style.transform = 'translateY(-9px) rotate(-45deg)';
      } else {
        bar.style.transform = '';
        bar.style.opacity = '';
      }
    });
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });

  // 2. Navbar Scroll Effect & Active Link
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Navbar background
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active section highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // 3. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // 4. Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (input, msg) => {
    const parent = input.closest('.form-group');
    parent.classList.remove('success');
    parent.classList.add('error');
    document.getElementById(`${input.id}Error`).textContent = msg;
  };

  const showSuccess = (input) => {
    const parent = input.closest('.form-group');
    parent.classList.remove('error');
    parent.classList.add('success');
    document.getElementById(`${input.id}Error`).textContent = '';
  };

  // Real-time validation on input/blur
  ['name', 'email', 'message'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('blur', () => {
      if (id === 'email') return;
      if (!input.value.trim()) showError(input, 'This field is required');
      else showSuccess(input);
    });
  });

  document.getElementById('email').addEventListener('blur', (e) => {
    const email = e.target.value.trim();
    if (!email) showError(e.target, 'Email is required');
    else if (!validateEmail(email)) showError(e.target, 'Please enter a valid email');
    else showSuccess(e.target);
  });

  // Submit Handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    // Validate all required fields
    ['name', 'email', 'message'].forEach(id => {
      const input = document.getElementById(id);
      const val = input.value.trim();
      if (!val) {
        showError(input, 'This field is required');
        isValid = false;
      } else if (id === 'email' && !validateEmail(val)) {
        showError(input, 'Invalid email format');
        isValid = false;
      } else {
        showSuccess(input);
      }
    });

    if (isValid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        feedback.textContent = '✅ Message sent successfully! I\'ll be in touch within 24 hours.';
        feedback.classList.add('success');
        contactForm.reset();
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('success'));
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }, 1200);
    } else {
      feedback.textContent = '⚠️ Please fix the errors above.';
      feedback.classList.add('error');
    }
  });

  // 5. Dynamic Copyright Year
  document.getElementById('year').textContent = new Date().getFullYear();
});