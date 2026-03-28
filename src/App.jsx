import React, { useEffect, useMemo, useState } from "react";

const restaurantsData = [
  {
    name: "Pizza Palace",
    type: "Italian",
    price: "₹300 for two",
    priceValue: 300,
    badge: "4.5 ★ • 30 mins",
    tags: ["Pure veg", "25% OFF"],
    image: "/pizza.jpg",
  },
  {
    name: "Biryani House",
    type: "Mughlai",
    price: "₹400 for two",
    priceValue: 400,
    badge: "4.2★ • 30 mins",
    tags: ["Popular", "Express"],
    image: "/biryani.jpg",
  },
  {
    name: "China Town",
    type: "Chinese",
    price: "₹250 for two",
    priceValue: 250,
    badge: "4.3★ • 30 mins",
    tags: ["Combo", "Fast"],
    image: "/chinesnoodles.jpg",
  },
  {
    name: "Sweets & More",
    type: "Desserts",
    price: "₹200 for two",
    priceValue: 200,
    badge: "4.4★ • 30 mins",
    tags: ["Desserts", "15% OFF"],
    image: "/sweets.jpg",
  },
  {
    name: "Wrap It!",
    type: "Fast Food",
    price: "₹180 for two",
    priceValue: 180,
    badge: "4.7★ • 30 mins",
    tags: ["Quick Bites", "Under 30"],
    image: "/wrap%20it.jpg",
  },
  {
    name: "Salad Stop",
    type: "Healthy",
    price: "₹350 for two",
    priceValue: 350,
    badge: "4.5★ • 30 mins",
    tags: ["Healthy", "Fresh"],
    image: "/salad%20stop.jpg",
  },
];

const categoryData = [
  "Pizza",
  "Biryani",
  "Chinese",
  "Desserts",
  "Beverages",
  "Healthy",
];

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const checkPasswordStrength = (password) => {
  const checks = [
    /.{8,}/,
    /[a-z]/,
    /[A-Z]/,
    /\d/,
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  ];
  const value = checks.reduce(
    (acc, rx) => acc + (rx.test(password) ? 1 : 0),
    0,
  );
  const missing = [];
  if (!/.{8,}/.test(password)) missing.push("8 characters");
  if (!/[a-z]/.test(password)) missing.push("lowercase");
  if (!/[A-Z]/.test(password)) missing.push("uppercase");
  if (!/\d/.test(password)) missing.push("number");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    missing.push("special char");
  return { score: value, missing };
};

const validateEmail = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

function App() {
  const [users, setUsers] = useState(() =>
    JSON.parse(localStorage.getItem("users") || "[]"),
  );
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser") || "null"),
  );
  const [orders, setOrders] = useState(() =>
    JSON.parse(localStorage.getItem("orders") || "[]"),
  );
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [authTab, setAuthTab] = useState("signin");

  const [signinForm, setSigninForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordInfo, setPasswordInfo] = useState({ score: 0, missing: [] });
  const [authErrors, setAuthErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    signin: false,
    signup: false,
    signupConfirm: false,
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const authButtonText = currentUser ? "Sign Out" : "Sign In";

  const passwordStrengthClasses = useMemo(() => {
    if (passwordInfo.score <= 2) return "strength-weak";
    if (passwordInfo.score <= 4) return "strength-medium";
    return "strength-strong";
  }, [passwordInfo]);

  const openAuth = () => {
    if (currentUser) {
      if (window.confirm("Do you want to sign out?")) {
        setCurrentUser(null);
      }
      return;
    }
    setIsAuthOpen(true);
    setAuthTab("signin");
    setAuthErrors({});
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    setSigninForm({ email: "", password: "" });
    setSignupForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAuthErrors({});
    setPasswordInfo({ score: 0, missing: [] });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const email = signinForm.email.trim().toLowerCase();
    const password = signinForm.password;

    const errors = {};
    if (!validateEmail(email)) errors.signinEmail = "Please enter valid email";
    if (!password) errors.signinPassword = "Please enter password";

    if (Object.keys(errors).length) {
      setAuthErrors(errors);
      return;
    }

    const existingUser = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!existingUser) {
      setAuthErrors({ signinAuth: "Invalid email or password" });
      return;
    }

    setCurrentUser(existingUser);
    setIsAuthOpen(false);
    setAuthErrors({});
    alert(`Welcome back, ${existingUser.name}!`);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const name = signupForm.name.trim();
    const email = signupForm.email.trim().toLowerCase();
    const password = signupForm.password;
    const confirmPassword = signupForm.confirmPassword;

    const errors = {};
    if (name.length < 2) errors.signupName = "Name must be 2+ characters";
    if (!validateEmail(email)) errors.signupEmail = "Enter a valid email";
    if (!PASSWORD_REGEX.test(password))
      errors.signupPassword =
        "Password must have 8+ chars, upper, lower, number, special";
    if (password !== confirmPassword)
      errors.signupConfirmPassword = "Passwords must match";

    if (users.some((u) => u.email === email)) {
      errors.signupEmail = "Email already registered";
    }

    if (Object.keys(errors).length) {
      setAuthErrors(errors);
      return;
    }

    const newUser = { name, email, password };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthOpen(false);
    setAuthErrors({});
    alert(`Account created: ${name}`);
  };

  const handlePasswordInput = (value) => {
    setSignupForm((prev) => ({ ...prev, password: value }));
    setPasswordInfo(checkPasswordStrength(value));
    setAuthErrors((prev) => ({ ...prev, signupPassword: null }));
  };

  const handleAddToCart = (restaurantName) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      setAuthTab("signin");
      return;
    }
    const existing = orders.find((order) => order.name === restaurantName);
    if (existing) {
      alert(`You have already added ${restaurantName} to cart!`);
      return;
    }
    const restaurant = restaurantsData.find((r) => r.name === restaurantName);
    setOrders((prev) => [
      ...prev,
      { name: restaurantName, price: restaurant.priceValue },
    ]);
    alert(`${restaurantName} added to cart!`);
  };

  const handleRemoveFromCart = (restaurantName) => {
    setOrders((prev) => prev.filter((order) => order.name !== restaurantName));
  };

  const handleCheckout = () => {
    if (orders.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const total = orders.reduce((sum, order) => sum + order.price, 0);
    alert(
      `${currentUser.name}, your order totaling ₹${total} has been placed!`,
    );
    setOrders([]);
    setIsCartOpen(false);
  };

  return (
    <>
      <header className="topbar">
        <div className="container top-inner">
          <div className="brand">
            <div className="logo">
              swig<span>gy</span>
            </div>
          </div>

          <div className="search-area">
            <div className="location">
              <span className="loc-emoji">📍</span>
              <input
                type="text"
                placeholder="Enter delivery location"
                aria-label="location"
              />
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for restaurants, dishes or cuisines"
                aria-label="search"
              />
            </div>
          </div>

          <nav className="nav-actions">
            <button className="btn ghost">Offers</button>
            <button className="btn ghost">Help</button>
            {currentUser && (
              <button className="btn ghost" onClick={() => setIsCartOpen(true)}>
                Cart ({orders.length})
              </button>
            )}
            <button className="btn primary" onClick={openAuth}>
              {authButtonText}
            </button>
          </nav>
        </div>
      </header>

      {isAuthOpen && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <span className="close" onClick={closeAuth}>
              &times;
            </span>
            <div className="auth-tabs">
              <button
                className={`tab ${authTab === "signin" ? "active" : ""}`}
                onClick={() => setAuthTab("signin")}
              >
                Sign In
              </button>
              <button
                className={`tab ${authTab === "signup" ? "active" : ""}`}
                onClick={() => setAuthTab("signup")}
              >
                Sign Up
              </button>
            </div>
            {authTab === "signin" ? (
              <div className="auth-form">
                <h2>Sign In</h2>
                <form id="signin-form-element" onSubmit={handleSignIn}>
                  <label htmlFor="signin-email">Email:</label>
                  <input
                    id="signin-email"
                    type="email"
                    required
                    value={signinForm.email}
                    onChange={(e) =>
                      setSigninForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  {authErrors.signinEmail && (
                    <div className="error-message">
                      {authErrors.signinEmail}
                    </div>
                  )}

                  <label htmlFor="signin-password">Password:</label>
                  <div className="password-container">
                    <input
                      id="signin-password"
                      type={showPassword.signin ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={signinForm.password}
                      onChange={(e) =>
                        setSigninForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          signin: !prev.signin,
                        }))
                      }
                    >
                      {showPassword.signin ? "Hide" : "Show"}
                    </button>
                  </div>
                  {authErrors.signinPassword && (
                    <div className="error-message">
                      {authErrors.signinPassword}
                    </div>
                  )}
                  {authErrors.signinAuth && (
                    <div className="error-message">{authErrors.signinAuth}</div>
                  )}

                  <button type="submit" className="btn primary">
                    Sign In
                  </button>
                </form>
              </div>
            ) : (
              <div className="auth-form">
                <h2>Sign Up</h2>
                <form id="signup-form-element" onSubmit={handleSignUp}>
                  <label htmlFor="signup-name">Name:</label>
                  <input
                    id="signup-name"
                    type="text"
                    minLength={2}
                    required
                    value={signupForm.name}
                    onChange={(e) =>
                      setSignupForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  {authErrors.signupName && (
                    <div className="error-message">{authErrors.signupName}</div>
                  )}

                  <label htmlFor="signup-email">Email:</label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  {authErrors.signupEmail && (
                    <div className="error-message">
                      {authErrors.signupEmail}
                    </div>
                  )}

                  <label htmlFor="signup-password">Password:</label>
                  <div className="password-container">
                    <input
                      id="signup-password"
                      type={showPassword.signup ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={signupForm.password}
                      onChange={(e) => handlePasswordInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          signup: !prev.signup,
                        }))
                      }
                    >
                      {showPassword.signup ? "Hide" : "Show"}
                    </button>
                  </div>
                  {authErrors.signupPassword && (
                    <div className="error-message">
                      {authErrors.signupPassword}
                    </div>
                  )}

                  <div id="password-strength" className="password-strength">
                    <div className="strength-bar">
                      <div
                        id="strength-fill"
                        className={`strength-fill ${passwordStrengthClasses}`}
                        style={{ width: `${(passwordInfo.score / 5) * 100}%` }}
                      />
                    </div>
                    <span id="strength-text">
                      {passwordInfo.score >= 5
                        ? "Strong password"
                        : `Password strength: ${passwordInfo.missing.join(", ") || "OK"}`}
                    </span>
                  </div>

                  <label htmlFor="signup-confirm-password">
                    Confirm Password:
                  </label>
                  <div className="password-container">
                    <input
                      id="signup-confirm-password"
                      type={showPassword.signupConfirm ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          signupConfirm: !prev.signupConfirm,
                        }))
                      }
                    >
                      {showPassword.signupConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {authErrors.signupConfirmPassword && (
                    <div className="error-message">
                      {authErrors.signupConfirmPassword}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn primary"
                    id="signup-submit-btn"
                  >
                    Sign Up
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <span className="close" onClick={() => setIsCartOpen(false)}>
              &times;
            </span>
            <h2>Your Cart</h2>
            {orders.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {orders.map((order, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                        border: "1px solid #eee",
                        marginBottom: "5px",
                        borderRadius: "8px",
                      }}
                    >
                      <span>{order.name}</span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span>₹{order.price}</span>
                        <button
                          className="btn ghost"
                          onClick={() => handleRemoveFromCart(order.name)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    marginTop: "20px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  Total: ₹{orders.reduce((sum, order) => sum + order.price, 0)}
                </div>
              </>
            )}
            {orders.length > 0 && (
              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button className="btn primary" onClick={handleCheckout}>
                  Checkout
                </button>
                <button className="btn ghost" onClick={() => setOrders([])}>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="sub-navbar container">
        <ul className="nav-categories">
          {categoryData.map((category) => (
            <li key={category}>
              <a href="#">{category}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="hero">
        <div className="container hero-inner">
          <div className="hero-left">
            <h1>Delicious food delivered to your door</h1>
            <p>
              Explore restaurants, quick Biryani, Pizza, Chinese and more —
              curated for you.
            </p>
            <div className="quick-filters">
              {["Pure Veg", "Fast Delivery", "Top Rated", "Offers"].map((f) => (
                <div key={f} className="chip">
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right">
            <div className="delivery-card">
              <div className="delivery-top">
                <div className="circle">🍔</div>
                <div>
                  <div className="small">Your nearest</div>
                  <div className="bold">Food Hub</div>
                </div>
              </div>
              <div className="delivery-items">
                <div className="item">Pizza — 20% off</div>
                <div className="item">Biryani — Popular</div>
                <div className="item">Chinese — Instant</div>
              </div>
              <div className="eta">Avg delivery 30-40 mins</div>
            </div>
          </div>
        </div>
      </div>

      <div className="categories container">
        {categoryData.map((cat) => (
          <div key={cat} className="cat">
            {cat}
          </div>
        ))}
      </div>

      <main className="container restaurants">
        <h2 className="section-title">Popular Near You</h2>
        <div className="grid">
          {restaurantsData.map((item) => (
            <div className="card" key={item.name}>
              <div
                className="card-media"
                style={{
                  backgroundImage: `linear-gradient(120deg, rgba(0,0,0,.25), rgba(0,0,0,.25)), url(${item.image})`,
                }}
              >
                <div className="badge">{item.badge}</div>
              </div>
              <div className="card-body">
                <h3>{item.name}</h3>
                <p className="muted">
                  {item.type} • {item.price}
                </p>
                <div className="tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>• {tag}</span>
                  ))}
                </div>
                <button
                  className="order-btn"
                  onClick={() => handleAddToCart(item.name)}
                  disabled={orders.some((order) => order.name === item.name)}
                >
                  {orders.some((order) => order.name === item.name)
                    ? "In Cart"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div style={{ height: "100%", width: "100%" }}>
        <img
          alt="get the swiggy app banner"
          style={{ height: "100%", width: "100%" }}
          src="/banner%20image.jpg"
        />
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo-col">
            <img src="/swiggy.png" alt="Swiggy" className="footer-logo" />
            <p>© 2025 Swiggy Limited</p>
          </div>
          <div className="footer-col">
            <h3>Company</h3>
            <a href="#">About Us</a>
            <a href="#">Swiggy Corporate</a>
            <a href="#">Careers</a>
            <a href="#">Team</a>
            <a href="#">Swiggy One</a>
            <a href="#">Swiggy Instamart</a>
            <a href="#">Swiggy Dineout</a>
            <a href="#">Minis</a>
            <a href="#">Pyng</a>
          </div>
          <div className="footer-col">
            <h3>Contact us</h3>
            <a href="#">Help & Support</a>
            <a href="#">Partner With Us</a>
            <a href="#">Ride With Us</a>
            <h3 className="mt">Legal</h3>
            <a href="#">Terms & Conditions</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="footer-col">
            <h3>Available in:</h3>
            <a href="#">Bangalore</a>
            <a href="#">Gurgaon</a>
            <a href="#">Hyderabad</a>
            <a href="#">Delhi</a>
            <a href="#">Mumbai</a>
            <a href="#">Pune</a>
          </div>
          <div className="footer-col footer-app">
            <p>Get the app</p>
            <div className="app-buttons">
              <a href="#">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                />
              </a>
              <a href="#">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
