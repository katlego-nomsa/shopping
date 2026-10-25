import { useEffect, useState, type ChangeEvent } from "react";

// how long a revealed password stays visible (in milliseconds)
const SHOW_PASSWORD_MS = 3000;

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function FormInput({ label, name, type = "text", value, placeholder, onChange }: FormInputProps) {
  const isPassword = type === "password";

  // useState: only this input needs to know if the password is showing
  const [isVisible, setIsVisible] = useState(false);

  // hide the password again after a few seconds
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setIsVisible(false), SHOW_PASSWORD_MS);
    return () => clearTimeout(timer); // stop the timer if the user hides it first
  }, [isVisible]);

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div className="input-wrapper">
        <input
          id={name}
          name={name}
          type={isPassword && isVisible ? "text" : type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={isPassword ? "has-toggle" : undefined}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            onClick={() => setIsVisible((current) => !current)}
          >
            {isVisible ? (
              // eye with a line through it: click to hide
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // open eye: click to show
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default FormInput;