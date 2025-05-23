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

// Funksioni për pagesën me kartë
const paymentForm = document.querySelector('.payment-form');
paymentForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const cardNumber = document.getElementById('card-number').value;
  const expiryDate = document.getElementById('expiry-date').value;
  const cvv = document.getElementById('cvv').value;
  const cardholder = document.getElementById('cardholder').value;

  if (cardNumber && expiryDate && cvv && cardholder) {
    alert(`✅ Pagesa u realizua me sukses!\n\n📅 Data e skadimit: ${expiryDate}\n💳 Numri i Kartës: ${cardNumber}`);
    paymentForm.reset();
  } else {
    alert("⚠️ Ju lutem plotësoni të gjitha të dhënat.");
  }
});


