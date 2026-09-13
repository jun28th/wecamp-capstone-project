import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { ToastProvider } from "../components/Toast";

function MainLayout() {
    const location = useLocation();
    const isAuthPage = location.pathname.startsWith("/auth");

    if (isAuthPage) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg">
                <main className="w-full max-w-100">
                <Link
                    to="/"
                    className="flex justify-center items-center gap-2 shrink-0 no-underline text-[var(--color-primary-deep)] font-[var(--font-display)] text-2xl font-semibold mb-5"
                    style={{ fontVariationSettings: "'WONK' 1" }}
                    data-od-id="nav-logo"
                >
                    <img src={"/logo.png"} alt="Winx logo" className="w-8 h-8" />
                    <span>Winx</span>
                </Link>
                    <Outlet/>
                </main>
            </div>
        );
    }

    return (
        <div>
           <Header />
      <ToastProvider>
        <main className="app-shell">
          <Outlet />
        </main>
      </ToastProvider>
        </div>
    )
}


export default MainLayout;

