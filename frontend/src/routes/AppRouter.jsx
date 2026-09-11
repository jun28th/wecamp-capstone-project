import { Route, Routes } from "react-router-dom";
import Signup from "../pages/Signup";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import ToDo from "../pages/ToDo";
import Cycle from "../pages/Cycle";

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/to-do" element={<ToDo />} />
        <Route path="/cycle" element={<Cycle />} />
        <Route path="/auth">
          <Route path="sign-up" element={<Signup />} />
          <Route path="sign-in" element={<Signin />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;
