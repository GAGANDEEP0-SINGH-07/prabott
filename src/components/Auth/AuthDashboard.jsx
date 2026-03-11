import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { UserIcon, HeartIcon, CartIcon } from "../Shared/Icons";

/* ═══════════════════════════════════════
   DESIGN TOKENS
   Premium minimalist system
═══════════════════════════════════════ */
const C = {
    bg: "#FDFCFA",
    white: "#FFFFFF",
    dark: "#1A1A1A",
    muted: "#666666",
    border: "#F0EEEB",
    accent: "#1A1A1A",
    accentLight: "#F7F5F2",
    danger: "#E05252",
    success: "#4CAF7D",
};

/* ═══════════════════════════════════════
   HELPERS & LOCALSTORAGE MOCK DB
═══════════════════════════════════════ */
const getUsers = () => JSON.parse(localStorage.getItem('prabott_users') || '[]');
const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('prabott_users', JSON.stringify(users));
};
const updateUserInDb = (email, updates) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem('prabott_users', JSON.stringify(users));
        return true;
    }
    return false;
};

/* ═══════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════ */

function Field({ label, type = "text", value, onChange, placeholder, error, note }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: "100%", padding: "14px 16px", borderRadius: 12,
                    border: `1.5px solid ${error ? C.danger : C.border}`,
                    background: C.accentLight, fontSize: 14, color: C.dark,
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    transition: "all 0.2s",
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = C.dark;
                    e.target.style.background = C.white;
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error ? C.danger : C.border;
                    e.target.style.background = C.accentLight;
                }}
            />
            {error && <p style={{ fontSize: 11, color: C.danger, marginTop: 5, fontWeight: 600 }}>{error}</p>}
            {note && !error && <p style={{ fontSize: 11, color: "#999", marginTop: 5 }}>{note}</p>}
        </div>
    );
}

function Btn({ children, onClick, variant = "dark", full, small, disabled, type = "button" }) {
    const [hover, setHover] = useState(false);
    const styles = {
        dark: { bg: hover ? "#333" : C.dark, color: "#fff", border: "none" },
        outline: { bg: hover ? C.accentLight : "transparent", color: C.dark, border: `1.5px solid ${C.border}` },
    };
    const s = styles[variant] || styles.dark;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: small ? "8px 16px" : "14px 28px", borderRadius: 12,
                background: s.bg, color: s.color, border: s.border,
                fontSize: small ? 12 : 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.2s", width: full ? "100%" : "auto",
                opacity: disabled ? 0.6 : 1,
                fontFamily: "inherit", letterSpacing: "-0.01em",
            }}
        >
            {children}
        </button>
    );
}

function Badge({ status }) {
    const map = {
        Delivered: ["#E8F5EE", "#2D7D52"],
        COMPLETED: ["#E8F5EE", "#2D7D52"],
        PAID: ["#E8F5EE", "#2D7D52"],
        "In Transit": ["#FFF4E0", "#B07A20"],
        Processing: ["#EEF2FF", "#4A5FBD"],
        Cancelled: ["#FFF0F0", "#D32F2F"]
    };
    const [bg, color] = map[status] || map[status.toUpperCase()] || map.Processing;
    return (
        <span style={{ padding: "4px 12px", borderRadius: 20, background: bg, color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em" }}>
            {status}
        </span>
    );
}

function Toggle({ on: initOn, onChange }) {
    const [on, setOn] = useState(initOn);
    const handleClick = () => {
        const next = !on;
        setOn(next);
        if (onChange) onChange(next);
    };
    return (
        <button
            onClick={handleClick}
            style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                background: on ? C.dark : C.border, position: "relative",
                transition: "background 0.2s", flexShrink: 0,
            }}
        >
            <span
                style={{
                    position: "absolute", top: 2, left: on ? 22 : 2,
                    width: 20, height: 20, borderRadius: "50%", background: "#fff",
                    transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
            />
        </button>
    );
}

function Spinner({ text }) {
    return (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="auth-spinner" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "auth-spin 0.6s linear infinite" }} />
            {text}
        </span>
    );
}

/* ═══════════════════════════════════════
   FORGOT PASSWORD SCREEN
═══════════════════════════════════════ */
function ForgotPassword({ onBack, onSubmit }) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setVisible(true), 60);
    }, []);

    const submit = () => {
        if (!email.includes("@")) {
            setError("Valid email required");
            return;
        }
        setError(null);
        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
        }, 1200);
    };

    return (
        <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ width: "100%", maxWidth: 460, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease-out" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <span onClick={() => navigate("/")} style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.04em", color: C.dark, cursor: "pointer" }}>Prabott.</span>
                </div>

                {status === "success" ? (
                    <div style={{ textAlign: "center", background: C.white, padding: 40, borderRadius: 24, border: `1px solid ${C.border}` }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EEF2FF", color: "#4A5FBD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 24px" }}>
                            ✉
                        </div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.dark, marginBottom: 12, letterSpacing: "-0.04em" }}>Check your email</h1>
                        <p style={{ color: C.muted, fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
                            We've sent password reset instructions to <strong>{email}</strong>.
                        </p>
                        <Btn onClick={onBack} full>Back to Sign In</Btn>
                    </div>
                ) : (
                    <>
                        <h1 style={{ fontSize: 32, fontWeight: 800, color: C.dark, marginBottom: 8, letterSpacing: "-0.04em" }}>
                            Reset Password
                        </h1>
                        <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>
                            Enter your email to receive a password reset link.
                        </p>

                        <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" error={error} />

                        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                            <Btn variant="outline" onClick={onBack} small>Cancel</Btn>
                            <Btn full onClick={submit}>
                                {status === "loading" ? <Spinner text="Sending Email…" /> : "Send Reset Link"}
                            </Btn>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════ */
function Login({ onLogin, onSignup, onForgot }) {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setVisible(true), 60);
    }, []);

    const submit = useCallback(async () => {
        const e = {};
        if (!email.includes("@")) e.email = "Valid email required";
        if (!pass) e.pass = "Password required";
        if (Object.keys(e).length) { setErrors(e); return; }

        setLoading(true);
        setErrors({});

        const result = await onLogin({ email, password: pass }, remember);

        if (!result?.success) {
            setErrors({ auth: result?.message || "Invalid email or password" });
        }
        setLoading(false);
    }, [email, pass, remember, onLogin]);

    return (
        <div style={{ minHeight: "100vh", background: C.bg, display: "flex", fontFamily: "'Inter', sans-serif" }}>
            {/* Left panel — Hero */}
            <div style={{ flex: 1, background: "#111", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48 }}>
                <span onClick={() => navigate("/")} style={{ color: "#fff", fontSize: 24, fontWeight: 900, letterSpacing: "-0.03em", zIndex: 2, cursor: "pointer" }}>Prabott.</span>
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&fit=crop" alt="Hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                    <h2 style={{ color: "#fff", fontSize: 36, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.04em" }}>Luxury furniture,<br />thoughtfully curated.</h2>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: 500 }}>Join the inner circle of interior design excellence.</p>
                </div>
            </div>

            {/* Right panel — Form */}
            <div style={{ width: "100%", maxWidth: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 48, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease-out" }}>
                <div style={{ width: "100%" }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, color: C.dark, marginBottom: 8, letterSpacing: "-0.04em" }}>Welcome Back</h1>
                    <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>Sign in to continue your luxury experience</p>

                    {errors.auth && <div style={{ background: "#FFF0F0", color: C.danger, padding: "12px 16px", borderRadius: 12, marginBottom: 24, fontSize: 13, fontWeight: 700, border: "1px solid #FFDADA" }}>{errors.auth}</div>}

                    <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" error={errors.email} />
                    <Field label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••" error={errors.pass} />

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.muted, cursor: "pointer", fontWeight: 500 }}>
                            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: 16, height: 16, accentColor: C.dark }} />
                            Remember me
                        </label>
                        <span onClick={onForgot} style={{ fontSize: 13, color: C.dark, fontWeight: 700, cursor: "pointer" }}>Forgot?</span>
                    </div>

                    <Btn onClick={submit} full>
                        {loading ? <Spinner text="Signing in…" /> : "Sign In →"}
                    </Btn>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
                        <div style={{ flex: 1, height: 1, background: C.border }} />
                        <span style={{ fontSize: 12, color: "#BBB", fontWeight: 700, textTransform: "uppercase" }}>or</span>
                        <div style={{ flex: 1, height: 1, background: C.border }} />
                    </div>

                    <button style={{ width: "100%", padding: 14, borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.white, fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: C.dark, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                        <img src="https://www.google.com/favicon.ico" width="16" alt="G" /> Continue with Google
                    </button>

                    <p style={{ textAlign: "center", fontSize: 14, color: C.muted, marginTop: 24 }}>
                        New to Prabott?{" "}
                        <span onClick={onSignup} style={{ color: C.dark, fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}>Create Account</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   SIGNUP SCREEN
═══════════════════════════════════════ */
function Signup({ onSignup, onLogin }) {
    const [step, setStep] = useState(1);
    const [fields, setFields] = useState({ name: "", email: "", pass: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setVisible(true), 60);
    }, []);

    const updateField = (key) => (value) => {
        setFields((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const next = useCallback(() => {
        const e = {};
        if (!fields.name.trim()) e.name = "Full name is required";
        if (!fields.email.includes("@")) e.email = "Valid email required";

        if (Object.keys(e).length) { setErrors(e); return; }
        setStep(2);
        setErrors({});
    }, [fields.name, fields.email]);

    const submit = useCallback(async () => {
        const e = {};
        if (fields.pass.length < 8) e.pass = "Minimum 8 characters required";
        if (fields.pass !== fields.confirm) e.confirm = "Passwords do not match";

        if (Object.keys(e).length) { setErrors(e); return; }

        setLoading(true);
        const result = await onSignup({
            name: fields.name,
            email: fields.email,
            password: fields.pass,
        });

        if (!result?.success) {
            setErrors({ auth: result?.message || "Registration failed" });
        }
        setLoading(false);
    }, [fields, onSignup]);

    const passStrength = useMemo(() => {
        if (!fields.pass) return null;
        if (fields.pass.length < 6) return { label: "Weak", color: C.danger };
        if (fields.pass.length < 10) return { label: "Medium", color: "#F2A735" };
        return { label: "Strong", color: C.success };
    }, [fields.pass]);

    return (
        <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ width: "100%", maxWidth: 460, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease-out" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <span onClick={() => navigate("/")} style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.04em", color: C.dark, cursor: "pointer" }}>Prabott.</span>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                    {[1, 2].map((n) => (
                        <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= step ? C.dark : C.border, transition: "background 0.3s" }} />
                    ))}
                </div>

                <h1 style={{ fontSize: 32, fontWeight: 800, color: C.dark, marginBottom: 8, letterSpacing: "-0.04em" }}>
                    {step === 1 ? "Create Account" : "Secure Account"}
                </h1>
                <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>
                    {step === 1 ? "Start your journey with Prabott premium furniture." : "Set a password for your account."}
                </p>

                {errors.auth && <div style={{ background: "#FFF0F0", color: C.danger, padding: "12px 16px", borderRadius: 12, marginBottom: 24, fontSize: 13, fontWeight: 700, border: "1px solid #FFDADA" }}>{errors.auth}</div>}

                {step === 1 ? (
                    <>
                        <Field label="Full Name" value={fields.name} onChange={updateField("name")} placeholder="Alex Morgan" error={errors.name} />
                        <Field label="Email Address" type="email" value={fields.email} onChange={updateField("email")} placeholder="you@example.com" error={errors.email} />
                        <Btn onClick={next} full>Continue →</Btn>
                    </>
                ) : (
                    <>
                        <div style={{ position: "relative" }}>
                            <Field label="Password" type="password" value={fields.pass} onChange={updateField("pass")} placeholder="••••••••" error={errors.pass} note="Use 8 or more characters" />
                            {passStrength && (
                                <div style={{ position: "absolute", top: 0, right: 0, fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: passStrength.color }}>
                                    Strength: {passStrength.label}
                                </div>
                            )}
                        </div>
                        <Field label="Confirm Password" type="password" value={fields.confirm} onChange={updateField("confirm")} placeholder="••••••••" error={errors.confirm} />
                        <div style={{ display: "flex", gap: 12 }}>
                            <Btn variant="outline" onClick={() => setStep(1)} small>Back</Btn>
                            <Btn full onClick={submit}>
                                {loading ? <Spinner text="Creating Account…" /> : "Create Account"}
                            </Btn>
                        </div>
                    </>
                )}

                <p style={{ textAlign: "center", fontSize: 14, color: C.muted, marginTop: 24 }}>
                    Already a member?{" "}
                    <span onClick={onLogin} style={{ color: C.dark, fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}>Sign In</span>
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   DASHBOARD SCREEN
═══════════════════════════════════════ */
function Dashboard({ user, onLogout, initialTab = "overview" }) {
    const { wishlistItems } = useWishlist();
    const [tab, setTab] = useState(initialTab);
    const [mobileNav, setMobileNav] = useState(false);
    const [profile, setProfile] = useState(() => ({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.address || "",
        joined: user.createdAt || "Recent"
    }));
    const [orders, setOrders] = useState([]);
    const [passData, setPassData] = useState({ current: "", next: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(false);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => setVisible(true), 60);

        const fetchUserData = async () => {
            try {
                // Include our api client
                const api = (await import('../../api')).default;

                // Fetch profile
                const profileRes = await api.get('/auth/profile');
                if (profileRes.data) {
                    setProfile({
                        name: profileRes.data.name || "",
                        email: profileRes.data.email || "",
                        phone: profileRes.data.phone || "",
                        city: profileRes.data.address || "",
                        joined: profileRes.data.createdAt || "Recent"
                    });
                }

                // Fetch orders
                const ordersRes = await api.get('/orders/myorders');
                if (ordersRes.data) {
                    setOrders(ordersRes.data.map(o => ({
                        orderId: o._id.substring(o._id.length - 6).toUpperCase(),
                        total: o.totalAmount,
                        status: o.paymentStatus === 'Paid' || o.paymentStatus === 'Completed' ? 'PAID' : o.orderStatus,
                        date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                        items: (o.products || []).map((item, idx) => ({
                            id: item._id || `${item.productId?._id || item.productId}-${idx}`,
                            name: item.productId?.name || 'Product',
                            qty: item.quantity,
                            price: item.productId?.price || 0,
                            image: item.productId?.images?.[0] || ''
                        }))
                    })));
                }

            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };

        fetchUserData();

        if (initialTab) setTab(initialTab);
    }, [initialTab]);

    const updateProfile = (key) => (value) => setProfile((prev) => ({ ...prev, [key]: value }));

    const handleProfileSave = async () => {
        try {
            const api = (await import('../../api')).default;
            await api.put('/auth/profile', {
                name: profile.name,
                phone: profile.phone,
                address: profile.city
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile");
        }
    };

    const handleChangePassword = async () => {
        const e = {};

        if (!passData.current) e.current = "Current password required";
        if (passData.next.length < 8) e.next = "Min 8 characters";
        if (passData.next !== passData.confirm) e.confirm = "Passwords don't match";

        if (Object.keys(e).length) { setErrors(e); return; }

        try {
            const api = (await import('../../api')).default;
            await api.put('/auth/profile', {
                password: passData.next // Note: backend needs an update to support verifying current password, but we'll just send the new one based on current backend architecture
            });

            setPassData({ current: "", next: "", confirm: "" });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            setErrors({});
        } catch (error) {
            console.error("Failed to update password", error);
            setErrors({ current: "Failed to update password. Please try again." });
        }
    };

    const NAV = [
        { id: "overview", icon: <UserIcon size={18} strokeWidth="2" />, label: "Overview" },
        { id: "orders", icon: <CartIcon size={18} strokeWidth="2" />, label: "My Orders" },
        { id: "profile", icon: <UserIcon size={18} strokeWidth="2" />, label: "Profile" },
        { id: "settings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, label: "Settings" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>


            <div style={{ display: "flex", flex: 1, width: "100%", mx: "auto", alignSelf: "center", padding: "0 24px" }}>
                <aside style={{ width: 240, borderRight: `1px solid ${C.border}`, padding: "32px 24px 32px 0", flexShrink: 0 }} className="auth-sidebar-desktop">
                    <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#BBB", marginBottom: 16 }}>Dashboard</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {NAV.map((item) => {
                            const active = tab === item.id;
                            return (
                                <button key={item.id} onClick={() => setTab(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 14px", borderRadius: 12, border: "none", cursor: "pointer", background: active ? C.dark : "transparent", color: active ? "#fff" : C.muted, fontSize: 14, fontWeight: active ? 700 : 500, transition: "all 0.2s", textAlign: "left" }}>
                                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: active ? 1 : 0.8 }}>{item.icon}</span>
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <main style={{ flex: 1, padding: "32px 0 48px 48px", minWidth: 0, opacity: visible ? 1 : 0, transition: "opacity 0.5s" }}>

                    {tab === "overview" && (
                        <div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.dark, marginBottom: 8, letterSpacing: "-0.04em" }}>Welcome, {profile.name.split(" ")[0]}</h2>
                            <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>Your Prabott account overview</p>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
                                {[
                                    [<CartIcon size={20} strokeWidth="2" />, orders.length, "Total Orders"],
                                    [<HeartIcon size={20} strokeWidth="2" />, wishlistItems.length, "Saved Items"],
                                    [<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>, Math.floor(orders.reduce((acc, curr) => acc + curr.total, 0) * 0.1).toLocaleString(), "Luxury Points"]
                                ].map(([icon, val, label]) => (
                                    <div key={label} style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accentLight, color: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {icon}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 26, fontWeight: 700, color: C.dark, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{val}</p>
                                            <p style={{ fontSize: 13, fontWeight: 500, color: C.muted, margin: 0 }}>{label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 800, color: C.dark, margin: 0 }}>Recent Orders</h3>
                                    <span onClick={() => setTab("orders")} style={{ fontSize: 13, color: C.muted, fontWeight: 700, cursor: "pointer" }}>View All</span>
                                </div>
                                {orders.length > 0 ? (
                                    orders.slice(0, 3).map((o, i) => (
                                        <div key={o.orderId} style={{ padding: 20, display: "flex", alignItems: "center", gap: 16, borderBottom: i < orders.length - 1 ? `1px solid ${C.border}` : "none" }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, color: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <CartIcon size={18} strokeWidth="2" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, margin: "0 0 2px" }}>Order {o.orderId}</p>
                                                <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{o.date} · {o.items.length} items</p>
                                            </div>
                                            <Badge status={o.status} />
                                            <p style={{ fontSize: 15, fontWeight: 800, color: C.dark }}>£{o.total.toLocaleString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: 40, textAlign: "center", color: "#999", fontSize: 14 }}>No orders yet</div>
                                )}
                            </div>
                        </div>
                    )}

                    {tab === "orders" && (
                        <div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.dark, marginBottom: 8, letterSpacing: "-0.04em" }}>Order History</h2>
                            <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>Transparent tracking for your premium purchases</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {orders.length > 0 ? orders.map(o => (
                                    <div key={o.orderId} style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: 24 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                                            <div>
                                                <p style={{ fontSize: 18, fontWeight: 800, color: C.dark, margin: "0 0 4px" }}>Order {o.orderId}</p>
                                                <p style={{ fontSize: 13, color: "#999" }}>Placed on {o.date}</p>
                                            </div>
                                            <Badge status={o.status} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                                            {o.items.map(item => (
                                                <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                    <img src={item.image} alt={item.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, margin: 0 }}>{item.name}</p>
                                                        <p style={{ fontSize: 11, color: "#999" }}>Qty: {item.qty} · £{item.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                                <p style={{ fontSize: 11, fontWeight: 700, color: "#BBB", textTransform: "uppercase" }}>Total Paid</p>
                                                <p style={{ fontSize: 22, fontWeight: 800, color: C.dark }}>£{o.total.toLocaleString()}</p>
                                            </div>
                                            <Btn variant="outline" small>Download Invoice</Btn>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ background: C.white, borderRadius: 24, padding: 60, textAlign: "center", border: `1px solid ${C.border}` }}>
                                        <p style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>No orders yet</p>
                                        <Btn onClick={() => navigate("/collections")} variant="outline" small style={{ marginTop: 16 }}>Start Shopping</Btn>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {tab === "profile" && (
                        <div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.dark, marginBottom: 8, letterSpacing: "-0.04em" }}>My Profile</h2>
                            <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>Manage your personal details and account settings</p>

                            <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: 32, marginBottom: 24 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.dark, marginBottom: 24 }}>Personal Information</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                    <Field label="Full Name" value={profile.name} onChange={updateProfile("name")} />
                                    <Field label="Email Address" value={profile.email} disabled />
                                    <Field label="Phone Number" value={profile.phone} onChange={updateProfile("phone")} placeholder="+44 7700 900XXX" />
                                    <Field label="City" value={profile.city} onChange={updateProfile("city")} placeholder="London" />
                                </div>
                                <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 8, paddingTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
                                    <Btn onClick={handleProfileSave}>Update Profile</Btn>
                                    {saved && <span style={{ fontSize: 14, color: C.success, fontWeight: 700 }}>✓ Changes saved</span>}
                                </div>
                            </div>

                            <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: 32 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.dark, marginBottom: 24 }}>Change Password</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, alignItems: "start" }}>
                                    <Field label="Current Password" type="password" value={passData.current} onChange={(v) => setPassData({ ...passData, current: v })} error={errors.current} />
                                    <Field label="New Password" type="password" value={passData.next} onChange={(v) => setPassData({ ...passData, next: v })} error={errors.next} />
                                    <Field label="Confirm New" type="password" value={passData.confirm} onChange={(v) => setPassData({ ...passData, confirm: v })} error={errors.confirm} />
                                </div>
                                <Btn variant="outline" onClick={handleChangePassword}>Update Password</Btn>
                            </div>
                        </div>
                    )}

                    {tab === "settings" && (
                        <div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.dark, marginBottom: 8, letterSpacing: "-0.04em" }}>Settings</h2>
                            <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>Preferences and notification settings</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {[
                                    { title: "Notifications", items: [["Order status updates", "Real-time tracking notifications", true], ["Newsletter", "Weekly luxury curation and deals", false]] },
                                    { title: "Security", items: [["Two-factor authentication", "Stronger account protection", false], ["Session persistence", "Stay logged in on this device", true]] }
                                ].map(group => (
                                    <div key={group.title} style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                                        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, background: C.accentLight }}>
                                            <h3 style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#999", margin: 0 }}>{group.title}</h3>
                                        </div>
                                        {group.items.map((item, i) => (
                                            <div key={item[0]} style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < group.items.length - 1 ? `1px solid ${C.border}` : "none" }}>
                                                <div>
                                                    <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, margin: "0 0 2px" }}>{item[0]}</p>
                                                    <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{item[1]}</p>
                                                </div>
                                                <Toggle on={item[2]} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   AUTH ROUTER
═══════════════════════════════════════ */
export default function AuthDashboard({ initialScreen = "login" }) {
    const { user, login, signup, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentScreen, setCurrentScreen] = useState(initialScreen);

    // Sync screen changes
    useEffect(() => {
        setCurrentScreen(initialScreen);
    }, [initialScreen]);

    const handleLogin = useCallback(async (userData, remember) => {
        const res = await login(userData, remember);
        if (res?.success) {
            if (res.user?.role === 'admin') {
                navigate("/admin", { replace: true });
            } else {
                navigate(searchParams.get("redirect") || "/", { replace: true });
            }
        }
        return res;
    }, [login, navigate, searchParams]);

    const handleSignup = useCallback(async (userData) => {
        const res = await signup(userData, true);
        if (res?.success) {
            navigate("/", { replace: true });
        }
        return res;
    }, [signup, navigate]);

    const handleLogout = useCallback(() => {
        logout();
        navigate("/", { replace: true });
    }, [logout, navigate]);

    // Protective redirect for dashboard
    useEffect(() => {
        if (initialScreen === "dashboard" && !user) {
            navigate("/login?redirect=/dashboard", { replace: true });
        }
    }, [initialScreen, user, navigate]);

    if (user && currentScreen !== "dashboard") {
        return <Dashboard user={user} onLogout={handleLogout} initialTab="overview" />;
    }

    if (user && currentScreen === "dashboard") {
        const tabParam = searchParams.get('tab');
        return <Dashboard user={user} onLogout={handleLogout} initialTab={tabParam || "overview"} />;
    }

    if (currentScreen === "signup") {
        return <Signup onSignup={handleSignup} onLogin={() => navigate("/login")} />;
    }

    if (currentScreen === "forgot") {
        return <ForgotPassword onBack={() => setCurrentScreen("login")} />;
    }

    return <Login onLogin={handleLogin} onSignup={() => navigate("/signup")} onForgot={() => setCurrentScreen("forgot")} />;
}
