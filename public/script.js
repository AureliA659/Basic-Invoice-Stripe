const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);

const form = document.getElementById("payment-form");
const messageDiv = document.getElementById("payment-message");
const cardElementDiv = document.getElementById("card-element");

// Initialise Stripe Elements
const elements = stripe.elements();
const card = elements.create("card");
card.mount(cardElementDiv);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const customerName = document.getElementById("customerName").value;
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;

  // Crée le PaymentIntent côté serveur
  const res = await fetch("/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, customerName, description }),
  });

  const data = await res.json();

  if (data.error) {
    window.location.href = "/payment-failed.html";
    return;
  }

  // Confirme le paiement avec Stripe Elements
  const result = await stripe.confirmCardPayment(data.clientSecret, {
    payment_method: {
      card: card,
      billing_details: {
        name: customerName,
      },
    },
  });

  if (result.error) {
    window.location.href = "/payment-failed.html";
  } else {
    window.location.href = "/payment-success.html?invoice=" + encodeURIComponent(data.invoice);
  }
});
