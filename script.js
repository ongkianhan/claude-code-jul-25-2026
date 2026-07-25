var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth scroll for anchor nav links
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var targetId = this.getAttribute('href').slice(1);
    var target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
});

// Mobile nav toggle
var navToggle = document.getElementById('nav-toggle');
var navLinks = document.getElementById('nav-links');

function closeNav() {
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  navLinks.classList.remove('open');
}

navToggle.addEventListener('click', function () {
  var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  navLinks.classList.toggle('open', !isOpen);
});

navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', closeNav);
});

// Navbar shadow/blur once page has scrolled
var navbar = document.getElementById('navbar');
function updateNavbarState() {
  navbar.classList.toggle('scrolled', window.scrollY > 8);
}
document.addEventListener('scroll', updateNavbarState, { passive: true });
updateNavbarState();

// Scroll-reveal for elements marked .reveal
var revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(function (el) { revealObserver.observe(el); });
} else {
  revealTargets.forEach(function (el) { el.classList.add('visible'); });
}

// Animated stat counters
var counters = document.querySelectorAll('[data-count-to]');
function animateCounter(el) {
  var target = parseFloat(el.getAttribute('data-count-to'));
  var suffix = el.getAttribute('data-suffix') || '';
  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }
  var duration = 900;
  var start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = Math.min((timestamp - start) / duration, 1);
    var value = Math.round(progress * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
if (counters.length) {
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }
}

// Hero network canvas — ambient, decorative only
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var hero = canvas.closest('.hero');
  var width, height, nodes;
  var NODE_COUNT = 46;
  var MAX_DIST = 140;

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function makeNodes() {
    nodes = [];
    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
      });
    }
  }

  function drawStatic() {
    resize();
    makeNodes();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(46, 107, 255, 0.35)';
    nodes.forEach(function (n) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach(function (n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.strokeStyle = 'rgba(46, 107, 255, ' + (0.16 * (1 - dist / MAX_DIST)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = 'rgba(46, 107, 255, 0.45)';
    nodes.forEach(function (n) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    rafId = requestAnimationFrame(tick);
  }

  var rafId;

  if (prefersReducedMotion) {
    drawStatic();
  } else {
    resize();
    makeNodes();
    rafId = requestAnimationFrame(tick);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    });
  }

  window.addEventListener('resize', function () {
    resize();
    if (prefersReducedMotion) drawStatic();
  });
})();

// WhatsApp FAQ widget
var WHATSAPP_NUMBER = '6593516241';
var whatsappToggle = document.getElementById('whatsapp-toggle');
var whatsappPanel = document.getElementById('whatsapp-panel');
var whatsappCustomForm = document.getElementById('whatsapp-custom-form');
var whatsappCustomInput = document.getElementById('whatsapp-custom-input');

function closeWhatsappPanel() {
  whatsappToggle.setAttribute('aria-expanded', 'false');
  whatsappPanel.hidden = true;
}

function sendToWhatsapp(question) {
  var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(question);
  window.open(url, '_blank', 'noopener');
}

whatsappToggle.addEventListener('click', function () {
  var isOpen = whatsappToggle.getAttribute('aria-expanded') === 'true';
  whatsappToggle.setAttribute('aria-expanded', String(!isOpen));
  whatsappPanel.hidden = isOpen;
});

whatsappPanel.querySelectorAll('.whatsapp-faq-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    sendToWhatsapp(btn.dataset.question);
    closeWhatsappPanel();
  });
});

whatsappCustomForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var question = whatsappCustomInput.value.trim();
  if (!question) return;
  sendToWhatsapp(question);
  whatsappCustomInput.value = '';
  closeWhatsappPanel();
});

document.addEventListener('click', function (e) {
  if (whatsappPanel.hidden) return;
  if (!whatsappPanel.contains(e.target) && e.target !== whatsappToggle && !whatsappToggle.contains(e.target)) {
    closeWhatsappPanel();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !whatsappPanel.hidden) {
    closeWhatsappPanel();
    whatsappToggle.focus();
  }
});

// Shared field-error helpers
function setInvalid(rowId, invalid) {
  var row = document.getElementById(rowId);
  row.classList.toggle('invalid', invalid);
}

var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showStatus(el, type, message) {
  el.textContent = message;
  el.className = 'form-status show ' + type;
}

// Speaks a short confirmation aloud via the browser's speech synthesis, if available.
function speak(message) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  var utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// Enquiry form submission via FormSubmit
var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/kianhan97@gmail.com';

var form = document.getElementById('enquiry-form');
var submitBtn = document.getElementById('submit-btn');
var statusEl = document.getElementById('form-status');

var fields = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  message: document.getElementById('message')
};

function validateForm() {
  var valid = true;
  var firstInvalid = null;

  if (!fields.name.value.trim()) {
    setInvalid('row-name', true);
    valid = false;
    firstInvalid = firstInvalid || fields.name;
  } else {
    setInvalid('row-name', false);
  }

  if (!emailRegex.test(fields.email.value.trim())) {
    setInvalid('row-email', true);
    valid = false;
    firstInvalid = firstInvalid || fields.email;
  } else {
    setInvalid('row-email', false);
  }

  if (!fields.message.value.trim()) {
    setInvalid('row-message', true);
    valid = false;
    firstInvalid = firstInvalid || fields.message;
  } else {
    setInvalid('row-message', false);
  }

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return valid;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  statusEl.className = 'form-status';

  if (!validateForm()) {
    showStatus(statusEl, 'error', 'Please fix the highlighted fields and try again.');
    return;
  }

  var payload = {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    company: document.getElementById('company').value.trim(),
    message: fields.message.value.trim()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(function (response) {
      if (response.ok) {
        showStatus(statusEl, 'success', "Thanks! Your enquiry has been sent — we'll be in touch within one business day.");
        speak("Thank you for your submission. We'll get back to you within one business day.");
        form.reset();
      } else {
        return response.json().then(function (data) {
          var message = (data && data.errors && data.errors.map(function (err) { return err.message; }).join(', ')) || 'Something went wrong. Please try again.';
          throw new Error(message);
        });
      }
    })
    .catch(function (err) {
      showStatus(statusEl, 'error', err.message || 'Something went wrong. Please try again.');
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send enquiry';
    });
});

// Lead-magnet (checklist) form — same FormSubmit endpoint, plus an autoresponse
// back to the submitter with a link to the on-site checklist page.
var checklistForm = document.getElementById('checklist-form');
var checklistSubmitBtn = document.getElementById('checklist-submit-btn');
var checklistStatusEl = document.getElementById('checklist-form-status');

var checklistFields = {
  name: document.getElementById('checklist-name'),
  email: document.getElementById('checklist-email')
};

function validateChecklistForm() {
  var valid = true;
  var firstInvalid = null;

  if (!checklistFields.name.value.trim()) {
    setInvalid('row-checklist-name', true);
    valid = false;
    firstInvalid = firstInvalid || checklistFields.name;
  } else {
    setInvalid('row-checklist-name', false);
  }

  if (!emailRegex.test(checklistFields.email.value.trim())) {
    setInvalid('row-checklist-email', true);
    valid = false;
    firstInvalid = firstInvalid || checklistFields.email;
  } else {
    setInvalid('row-checklist-email', false);
  }

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return valid;
}

checklistForm.addEventListener('submit', function (e) {
  e.preventDefault();

  checklistStatusEl.className = 'form-status';

  if (!validateChecklistForm()) {
    showStatus(checklistStatusEl, 'error', 'Please fix the highlighted fields and try again.');
    return;
  }

  var checklistUrl = window.location.origin + window.location.pathname.replace(/index\.html$/, '') + 'resources/marketing-growth-checklist.html';

  var payload = {
    name: checklistFields.name.value.trim(),
    email: checklistFields.email.value.trim(),
    _subject: 'New free checklist request',
    _autoresponse: "Hi " + checklistFields.name.value.trim() + ",\n\nThanks for requesting the free Marketing Growth Checklist — here it is:\n" + checklistUrl + "\n\nIf you'd like to talk through your results, just reply to this email.\n\n— Momentum"
  };

  checklistSubmitBtn.disabled = true;
  checklistSubmitBtn.textContent = 'Sending…';

  fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(function (response) {
      if (response.ok) {
        showStatus(checklistStatusEl, 'success', 'Sent! Check your inbox for the checklist.');
        checklistForm.reset();
      } else {
        return response.json().then(function (data) {
          var message = (data && data.errors && data.errors.map(function (err) { return err.message; }).join(', ')) || 'Something went wrong. Please try again.';
          throw new Error(message);
        });
      }
    })
    .catch(function (err) {
      showStatus(checklistStatusEl, 'error', err.message || 'Something went wrong. Please try again.');
    })
    .finally(function () {
      checklistSubmitBtn.disabled = false;
      checklistSubmitBtn.textContent = 'Send Me the Checklist';
    });
});
