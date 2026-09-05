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

  window.addEventListener('scroll', () => {
    siteNav.classList.remove('active');
  }, { passive: true });

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

const counters = document.querySelectorAll('.impact-number[data-target]');
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

    const recipient = 'ajaynonia1803@gmail.com';
    const subject = encodeURIComponent(fields.subject.value.trim());
    const body = encodeURIComponent(
      `Name: ${fields.name.value.trim()}\nEmail: ${fields.email.value.trim()}\n\n${fields.message.value.trim()}`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    const composeWindow = window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    if (!composeWindow) {
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    }

    formStatus.textContent = 'Your email draft is ready to send.';
    formStatus.className = 'form-status success';
  });
}

const resumeDownload = document.querySelector('.hero-cta a[download]');

if (resumeDownload) {
  resumeDownload.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(resumeDownload.href);
      if (!response.ok) throw new Error('Resume download failed.');

      const resumeBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(resumeBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = resumeDownload.download || 'AjayResume.pdf';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (error) {
      window.open(resumeDownload.href, '_blank', 'noopener,noreferrer');
    }
  });
}

const availabilityStatus = document.querySelector('#availability-status');
const daysRemaining = document.querySelector('#days-remaining');
const currentTimestamp = document.querySelector('#current-timestamp');
const availableFrom = new Date(2026, 10, 16);

const updateAvailability = () => {
  const now = new Date();
  const remaining = Math.max(0, Math.ceil((availableFrom - now) / 86400000));

  if (remaining === 0) {
    availabilityStatus.textContent = 'Available Now';
    daysRemaining.textContent = '0';
  } else {
    availabilityStatus.textContent = 'Serving Notice Period';
    daysRemaining.textContent = remaining;
  }

  currentTimestamp.dateTime = now.toISOString();
  currentTimestamp.textContent = `Current time: ${now.toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'medium'
  })}`;
};

if (availabilityStatus && daysRemaining && currentTimestamp) {
  updateAvailability();
  window.setInterval(updateAvailability, 1000);
}
