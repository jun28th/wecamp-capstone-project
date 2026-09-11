import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {

    // Navbar, footer, sidebar, etc. will be added here
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