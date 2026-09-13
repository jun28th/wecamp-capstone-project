import { useEffect, useState } from "react";
import Button from "./Button";
import { useAuth } from "../../contexts/authContext";

const NAV_LINKS = [
  { id: "nav-home", label: "Home", path: "/" },
  { id: "nav-todo", label: "To Do", path: "/to-do" },
  { id: "nav-cycle", label: "Cycle", path: "/cycle-logs" },
];

function Header() {
  const { logout } = useAuth();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleNavigate = (event, path) => {
    event.preventDefault();
    if (path === currentPath) return;
    window.location.href = path;
  };

  const handleLogOut = () => {
    logout();
    window.location.href = "/auth/sign-in";
  };
  return (
    <nav
      className="sticky top-0 left-0 right-0 z-[100] px-5 py-3 bg-[var(--color-primary-tint)] border-b-[1.5px] border-[var(--color-primary)]"
      data-od-id="main-header"
    >
      <div className="max-w-[1120px] mx-auto flex items-center justify-between gap-4">
        <a
          href="/"
          className="flex items-center gap-2 flex-shrink-0 no-underline text-[var(--color-primary-deep)] font-[var(--font-display)] text-2xl font-semibold"
          style={{ fontVariationSettings: "'WONK' 1" }}
          data-od-id="nav-logo"
          onClick={(e) => handleNavigate(e, "/")}
        >
          <img src={"/logo.png"} alt="Winx logo" className="w-8 h-8" />
          <span>Winx</span>
        </a>

        <div className="flex flex-1 justify-center gap-0 sm:gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.path}
              data-od-id={link.id}
              className={`flex items-center min-h-[44px] px-2.5 sm:px-4 py-2 rounded-[var(--radius-input)] font-[var(--font-body)] text-[13px] sm:text-[15px] font-semibold text-[var(--color-ink)]  no-underline transition-all duration-150 ease-out hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary-deep)]
                ${link.path === currentPath ? "bg-[var(--color-surface-alt)] text-[var(--color-primary-deep)] shadow-[var(--shadow-1)]" : ""}`}
              onClick={(e) => handleNavigate(e, link.path)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button
          variant="outline"
          className="bg-white text-[var(--color-primary-deep)] hover:bg-[var(--color-primary-deep)] hover:text-white"
          data-od-id="nav-logout"
          onClick={handleLogOut}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}

export default Header;
