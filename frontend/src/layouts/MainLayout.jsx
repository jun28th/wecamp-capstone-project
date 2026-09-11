import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {
    const location = useLocation();
    const isAuthPage = location.pathname.startsWith("/auth");

    if (isAuthPage) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg">
                <main className="w-full max-w-100">
                    <Outlet/>
                </main>
            </div>
        );
    }

    return (
        <div>
            <Header/>
            <main className="app-shell">
                <Outlet/>
            </main>
        </div>
    )
}


export default MainLayout;