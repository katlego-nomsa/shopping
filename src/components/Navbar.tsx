import { Link, useNavigate } from "react-router-dom";
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
    <header>
      <strong>SHOPLIST</strong>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout}>Log out</button>
      </nav>
    </header>
  );
}

export default Navbar;