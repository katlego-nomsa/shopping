import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";
import FormInput from "../components/FormInput";
import { getUserByEmail } from "../utils/api";
import { useAppDispatch } from "../store/hooks";
import { loginUser } from "../store/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const user = await getUserByEmail(formData.email.trim().toLowerCase());

      // compare the typed password with the saved hash
      const passwordMatches = user
        ? await bcrypt.compare(formData.password, user.password)
        : false;

      if (!user || !passwordMatches) {
        toast.error("Incorrect email or password");
        return;
      }

      dispatch(loginUser(user)); // save the user in Redux
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/");
    } catch {
      toast.error("Something went wrong. Is the server running?");
    }
  };

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
        <button type="submit">Log in</button>
      </form>
      <p>
        New here? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;