import { PASSWORD_RULES, passwordScore } from "../utils/password";

interface PasswordStrengthProps {
  password: string;
  showRulesWhenEmpty?: boolean; // Register shows the rules before typing
}

function PasswordStrength({ password, showRulesWhenEmpty = false }: PasswordStrengthProps) {
  if (!password && !showRulesWhenEmpty) return null;

  const score = passwordScore(password);
  const level = score <= 2 ? "weak" : score <= 4 ? "medium" : "strong";

  return (
    <div className="strength">
      {password && (
        <>
          <div className="strength-bar" aria-hidden="true">
            <div
              className={`strength-fill strength-${level}`}
              style={{ width: `${(score / PASSWORD_RULES.length) * 100}%` }}
            />
          </div>
          <p className="strength-label" aria-live="polite">
            Password strength: <strong>{level}</strong>
          </p>
        </>
      )}
      <ul className="strength-rules">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <li key={rule.label} className={passed ? "rule-ok" : "rule-missing"}>
              {passed ? "✓" : "○"} {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PasswordStrength;