import { useState } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";

function Signup() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>   
            <div className="bg-(--color-surface-alt) rounded-card shadow-(--shadow-1) px-7 py-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold m-0 mb-1">Create your account</h1>
                    <p className="text-sm text-(--muted) m-0">Start planning your way</p>
                </div>

                <form className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm font-semibold mb-1.5">Email</p>
                        <input 
                            type="email" 
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-[15px] px-4 py-3 rounded-(--radius-input) border-[1.5px] border-(--border) bg-(--color-surface-alt) text-(--fg) placeholder:text-(--muted) focus:outline-none focus:border-primary-deep focus:ring-[3px] focus:ring-[rgba(255,175,204,0.35)]"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-1.5">Full Name</p>
                        <input 
                            type="text" 
                            placeholder="Your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full text-[15px] px-4 py-3 rounded-(--radius-input) border-[1.5px] border-(--border) bg-(--color-surface-alt) text-(--fg) placeholder:text-(--muted) focus:outline-none focus:border-primary-deep focus:ring-[3px] focus:ring-[rgba(255,175,204,0.35)]"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-1.5">Password</p>
                        <input 
                            type="password" 
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-[15px] px-4 py-3 rounded-(--radius-input) border-[1.5px] border-(--border) bg-(--color-surface-alt) text-(--fg) placeholder:text-(--muted) focus:outline-none focus:border-primary-deep focus:ring-[3px] focus:ring-[rgba(255,175,204,0.35)]"
                        />
                    </div>

                    <Button>
                        <p>Sign up</p>
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