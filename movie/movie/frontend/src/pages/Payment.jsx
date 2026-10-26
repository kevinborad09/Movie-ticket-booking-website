import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Payment() {
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const [pending, setPending] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = sessionStorage.getItem("cinebook_pending");
    if (!data) {
      navigate("/", { replace: true });
      return;
    }
    setPending(JSON.parse(data));
  }, [navigate]);

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const validatePayment = () => {
    switch (paymentMethod) {
      case "card":
        if (card.number.replace(/\s/g, "").length < 16) return "Enter a valid 16-digit card number";
        if (card.expiry.length < 5) return "Enter a valid expiry date";
        if (card.cvv.length < 3) return "Enter a valid CVV";
        if (!card.name.trim()) return "Enter cardholder name";
        return null;
      case "upi":
        if (!upi.trim() || !upi.includes("@")) return "Enter a valid UPI ID (e.g. name@upi)";
        return null;
      case "netbanking":
        if (!bank) return "Select a bank";
        return null;
      case "wallet":
        if (!wallet) return "Select a wallet";
        return null;
      default:
        return "Select a payment method";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validatePayment();
    if (validationError) return setError(validationError);

    setProcessing(true);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const res = await authFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ showId: pending.showId, seats: pending.seats }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      sessionStorage.removeItem("cinebook_pending");
      navigate(`/booking/confirmation/${data.data.id}`, { replace: true });
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (!pending) return null;

  const { showData, seats, totalAmount } = pending;
  const convenienceFee = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + convenienceFee;

  const paymentMethods = [
    { id: "card", label: "💳 Card", desc: "Credit / Debit" },
    { id: "upi", label: "📱 UPI", desc: "GPay, PhonePe" },
    { id: "netbanking", label: "🏦 Net Banking", desc: "All Major Banks" },
    { id: "wallet", label: "👛 Wallet", desc: "Digital Wallets" },
  ];

  const banks = [
    { id: "sbi", name: "State Bank of India" },
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "axis", name: "Axis Bank" },
    { id: "kotak", name: "Kotak Mahindra Bank" },
    { id: "pnb", name: "Punjab National Bank" },
    { id: "bob", name: "Bank of Baroda" },
    { id: "yes", name: "Yes Bank" },
  ];

  const wallets = [
    { id: "paytm", name: "Paytm", icon: "💰" },
    { id: "phonepe", name: "PhonePe", icon: "📱" },
    { id: "amazonpay", name: "Amazon Pay", icon: "🛒" },
    { id: "mobikwik", name: "MobiKwik", icon: "💳" },
    { id: "freecharge", name: "Freecharge", icon: "⚡" },
  ];

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          <h1 className="page-title">Payment</h1>

          <div className="payment-layout">
            {/* Order Summary */}
            <div className="payment-summary">
              <h2 className="payment-summary__title">Order Summary</h2>
              <div className="payment-summary__movie">
                <img src={showData.movie.poster} alt={showData.movie.title} className="payment-summary__poster" />
                <div>
                  <h3>{showData.movie.title}</h3>
                  <p>{showData.theatre?.name || showData.theatreName} • {showData.screenName}</p>
                  <p>{showData.date} • {showData.time}</p>
                </div>
              </div>
              <div className="payment-summary__detail">
                <span>Seats: {seats.sort().join(", ")}</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="payment-summary__detail">
                <span>Convenience Fee</span>
                <span>₹{convenienceFee.toLocaleString("en-IN")}</span>
              </div>
              <div className="payment-summary__total">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-card-form">
              <h2 className="payment-card-form__title">Choose Payment Method</h2>

              {/* Method Tabs */}
              <div className="payment-tabs">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    className={`payment-tab ${paymentMethod === m.id ? "payment-tab--active" : ""}`}
                    onClick={() => { setPaymentMethod(m.id); setError(""); }}
                    type="button"
                  >
                    <span className="payment-tab__label">{m.label}</span>
                    <span className="payment-tab__desc">{m.desc}</span>
                  </button>
                ))}
              </div>

              {error && <div className="auth-error">{error}</div>}

              {processing ? (
                <div className="payment-processing">
                  <div className="loading-spinner" />
                  <p className="loading-text">Processing your payment...</p>
                  <p className="payment-processing__sub">Please do not close this page</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="auth-form">

                  {/* Card Form */}
                  {paymentMethod === "card" && (
                    <>
                      <div className="auth-field">
                        <label htmlFor="card-name">Cardholder Name</label>
                        <input id="card-name" type="text" placeholder="John Doe" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                      </div>
                      <div className="auth-field">
                        <label htmlFor="card-number">Card Number</label>
                        <input id="card-number" type="text" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} />
                      </div>
                      <div className="auth-row">
                        <div className="auth-field">
                          <label htmlFor="card-expiry">Expiry</label>
                          <input id="card-expiry" type="text" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} />
                        </div>
                        <div className="auth-field">
                          <label htmlFor="card-cvv">CVV</label>
                          <input id="card-cvv" type="password" placeholder="•••" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* UPI Form */}
                  {paymentMethod === "upi" && (
                    <>
                      <div className="upi-options">
                        <button type="button" className={`upi-quick-btn ${upi === "success@upi" ? "upi-quick-btn--active" : ""}`} onClick={() => setUpi("success@upi")}>
                          <span className="upi-quick-btn__icon">📱</span> Google Pay
                        </button>
                        <button type="button" className={`upi-quick-btn ${upi === "pay@phonepe" ? "upi-quick-btn--active" : ""}`} onClick={() => setUpi("pay@phonepe")}>
                          <span className="upi-quick-btn__icon">💜</span> PhonePe
                        </button>
                        <button type="button" className={`upi-quick-btn ${upi === "pay@paytm" ? "upi-quick-btn--active" : ""}`} onClick={() => setUpi("pay@paytm")}>
                          <span className="upi-quick-btn__icon">💰</span> Paytm UPI
                        </button>
                      </div>
                      <div className="payment-divider">
                        <span>or enter UPI ID</span>
                      </div>
                      <div className="auth-field">
                        <label htmlFor="upi-id">UPI ID</label>
                        <input id="upi-id" type="text" placeholder="yourname@upi" value={upi} onChange={(e) => setUpi(e.target.value)} />
                      </div>
                    </>
                  )}

                  {/* Net Banking Form */}
                  {paymentMethod === "netbanking" && (
                    <>
                      <p className="payment-section-label">Select Your Bank</p>
                      <div className="bank-grid">
                        {banks.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            className={`bank-option ${bank === b.id ? "bank-option--active" : ""}`}
                            onClick={() => setBank(b.id)}
                          >
                            <span className="bank-option__icon">🏦</span>
                            <span className="bank-option__name">{b.name}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Wallet Form */}
                  {paymentMethod === "wallet" && (
                    <>
                      <p className="payment-section-label">Select Wallet</p>
                      <div className="wallet-grid">
                        {wallets.map((w) => (
                          <button
                            key={w.id}
                            type="button"
                            className={`wallet-option ${wallet === w.id ? "wallet-option--active" : ""}`}
                            onClick={() => setWallet(w.id)}
                          >
                            <span className="wallet-option__icon">{w.icon}</span>
                            <span className="wallet-option__name">{w.name}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <button type="submit" className="btn btn--primary auth-submit">
                    Pay ₹{grandTotal.toLocaleString("en-IN")}
                  </button>

                  <p className="payment-secure-note">🔒 Your payment is secured with 256-bit encryption</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Payment;
