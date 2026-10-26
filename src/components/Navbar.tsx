import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logoutUser } from "../store/userSlice";

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="logo">
        <span className="logo-mark" aria-hidden="true" />
        SHOPLIST
      </div>
      <nav className="app-nav">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
        <button onClick={handleLogout}>Log out</button>
      </nav>
    </header>
  );
}

export default Navbar;