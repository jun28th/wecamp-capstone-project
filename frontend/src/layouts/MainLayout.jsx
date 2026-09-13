import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { ToastProvider } from "../components/Toast";

function MainLayout() {
  // Navbar, footer, sidebar, etc. will be added here
  return (
    <div>
      <Header />
      <ToastProvider>
        <main className="app-shell">
          <Outlet />
        </main>
      </ToastProvider>
    </div>
  );
}

export default MainLayout;
