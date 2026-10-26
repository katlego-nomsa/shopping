import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";
import FormInput from "../components/FormInput";
import PasswordStrength from "../components/PasswordStrength";
import { getUserByEmail, patchUser } from "../utils/api";
import { isStrongPassword } from "../utils/password";

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", cellNumber: "", newPassword: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => value.trim() === "")) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!isStrongPassword(formData.newPassword)) {
      toast.error("Please choose a stronger password");
      return;
    }

    setIsSaving(true);
    try {
      const user = await getUserByEmail(formData.email.trim().toLowerCase());

      // same message for "no such email" and "wrong cell number",
      // so nobody can use this page to find out who has an account
      if (!user || user.cellNumber !== formData.cellNumber.trim()) {
        toast.error("We couldn't match that email and cell number");
        return;
      }

      const hashedPassword = await bcrypt.hash(formData.newPassword, 10);
      await patchUser(user.id, { password: hashedPassword });

      toast.success("Password reset. Please log in.");
      navigate("/login");
    } catch {
      toast.error("Something went wrong. Is the server running?");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="auth-card">
      <div>
        <h1>Reset your password</h1>
        <p className="subtitle">Enter the email and cell number you registered with.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <FormInput label="Cell number" name="cellNumber" type="tel" value={formData.cellNumber} onChange={handleChange} />
        <FormInput label="New password" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} />
        <PasswordStrength password={formData.newPassword} showRulesWhenEmpty />
        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Reset password"}
        </button>
      </form>
      <p>
        Remembered it? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;