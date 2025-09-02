# Invoice App

## 🇫🇷 Utilisation (French - English Below )

### Prérequis
- Node.js (v16+ recommandé)
- Un compte Stripe (pour obtenir vos clés API)

### Installation
1. Clonez ce dépôt ou copiez les fichiers sur votre machine.
2. Placez-vous dans le dossier du projet :
   ```bash
   cd invoice-app
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Créez un fichier `.env` à la racine avec vos clés Stripe :
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLIC_KEY=pk_test_...
   PORT=3000
   ```

### Lancement de l'application
```bash
node server.js
```

### Utilisation
- Rendez-vous sur [http://localhost:3000](http://localhost:3000)
- Remplissez le formulaire (nom, description, montant, carte bancaire)
- Après paiement, téléchargez la facture PDF générée

### Personnalisation
- Modifiez l'adresse ou les champs dans `server.js` si besoin

### Fonctionnalités
- Paiement sécurisé via Stripe
- Génération automatique de factures PDF personnalisées
- Numérotation incrémentale des factures (ex : FAC-2025-0001)
- Téléchargement de la facture après paiement
- Interface responsive et moderne

---

## 🇬🇧 Usage (English)

### Prerequisites
- Node.js (v16+ recommended)
- A Stripe account (to get your API keys)

### Installation
1. Clone this repo or copy the files to your machine.
2. Go to the project folder:
   ```bash
   cd invoice-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file at the root with your Stripe keys:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLIC_KEY=pk_test_...
   PORT=3000
   ```

### Start the app
```bash
node server.js
```

### Usage
- Go to [http://localhost:3000](http://localhost:3000)
- Fill in the form (name, description, amount, card)
- After payment, download the generated PDF invoice

### Customization
- Edit the address or fields in `server.js` if needed

### Features
- Secure payment via Stripe
- Automatic generation of custom PDF invoices
- Incremental invoice numbering (e.g. FAC-2025-0001)
- Download invoice after payment
- Modern, responsive interface
