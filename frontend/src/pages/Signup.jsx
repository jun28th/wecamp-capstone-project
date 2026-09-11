import { useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

function validateSignUp({ fullName, email, password }) {
    const errors = {};

    if (!fullName.trim()) {
        errors.fullName = "Full name is required";
    }

    if (!email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid email";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return errors;
}

function Signup() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateSignUp({ fullName, email, password });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setSubmitting(true);
        try {
            const response = await authApi.SignUp({ fullName, email, password });
            localStorage.setItem("token", response.token);
            navigate("/");
        } catch (err) {
            console.error(err.response?.data?.message || err.message);
            setErrors({ form: "Something went wrong. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>   
            <div className="bg-(--color-surface-alt) rounded-card shadow-(--shadow-1) px-7 py-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold m-0 mb-1">Create your account</h1>
                    <p className="text-sm text-(--muted) m-0">Start planning your way</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    <div>
                        <p className="text-sm font-semibold mb-1.5">Full Name</p>
                        <input 
                            type="text" 
                            placeholder="Your full name"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                            }}
                            className="w-full text-[15px] px-4 py-3 rounded-(--radius-input) border-[1.5px] border-(--border) bg-(--color-surface-alt) text-(--fg) placeholder:text-(--muted) focus:outline-none focus:border-primary-deep focus:ring-[3px] focus:ring-[rgba(255,175,204,0.35)]"
                        />
                        {errors.fullName && (
                            <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-1.5">Email</p>
                        <input 
                            type="email" 
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                            className="w-full text-[15px] px-4 py-3 rounded-(--radius-input) border-[1.5px] border-(--border) bg-(--color-surface-alt) text-(--fg) placeholder:text-(--muted) focus:outline-none focus:border-primary-deep focus:ring-[3px] focus:ring-[rgba(255,175,204,0.35)]"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-1.5">Password</p>
                        <input 
                            type="password" 
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                            }}
                            className="w-full text-[15px] px-4 py-3 rounded-(--radius-input) border-[1.5px] border-(--border) bg-(--color-surface-alt) text-(--fg) placeholder:text-(--muted) focus:outline-none focus:border-primary-deep focus:ring-[3px] focus:ring-[rgba(255,175,204,0.35)]"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                        )}
                    </div>

                    {errors.form && (
                        <p className="text-sm text-red-500 text-center">{errors.form}</p>
                    )}

                    <Button disabled={submitting}>
                        <p>{submitting ? "Signing up..." : "Sign up"}</p>
                    </Button>
                </form>
            </div>

            <p className="text-center mt-5 text-sm text-(--muted)">
                Already have an account?{" "}
                <Link to="/auth/sign-in" className="font-semibold text-primary-deep hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    )
}

export default Signup;