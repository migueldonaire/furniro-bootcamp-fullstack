import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useLoginMutation } from "./authApi";
import { loggedIn } from "./authSlice";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [error, setError] = useState("");
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!captcha) {
      setError("Confirma que no eres un robot");
      return;
    }

    try {
      const { accessToken } = await login({ email, password }).unwrap();
      dispatch(loggedIn(accessToken));
    } catch (err: any) {
      setError(err?.data?.message || "Credenciales no válidas");
    }
  };

  return (
    <section>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={captcha}
            onChange={(e) => setCaptcha(e.target.checked)}
          />
          {" "}
          Confirmo que no soy un robot
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </section>
  );
}
