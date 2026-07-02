// ============ Year in footer ============
document.getElementById('year').textContent = new Date().getFullYear();

// ============ Mobile nav toggle ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============ Robust smooth-scroll for every in-page anchor ============
// Handled explicitly (rather than relying only on default anchor jump / CSS
// scroll-behavior) so navigation works consistently across embedded previews.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', targetId);
  });
});

// ============ Active nav link on scroll ============
const sections = document.querySelectorAll('.section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// ============ Typewriter effect ============
const roles = [
  'Aspiring Full-Stack Developer',
  'Aspiring Python & Software Developer',
  'Open to Entry-Level Jobs & Internships'
];
const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    typewriterEl.textContent = roles[0];
    return;
  }

  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// ============ Animate skill bars on scroll into view ============
const skillBars = document.querySelectorAll('.skill-bar');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const pct = bar.dataset.pct;
      const fill = bar.querySelector('.skill-fill');
      fill.style.width = pct + '%';
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ============ Contact form ============
// Sends the message via Web3Forms (free, no backend needed) so it actually
// arrives by email even if the visitor has no desktop mail app configured.
// To activate: get a free access key at https://web3forms.com (just enter
// your email, no signup/password) and paste it below in place of
// "YOUR_WEB3FORMS_ACCESS_KEY". Until replaced, the form falls back to
// opening a pre-filled mailto link instead.
const WEB3FORMS_ACCESS_KEY = "533ac8fb-461c-4cf7-ba27-8553cbca8101";

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const formSubmitBtn = contactForm.querySelector('button[type="submit"]');

function openMailtoFallback(name, email, subject, message) {
  const mailto = `mailto:chitteti.rohith15@gmail.com?subject=${encodeURIComponent(subject + ' — from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
  const link = document.createElement('a');
  link.href = mailto;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim() || 'Portfolio contact';
  const message = document.getElementById('cf-message').value.trim();

  if (WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
    // Not configured yet — use mailto fallback.
    openMailtoFallback(name, email, subject, message);
    formNote.textContent = '> opening your email app — if nothing happens, email me directly at chitteti.rohith15@gmail.com';
    contactForm.reset();
    setTimeout(() => { formNote.textContent = ''; }, 6000);
    return;
  }

  formSubmitBtn.disabled = true;
  formNote.textContent = '> sending...';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name, email, subject, message,
        from_name: 'Portfolio Contact Form'
      })
    });
    const data = await res.json();

    if (data.success) {
      formNote.textContent = '> message sent — thanks! I\'ll get back to you soon.';
      contactForm.reset();
    } else {
      throw new Error(data.message || 'Send failed');
    }
  } catch (err) {
    openMailtoFallback(name, email, subject, message);
    formNote.textContent = '> could not send automatically — opening your email app instead.';
    contactForm.reset();
  } finally {
    formSubmitBtn.disabled = false;
    setTimeout(() => { formNote.textContent = ''; }, 6000);
  }
});

// ============ Reveal-on-scroll for section titles/cards ============
const revealTargets = document.querySelectorAll('.project-card, .timeline-item, .side-card');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i % 4) * 60 + 'ms';
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  revealObserver.observe(el);
});

const style = document.createElement('style');
style.textContent = '.in-view{ opacity:1 !important; transform:translateY(0) !important; }';
document.head.appendChild(style);
