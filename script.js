const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');

const savedTheme = localStorage.getItem('ajay-portfolio-theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  if (themeToggle) {
    themeToggle.innerHTML = '<span class="icon">☀️</span>';
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('ajay-portfolio-theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<span class="icon">☀️</span>' : '<span class="icon">🌙</span>';
  });
}

if (mobileMenuToggle && siteNav) {
  mobileMenuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('active');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('active');
    });
  });
}

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  const isDecimal = Number.isInteger(target) === false;
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isDecimal ? (target * eased).toFixed(1) : Math.round(target * eased);

    if (isDecimal) {
      element.textContent = `${current}+`;
    } else {
      element.textContent = target >= 1 && target < 2 ? '1' : `${current}`;
      if (target === 80) {
        element.textContent = `${current}%`;
      }
      if (target === 5.5) {
        element.textContent = `${current.toFixed(1)}+`;
      }
      if (target === 2) {
        element.textContent = `${current}`;
      }
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      if (target === 5.5) element.textContent = '5.5+';
      if (target === 80) element.textContent = '80%';
      if (target === 2) element.textContent = '2';
      if (target === 1) element.textContent = '1';
    }
  };

  requestAnimationFrame(tick);
};

const counters = document.querySelectorAll('.impact-number');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const form = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = {
      name: form.querySelector('#name'),
      email: form.querySelector('#email'),
      subject: form.querySelector('#subject'),
      message: form.querySelector('#message')
    };

    let isValid = true;

    Object.entries(fields).forEach(([fieldName, field]) => {
      const value = field.value.trim();
      const parent = field.closest('.field');
      const messageNode = parent.querySelector('.error-message');

      parent.classList.remove('error');
      messageNode.textContent = '';

      if (!value) {
        parent.classList.add('error');
        messageNode.textContent = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
        isValid = false;
        return;
      }

      if (fieldName === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        parent.classList.add('error');
        messageNode.textContent = 'Please enter a valid email address.';
        isValid = false;
      }
    });

    if (!isValid) {
      formStatus.textContent = 'Please correct the highlighted fields.';
      formStatus.className = 'form-status error';
      return;
    }

    formStatus.textContent = 'Thanks for reaching out! Your message has been captured.';
    formStatus.className = 'form-status success';
    form.reset();
  });
}
