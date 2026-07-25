// Smooth scroll for anchor nav links
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var targetId = this.getAttribute('href').slice(1);
    var target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

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

var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setInvalid(rowId, invalid) {
  var row = document.getElementById(rowId);
  row.classList.toggle('invalid', invalid);
}

function validateForm() {
  var valid = true;

  if (!fields.name.value.trim()) {
    setInvalid('row-name', true);
    valid = false;
  } else {
    setInvalid('row-name', false);
  }

  if (!emailRegex.test(fields.email.value.trim())) {
    setInvalid('row-email', true);
    valid = false;
  } else {
    setInvalid('row-email', false);
  }

  if (!fields.message.value.trim()) {
    setInvalid('row-message', true);
    valid = false;
  } else {
    setInvalid('row-message', false);
  }

  return valid;
}

function showStatus(type, message) {
  statusEl.textContent = message;
  statusEl.className = 'form-status show ' + type;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  statusEl.className = 'form-status';

  if (!validateForm()) {
    showStatus('error', 'Please fix the highlighted fields and try again.');
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
        showStatus('success', "Thanks! Your enquiry has been sent — we'll be in touch within one business day.");
        form.reset();
      } else {
        return response.json().then(function (data) {
          var message = (data && data.errors && data.errors.map(function (err) { return err.message; }).join(', ')) || 'Something went wrong. Please try again.';
          throw new Error(message);
        });
      }
    })
    .catch(function (err) {
      showStatus('error', err.message || 'Something went wrong. Please try again.');
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send enquiry';
    });
});
