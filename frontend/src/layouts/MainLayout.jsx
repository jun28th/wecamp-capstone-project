import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {

    // Navbar, footer, sidebar, etc. will be added here
    return (
        <div>
            <Header/>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default MainLayout;