import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import authApi from "../api/authApi";

function PrivateRoute() {
    const { setUser } = useAuth();
    const [status, setStatus] = useState("checking"); // "checking" | "authenticated" | "unauthenticated"

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setStatus("unauthenticated");
            return;
        }

        authApi.Profile()
            .then((response) => {
                setUser(response.user);
                setStatus("authenticated");
            })
            .catch((err) => {
                console.error(err.response?.data?.message || err.message);
                localStorage.removeItem("token");
                setUser(null);
                setStatus("unauthenticated");
            });
    }, [setUser]);

    if (status === "checking") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <p className="text-sm text-(--muted)">Đang tải...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <Navigate to="/auth/sign-in" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;