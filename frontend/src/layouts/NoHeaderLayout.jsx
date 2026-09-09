import { Outlet } from "react-router-dom";

function NoHeaderLayout() {

    // Navbar, footer, sidebar, etc. will be added here
    return (
        <div>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default NoHeaderLayout;