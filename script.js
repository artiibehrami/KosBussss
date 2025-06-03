const form = document.querySelector('.ticket-form');
const priceContainer = document.getElementById('price');
const fromSelect = document.getElementById('nisja');
const toSelect = document.getElementById('destinacioni');

const prices = {
  "Prishtinë": {
    "Ferizaj": 7,
    "Mitrovicë": 6,
    "Gjakovë": 8,
    "Prizren": 5,
    "Pejë": 6
  },
  "Pejë": {
    "Ferizaj": 5,
    "Mitrovicë": 7,
    "Gjakovë": 6,
    "Prishtinë": 6,
    "Prizren": 7
  },
  "Prizren": {
    "Ferizaj": 6,
    "Mitrovicë": 8,
    "Gjakovë": 7,
    "Prishtinë": 5,
    "Pejë": 7
  }
};

function updatePrice() {
  const from = fromSelect.value;
  const to = toSelect.value;
  if (from && to && prices[from] && prices[from][to]) {
    priceContainer.innerHTML = `<strong>Çmimi:</strong> €${prices[from][to]} për pasagjer.`;
  } else {
    priceContainer.innerHTML = "Të dhënat e çmimit do të shfaqen këtu.";
  }
}

fromSelect.addEventListener('change', updatePrice);
toSelect.addEventListener('change', updatePrice);
updatePrice();

// Funksioni për rezervimin e biletës
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const from = document.getElementById('nisja').value;
  const to = document.getElementById('destinacioni').value;
  const date = document.getElementById('date').value;
  const passenger = document.getElementById('passenger').value;

  if (from && to && date && passenger) {
    alert(`✅ Bileta u rezervua me sukses!\n\n📍 Nga: ${from}\n📍 Për: ${to}\n📅 Data: ${date}\n👤 Pasagjerë: ${passenger}`);
    form.reset();
  } else {
    alert("⚠️ Ju lutem plotësoni të gjitha fushat.");
  }
});

// --- DARK MODE TOGGLE ---
const darkModeBtn = document.getElementById('dark-mode-toggle');
if (darkModeBtn) {
  // Load preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeBtn.innerText = '☀️';
  }
  darkModeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeBtn.innerText = isDark ? '☀️' : '🌙';
  });
}

// --- QR CODE GENERATION & PDF ---
function showQRTicketModal(ticketData) {
  const qrModal = document.getElementById('qr-ticket-modal');
  const qrCodeDiv = document.getElementById('qr-code');
  const ticketDetails = document.getElementById('ticket-details');
  if (qrModal && qrCodeDiv && ticketDetails) {
    qrCodeDiv.innerHTML = '';
    // Use QRCode.js
    new window.QRCode(qrCodeDiv, {
      text: ticketData.qrString,
      width: 120,
      height: 120
    });
    ticketDetails.innerHTML = `Nga: <b>${ticketData.nisja}</b><br>Te: <b>${ticketData.destinacioni}</b><br>Data: <b>${ticketData.data}</b><br>Pasagjerë: <b>${ticketData.pasagjere}</b><br>Çmimi: <b>€${ticketData.cmimi}</b>`;
    qrModal.style.display = 'flex';
  }
}
const closeQRBtn = document.getElementById('close-qr-modal');
if (closeQRBtn) {
  closeQRBtn.onclick = function() {
    document.getElementById('qr-ticket-modal').style.display = 'none';
  };
}
const downloadBtn = document.getElementById('download-ticket');
if (downloadBtn) {
  downloadBtn.onclick = function() {
    // Simple PDF: open print dialog for now
    window.print();
  };
}

// --- PAYMENT FORM HANDLING ---
const paymentForm = document.querySelector('.payment-form');
if (paymentForm) {
  paymentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const cardholder = document.getElementById('cardholder').value;
    if (cardNumber && expiryDate && cvv && cardholder) {
      // Get ticket info
      const nisja = document.getElementById('nisja').value;
      const destinacioni = document.getElementById('destinacioni').value;
      const data = document.getElementById('date').value;
      const pasagjere = document.getElementById('passenger').value;
      const cmimi = getSelectedPrice();
      const qrString = `BusTripKS|${nisja}|${destinacioni}|${data}|${pasagjere}|${cmimi}|${cardholder}`;
      showQRTicketModal({nisja, destinacioni, data, pasagjere, cmimi, qrString});
      // Confetti animation
      confetti();
    } else {
      alert('⚠️ Ju lutem plotësoni të gjitha të dhënat.');
    }
  });
}

// --- CONFETTI ANIMATION ---
function confetti() {
  const colors = ['#ffe066','#00b87b','#001f4d','#f9d423'];
  for (let i=0; i<40; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = Math.random()*100+'vw';
    conf.style.background = colors[Math.floor(Math.random()*colors.length)];
    conf.style.animationDuration = (1+Math.random()*2)+'s';
    conf.style.opacity = 0.7+Math.random()*0.3;
    conf.style.width = conf.style.height = (8+Math.random()*8)+'px';
    document.body.appendChild(conf);
    setTimeout(()=>conf.remove(), 2500);
  }
}

// Biletat: Show payment form only after reservation
if (document.querySelector('.ticket-form') && document.querySelector('.payment-section')) {
  const ticketForm = document.querySelector('.ticket-form');
  const paymentSection = document.querySelector('.payment-section');
  paymentSection.style.display = 'none';
  ticketForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const from = document.getElementById('nisja').value;
    const to = document.getElementById('destinacioni').value;
    const date = document.getElementById('date').value;
    const passenger = document.getElementById('passenger').value;
    if (from && to && date && passenger) {
      alert(`✅ Bileta u rezervua me sukses!\n\n📍 Nga: ${from}\n📍 Për: ${to}\n📅 Data: ${date}\n👤 Pasagjerë: ${passenger}`);
      ticketForm.reset();
      paymentSection.style.display = 'block';
      paymentSection.scrollIntoView({behavior: 'smooth'});
    } else {
      alert('⚠️ Ju lutem plotësoni të gjitha fushat.');
    }
  });
}

// --- Live Search for City Dropdowns ---
const cityList = [
  "Prishtinë", "Prizren", "Pejë", "Gjakovë", "Mitrovicë", "Ferizaj", "Gjilan", "Podujevë", "Vushtrri", "Suharekë"
];
function setupCitySearch(inputId, selectId) {
  const input = document.getElementById(inputId);
  const select = document.getElementById(selectId);
  input.addEventListener('input', function() {
    const val = input.value.toLowerCase();
    for (let i = 1; i < select.options.length; i++) {
      const opt = select.options[i];
      opt.style.display = opt.text.toLowerCase().includes(val) ? '' : 'none';
    }
    select.selectedIndex = 0;
  });
  select.addEventListener('change', function() {
    if (select.selectedIndex > 0) {
      input.value = select.options[select.selectedIndex].text;
    }
  });
}
if (document.getElementById('nisja-search') && document.getElementById('nisja')) {
  setupCitySearch('nisja-search', 'nisja');
}
if (document.getElementById('destinacioni-search') && document.getElementById('destinacioni')) {
  setupCitySearch('destinacioni-search', 'destinacioni');
}

// --- Progress Bar & Modal Success ---
const ticketForm = document.querySelector('.ticket-form');
const progressBar = document.getElementById('progress-bar');
const progressBarInner = progressBar ? progressBar.querySelector('.progress-bar-inner') : null;
const modalSuccess = document.getElementById('reservation-success');
const continuePaymentBtn = document.getElementById('continue-payment');
const paymentSection = document.querySelector('.payment-section');
const priceSpan = document.getElementById('price');

function getSelectedPrice() {
  // Simple price logic (expand as needed)
  const from = document.getElementById('nisja').value;
  const to = document.getElementById('destinacioni').value;
  const passenger = parseInt(document.getElementById('passenger').value) || 1;
  // Example price table
  const basePrices = {
    'Prishtinë': { 'Prizren': 7, 'Pejë': 6, 'Gjakovë': 8 },
    'Prizren': { 'Prishtinë': 7, 'Pejë': 5, 'Gjakovë': 6 },
    'Pejë': { 'Prishtinë': 6, 'Prizren': 5, 'Gjakovë': 7 },
    'Gjakovë': { 'Prishtinë': 8, 'Prizren': 6, 'Pejë': 7 },
    'Mitrovicë': { 'Ferizaj': 6 },
    'Ferizaj': { 'Mitrovicë': 6 },
    'Gjilan': { 'Podujevë': 5 },
    'Podujevë': { 'Gjilan': 5 },
    'Vushtrri': { 'Suharekë': 7 },
    'Suharekë': { 'Vushtrri': 7 }
  };
  let price = 0;
  if (basePrices[from] && basePrices[from][to]) {
    price = basePrices[from][to] * passenger;
  }
  return price;
}

if (ticketForm && progressBar && progressBarInner && paymentSection) {
  ticketForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const from = document.getElementById('nisja').value;
    const to = document.getElementById('destinacioni').value;
    const date = document.getElementById('date').value;
    const passenger = document.getElementById('passenger').value;
    if (from && to && date && passenger && from !== 'Zgjidh qytetin e nisjes' && to !== 'Zgjidh qytetin e destinacionit') {
      progressBar.style.display = 'block';
      progressBarInner.style.width = '0%';
      setTimeout(() => { progressBarInner.style.width = '100%'; }, 50);
      setTimeout(() => {
        progressBar.style.display = 'none';
        paymentSection.style.display = 'block';
        paymentSection.scrollIntoView({behavior: 'smooth'});
        // Show price visually above payment form
        const price = getSelectedPrice();
        let priceInfo = document.getElementById('payment-price-info');
        if (!priceInfo) {
          priceInfo = document.createElement('div');
          priceInfo.id = 'payment-price-info';
          priceInfo.style = 'text-align:center;margin-bottom:18px;font-size:1.2rem;color:#007b5e;font-weight:600;';
          paymentSection.insertBefore(priceInfo, paymentSection.querySelector('form'));
        }
        if (price > 0) {
          priceInfo.innerHTML = `Çmimi total për biletën: <span style='color:#001f4d'>€${price}</span>`;
        } else {
          priceInfo.innerHTML = 'Çmimi për këtë destinacion do të konfirmohet nga operatori.';
        }
      }, 900);
    } else {
      alert('⚠️ Ju lutem plotësoni të gjitha fushat.');
    }
  });
}

// Simple dashboard section switching
document.addEventListener('DOMContentLoaded', function() {
  // Ask for user's account info if not set
  let userName = sessionStorage.getItem('dashboardUserName');
  let userEmail = sessionStorage.getItem('dashboardUserEmail');
  if (!userName || !userEmail) {
    userName = prompt('Shkruani emrin tuaj për dashboard:');
    if (!userName || userName.trim().length < 2) userName = 'Përdorues';
    userEmail = prompt('Shkruani email-in tuaj për dashboard:');
    if (!userEmail || !userEmail.includes('@')) userEmail = userName.toLowerCase().replace(/ /g,'') + '@email.com';
    sessionStorage.setItem('dashboardUserName', userName);
    sessionStorage.setItem('dashboardUserEmail', userEmail);
  }

  // Sidebar navigation highlight and section switching with blur effect
  const sidebar = document.querySelector('.dashboard-sidebar ul');
  const dashboardContent = document.querySelector('.dashboard-content');
  let blurOverlay = null;
  if (sidebar && dashboardContent) {
    const sections = {
      '🏠 Paneli': () => `<h1>Mirësevini, ${userName}!</h1><div class='widget'><h3>Ky është paneli juaj kryesor.</h3></div>` ,
      '👤 Profili im': () => `<h1>Profili im</h1><div class='widget'><h3>Emri:</h3><p>${userName}</p><h3>Email:</h3><p>${userEmail}</p></div>`,
      '🚌 Udhëtimet e mia': () => `<h1>Udhëtimet e mia</h1><div class='widget'><ul><li>Prishtinë → Pejë | 02/06/2025</li><li>Mitrovicë → Prizren | 15/05/2025</li></ul></div>`,
      '🎫 Biletat e blera': () => `<h1>Biletat e blera</h1><div class='widget'><ul><li>Biletë #12345 | Prishtinë → Pejë | 02/06/2025</li></ul></div>`,
      '🌍 Destinacionet': () => `<h1>Destinacionet</h1><div class='widget'><ul><li>Prizren</li><li>Pejë</li><li>Mitrovicë</li></ul></div>`
    };
    sidebar.addEventListener('click', function(e) {
      if (e.target.tagName === 'LI') {
        sidebar.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        e.target.classList.add('active');
        dashboardContent.innerHTML = sections[e.target.textContent.trim()]();
        showBlurOverlay(`Po ngarkohet seksioni: ${e.target.textContent.trim()}`);
        attachDashboardButtonListeners();
      }
    });
    // Set initial content with user name
    dashboardContent.innerHTML = sections['🏠 Paneli']();
  }

  // Dashboard button actions with blur effect
  function attachDashboardButtonListeners() {
    const actions = document.querySelector('.dashboard-actions');
    if (actions) {
      actions.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
          let msg = '';
          if (btn.textContent.includes('Shto udhëtim')) {
            msg = 'Funksioni për shtimin e udhëtimit së shpejti!';
          } else if (btn.textContent.includes('Shiko biletat')) {
            msg = 'Këtu do të shfaqen biletat e tua.';
          } else if (btn.textContent.includes('Përditëso profilin')) {
            msg = 'Forma për përditësim profili së shpejti!';
          }
          showBlurOverlay(msg);
        });
      });
    }
  }
  attachDashboardButtonListeners();

  // Blur overlay function
  function showBlurOverlay(message) {
    if (blurOverlay) blurOverlay.remove();
    blurOverlay = document.createElement('div');
    blurOverlay.style.position = 'fixed';
    blurOverlay.style.top = 0;
    blurOverlay.style.left = 0;
    blurOverlay.style.width = '100vw';
    blurOverlay.style.height = '100vh';
    blurOverlay.style.background = 'rgba(255,255,255,0.7)';
    blurOverlay.style.backdropFilter = 'blur(6px)';
    blurOverlay.style.zIndex = 2000;
    blurOverlay.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:30px 40px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.15);text-align:center;max-width:90vw;">
      <h2 style='color:#001f4d;'>${message}</h2>
      <button id='close-blur' class='btn' style='margin-top:18px;'>Mbyll</button>
    </div>`;
    document.body.appendChild(blurOverlay);
    document.body.style.overflow = 'hidden';
    document.getElementById('close-blur').onclick = function() {
      blurOverlay.remove();
      document.body.style.overflow = '';
      attachDashboardButtonListeners();
    };
  }

  // Kyçja e thjeshtë për dashboard
  const isUserDashboard = window.location.pathname.includes('user-dashboard');
  const isAdminDashboard = window.location.pathname.includes('admin-dashboard');
  if ((isUserDashboard || isAdminDashboard) && !sessionStorage.getItem('userLoggedIn')) {
    const blurDiv = document.createElement('div');
    blurDiv.style.position = 'fixed';
    blurDiv.style.top = 0;
    blurDiv.style.left = 0;
    blurDiv.style.width = '100vw';
    blurDiv.style.height = '100vh';
    blurDiv.style.background = 'rgba(255,255,255,0.7)';
    blurDiv.style.backdropFilter = 'blur(5px)';
    blurDiv.style.zIndex = 3000;
    blurDiv.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:30px 40px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.15);text-align:center;max-width:90vw;">
      <h2>Kyçu për të parë dashboardin</h2>
      <input id='modal-user' type='text' placeholder='Përdoruesi' style='margin:10px 0;padding:8px;width:90%;border-radius:6px;border:1px solid #ccc;'><br>
      <input id='modal-pass' type='password' placeholder='Fjalëkalimi' style='margin:10px 0;padding:8px;width:90%;border-radius:6px;border:1px solid #ccc;'><br>
      <button id='modal-login-btn' class='btn'>Kyçu</button>
      <p style='color:#c81a07;margin-top:10px;display:none;' id='modal-err'>Kredencialet gabim!</p>
    </div>`;
    document.body.appendChild(blurDiv);
    document.body.style.overflow = 'hidden';
    document.getElementById('modal-login-btn').onclick = function() {
      const u = document.getElementById('modal-user').value.trim();
      const p = document.getElementById('modal-pass').value.trim();
      if ((isUserDashboard && u === 'sara17' && p === '1234') || (isAdminDashboard && u === 'admin' && p === '1234')) {
        sessionStorage.setItem('userLoggedIn', '1');
        blurDiv.remove();
        document.body.style.overflow = '';
        location.reload();
      } else {
        document.getElementById('modal-err').style.display = 'block';
      }
    };
  }
});

// FAQ Accordion logic for all pages
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(btn => {
  btn.addEventListener('click', function() {
    const item = this.parentElement;
    item.classList.toggle('active');
    // Close others
    faqQuestions.forEach(otherBtn => {
      if (otherBtn !== this) otherBtn.parentElement.classList.remove('active');
    });
  });
});

// --- Payment Success Modal Logic ---
const paymentSuccessModal = document.getElementById('payment-success-modal');
const downloadTicketSuccessBtn = document.getElementById('download-ticket-success');
const closeSuccessModalBtn = document.getElementById('close-success-modal');
const paymentForm2 = document.querySelector('.payment-form');

if (paymentForm2 && paymentSuccessModal && downloadTicketSuccessBtn && closeSuccessModalBtn) {
  paymentForm2.addEventListener('submit', function(event) {
    event.preventDefault();
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const cardholder = document.getElementById('cardholder').value;
    if (cardNumber && expiryDate && cvv && cardholder) {
      // Show payment success modal
      paymentSuccessModal.style.display = 'flex';
      // Fill summary with ticket info
      const nisja = document.getElementById('nisja').value;
      const destinacioni = document.getElementById('destinacioni').value;
      const data = document.getElementById('date').value;
      const pasagjere = document.getElementById('passenger').value;
      const cmimi = typeof getSelectedPrice === 'function' ? getSelectedPrice() : '';
      document.getElementById('success-summary').innerHTML =
        `Bileta: <b>${nisja}</b> → <b>${destinacioni}</b><br>Data: <b>${data}</b><br>Pasagjerë: <b>${pasagjere}</b><br>Çmimi: <b>€${cmimi}</b>`;
    } else {
      alert('⚠️ Ju lutem plotësoni të gjitha të dhënat.');
    }
  });
  downloadTicketSuccessBtn.onclick = function() {
    window.print();
  };
  closeSuccessModalBtn.onclick = function() {
    paymentSuccessModal.style.display = 'none';
  };
}


