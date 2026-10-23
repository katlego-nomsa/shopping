import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import FormInput from "./FormInput";
import { CATEGORIES } from "../utils/constants";
import type { ItemFormValues } from "../types";

interface ItemModalProps {
  title: string;
  initialValues: ItemFormValues;
  lockListName?: boolean; // when editing, the list can't change
  onSubmit: (values: ItemFormValues) => void;
  onClose: () => void;
}

function ItemModal({ title, initialValues, lockListName = false, onSubmit, onClose }: ItemModalProps) {
  // form state: a draft, so useState is the right tool
  const [values, setValues] = useState({
    ...initialValues,
    quantity: String(initialValues.quantity),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // turn the chosen picture into text so json-server can store it
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      toast.error("Image must be smaller than 500 KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setValues((prev) => ({ ...prev, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const quantity = Number(values.quantity);

    if (!values.listName.trim() || !values.name.trim()) {
      toast.error("List name and item name are required");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Quantity must be a whole number of 1 or more");
      return;
    }

    onSubmit({ ...values, listName: values.listName.trim(), name: values.name.trim(), quantity });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {lockListName ? (
            <p>List: <strong>{values.listName}</strong></p>
          ) : (
            <FormInput label="List name" name="listName" value={values.listName} placeholder="e.g. Weekly groceries" onChange={handleChange} />
          )}
          <FormInput label="Name" name="name" value={values.name} onChange={handleChange} />
          <FormInput label="Quantity" name="quantity" type="number" value={values.quantity} onChange={handleChange} />

          <div>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={values.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <FormInput label="Notes (optional)" name="notes" value={values.notes} onChange={handleChange} />

          <div>
            <label htmlFor="image">Item image</label>
            <input id="image" type="file" accept="image/*" onChange={handleImage} />
            {values.image && <img src={values.image} alt="Preview" width={48} height={48} />}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemModal;