import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../app/api";
import { useAppDispatch } from "../../app/hooks";
import { useLazyGetMeQuery, useLoginMutation } from "./authApi";
import { loggedIn, loggedOut } from "./authSlice";
import styles from "./LoginPage.module.css";

const loginSchema = z.object({
  email: z.email("El email no tiene un formato válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function getLoginErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "status" in err) {
    if (err.status === 429) {
      return "Demasiados intentos. Espera un minuto";
    }
    if (
      "data" in err &&
      typeof err.data === "object" &&
      err.data !== null &&
      "message" in err.data &&
      typeof err.data.message === "string"
    ) {
      return err.data.message;
    }
  }
  return "Credenciales no válidas";
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      const { accessToken } = await login({ email, password }).unwrap();

      dispatch(loggedIn(accessToken));

      const me = await getMe().unwrap();

      if (me.role !== "ADMIN") {
        dispatch(loggedOut());
        dispatch(api.util.resetApiState());
        setError("root", { message: "No tienes permiso para acceder" });
        return;
      }

      navigate("/products");
    } catch (err: unknown) {
      setError("root", { message: getLoginErrorMessage(err) });
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.imagePanel}>
        <span className={styles.accent} aria-hidden="true" />
        <p className={styles.brand}>BackOffice</p>
      </div>

      <div className={styles.formPanel}>
        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>Introduce tus datos para acceder al panel.</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              className={styles.input}
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email")}
            />
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Introduce tu contraseña"
                className={styles.input}
                aria-invalid={errors.password ? "true" : "false"}
                {...register("password")}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          </div>

          {errors.root && (
            <p className={styles.error} role="alert">
              {errors.root.message}
            </p>
          )}

          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
