const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Stripe = require("stripe");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.json());

// Fonction to generate an invoice number incremented 
function getNextInvoiceNumber() {
  const file = path.join("invoices", "invoice-number.txt");
  let year = new Date().getFullYear();
  let number = 1;
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, "utf8");
    const [lastYear, lastNumber] = content.split(":");
    if (parseInt(lastYear) === year) {
      number = parseInt(lastNumber) + 1;
    }
  }
  fs.writeFileSync(file, `${year}:${number}`);
  return `FAC-${year}-${String(number).padStart(4, "0")}`;
}

// ✅ Endpoint of created payment  + invoice
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, customerName, description } = req.body;

    // Create stripe payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // en centimes
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });

    // create the pdf invoice
    const invoiceName = `invoice_${Date.now()}.pdf`;
    const invoicePath = path.join("invoices", invoiceName);

    // check if the invoice folder exist
    if (!fs.existsSync("invoices")) {
      fs.mkdirSync("invoices");
    }

    const invoiceNumber = getNextInvoiceNumber();

    const doc = new PDFDocument({ margin: 40 });
    // Logo
    doc.image("public/logo.png", 40, 40, { width: 60 }).moveDown();
    doc.fontSize(24).fillColor("#1086f4").text("FACTURE AGL Tech", { align: "center" });
    doc.moveDown(3);
    doc.fontSize(12).fillColor("#1086f4").text("AGL Tech");
    doc.fontSize(12).fillColor("#1086f4").text("Company's address");
    doc.fontSize(12).fillColor("#1086f4").text("Address next");
    doc.fontSize(12).fillColor("#1086f4").text("SIREN: XXX XXX XXX");
    doc.moveDown();
    doc.fontSize(12).fillColor("#333").text(`Numéro de facture : ${invoiceNumber}`);
    doc.text(`Date : ${new Date().toLocaleDateString()}`);
    doc.text(`Client : ${customerName}`);
    doc.moveDown(2);
    // Recap array
    doc.fontSize(14).fillColor("#000").text("Détail :", { underline: true });
    doc.moveDown(0.5);
    // Description multilines
    if (description) {
      description.split(/\r?\n/).forEach(line => {
        doc.fontSize(12).text(line);
      });
    } else {
      doc.fontSize(12).text("Service de paiement en ligne");
    }
    doc.text(`Montant : ${amount} €`, { continued: true }).text("  |  TVA : 0 €");
    doc.moveDown();
    doc.text("Merci pour votre confiance !",0, doc.page.height - 60, { align: "center" });
    doc.end();

    doc.pipe(fs.createWriteStream(invoicePath));

    res.send({
      clientSecret: paymentIntent.client_secret,
      invoice: invoiceName,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Endpoint for download the invoice as PDF
app.get("/download-invoice/:filename", (req, res) => {
  const filename = req.params.filename;
  const invoicePath = path.join(__dirname, "invoices", filename);
  if (fs.existsSync(invoicePath)) {
    res.download(invoicePath);
  } else {
    res.status(404).send("Facture non trouvée");
  }
});

app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
