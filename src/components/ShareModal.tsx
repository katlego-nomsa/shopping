import { useState, type FormEvent } from "react";
import type { ShoppingList } from "../types";

interface ShareModalProps {
  list: ShoppingList;
  onAdd: (email: string) => Promise<void>;
  onRemove: (email: string) => void;
  onClose: () => void;
}

function ShareModal({ list, onAdd, onRemove, onClose }: ShareModalProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onAdd(email);
    setEmail("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Share "{list.name}"</h3>
          <button type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="share-email">Their email address</label>
          <input
            id="share-email"
            type="email"
            value={email}
            placeholder="friend@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Share</button>
        </form>

        <h4>Shared with</h4>
        {list.sharedWith.length === 0 ? (
          <p>Nobody yet.</p>
        ) : (
          <ul>
            {list.sharedWith.map((shared) => (
              <li key={shared}>
                {shared} <button onClick={() => onRemove(shared)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ShareModal;