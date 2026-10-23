import { NavLink, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <>
      <header className="app-header">
        <div className="logo">
          <span className="logo-mark" aria-hidden="true" />
          SHOPLIST
        </div>
        <nav className="app-nav">
          <NavLink to="/login" className="nav-link">Log In</NavLink>
          <NavLink to="/register" className="nav-link nav-link-dark">Register</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AuthLayout;