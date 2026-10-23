import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";
import FormInput from "../components/FormInput";
import { getUserByEmail, createUser } from "../utils/api";

function Register() {
  const navigate = useNavigate();

  // form state: a draft that only this page needs, so useState is right
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    cellNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // simple validation
    if (Object.values(formData).some((value) => value.trim() === "")) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!/^\d{10}$/.test(formData.cellNumber)) {
      toast.error("Cell number must be 10 digits");
      return;
    }

    try {
      const email = formData.email.trim().toLowerCase();

      const existing = await getUserByEmail(email);
      if (existing) {
        toast.error("An account with this email already exists");
        return;
      }

      // hash the password before saving, never store it as plain text
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      await createUser({ ...formData, email, password: hashedPassword });
      toast.success("Account created. Please log in.");
      navigate("/login");
    } catch {
      toast.error("Something went wrong. Is the server running?");
    }
  };

  return (
    <div className="auth-card">
      <div>
        <h1>Create your account</h1>
        <p className="subtitle">It takes less than a minute.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} />
        <FormInput label="Surname" name="surname" value={formData.surname} onChange={handleChange} />
        <FormInput label="Cell number" name="cellNumber" type="tel" value={formData.cellNumber} onChange={handleChange} />
        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      <p>
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Register;