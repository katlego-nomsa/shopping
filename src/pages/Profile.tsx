import { useState, type ChangeEvent, type FormEvent } from "react";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";
import FormInput from "../components/FormInput";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateUser } from "../store/userSlice";
import { getUserByEmail, getUserById, patchUser } from "../utils/api";
import { toSessionUser } from "../utils/user";

function Profile() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  // two separate drafts, one for each form
  const [details, setDetails] = useState({
    name: currentUser?.name ?? "",
    surname: currentUser?.surname ?? "",
    cellNumber: currentUser?.cellNumber ?? "",
  });
  const [credentials, setCredentials] = useState({
    email: currentUser?.email ?? "",
    newPassword: "",
    currentPassword: "",
  });

  if (!currentUser) return null;

  const handleDetailsChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDetails({ ...details, [e.target.name]: e.target.value });

  const handleCredentialsChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  // update name, surname and cell number
  const handleSaveDetails = async (e: FormEvent) => {
    e.preventDefault();

    if (Object.values(details).some((v) => v.trim() === "")) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/^\d{10}$/.test(details.cellNumber)) {
      toast.error("Cell number must be 10 digits");
      return;
    }

    try {
      const saved = await patchUser(currentUser.id, {
        name: details.name.trim(),
        surname: details.surname.trim(),
        cellNumber: details.cellNumber,
      });
      dispatch(updateUser(toSessionUser(saved)));
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update your profile");
    }
  };

  // update email and/or password (the current password is required)
  const handleSaveCredentials = async (e: FormEvent) => {
    e.preventDefault();

    const newEmail = credentials.email.trim().toLowerCase();
    const emailChanged = newEmail !== currentUser.email;
    const passwordChanged = credentials.newPassword !== "";

    if (!emailChanged && !passwordChanged) {
      toast("Nothing to change");
      return;
    }
    if (!credentials.currentPassword) {
      toast.error("Enter your current password to confirm");
      return;
    }
    if (passwordChanged && credentials.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      // check the current password against the saved hash
      const stored = await getUserById(currentUser.id);
      const matches = await bcrypt.compare(credentials.currentPassword, stored.password);
      if (!matches) {
        toast.error("Current password is incorrect");
        return;
      }

      const changes: { email?: string; password?: string } = {};

      if (emailChanged) {
        const taken = await getUserByEmail(newEmail);
        if (taken && taken.id !== currentUser.id) {
          toast.error("That email is already in use");
          return;
        }
        changes.email = newEmail;
      }
      if (passwordChanged) {
        changes.password = await bcrypt.hash(credentials.newPassword, 10);
      }

      const saved = await patchUser(currentUser.id, changes);
      dispatch(updateUser(toSessionUser(saved)));
      setCredentials({ email: saved.email, newPassword: "", currentPassword: "" });
      toast.success("Login details updated");
    } catch {
      toast.error("Could not update your login details");
    }
  };

  return (
    <div className="page">
      <h1>Your profile</h1>

      <div className="profile-grid">
        <section>
          <h2>Personal details</h2>
          <form onSubmit={handleSaveDetails}>
            <FormInput label="Name" name="name" value={details.name} onChange={handleDetailsChange} />
            <FormInput label="Surname" name="surname" value={details.surname} onChange={handleDetailsChange} />
            <FormInput label="Cell number" name="cellNumber" type="tel" value={details.cellNumber} onChange={handleDetailsChange} />
            <button type="submit">Save profile</button>
          </form>
        </section>

        <section>
          <h2>Login details</h2>
          <form onSubmit={handleSaveCredentials}>
            <FormInput label="Email" name="email" type="email" value={credentials.email} onChange={handleCredentialsChange} />
            <FormInput label="New password (leave blank to keep it)" name="newPassword" type="password" value={credentials.newPassword} onChange={handleCredentialsChange} />
            <FormInput label="Current password (required to save)" name="currentPassword" type="password" value={credentials.currentPassword} onChange={handleCredentialsChange} />
            <button type="submit">Update login details</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Profile;