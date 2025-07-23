# 💸 PayPact

**PayPact** is a group expense tracker and Razorpay-integrated payment platform built with React, Django, and JWT authentication. It simplifies expense splitting in groups and helps members settle debts transparently and securely.

---

## 🧩 Features

- 🧾 Create and manage expense groups
- ➕ Add expenses and assign payers
- ⚖️ Smart settlement - Debt Simplification Algorithm
- 📉 Track individual balances (who owes whom)
- 💳 One-click Razorpay payments 
- 🔐 JWT authentication (secure API access)
- ✅ Track payment status (Paid / Unpaid)

---

## 🛠️ Tech Stack

### 🔹 Frontend (React)
- React.js 
- Tailwind CSS
- Axios
- React Hot Toast

### 🔸 Backend (Django + DRF)
- Django REST Framework
- JWT Authentication (`djangorestframework-simplejwt`)
- Razorpay SDK for payments
- SQLite

---

### 🔐 Authentication (JWT)
PayPact uses JWT (JSON Web Tokens) to secure API endpoints.

Login via /api/token/ to receive access and refresh tokens.

Include the access token in API headers:
Authorization: Bearer <access_token>

### 💳 Payments with Razorpay
Clicking “Pay Now” opens the Razorpay modal - in Test Mode

After successful payment, the split is marked as Paid.

Uses Razorpay Order & Payment ID verification for security.


## 🧠 How It Works
Create a group and invite members.

Add expenses and specify the payer.

System splits expenses equally and calculates debts.

Members can pay using Razorpay directly.

Status updates automatically post-verification.

## 👨‍💻 Authors:
Rahul Malaikani, Madussree Ravi
