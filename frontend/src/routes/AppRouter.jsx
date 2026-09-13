import { Route, Routes } from "react-router-dom";
import Signup from "../pages/Signup";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Cycle from "../pages/Cycle";
function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />

                <Route path="/">
                    <Route path="sign-up" element={<Signup />} />
                    <Route path="sign-in" element={<Signin />} />
                    <Route path="cycle" element={<Cycle/>}/>
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRouter;
