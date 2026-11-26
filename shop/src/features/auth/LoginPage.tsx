import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "../../app/hooks";
import { useLoginMutation } from "./authApi";
import { loggedIn } from "./authSlice";
import styles from "./LoginPage.module.css";

const loginSchema = z.object({
  email: z.email("El email no tiene un formato válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
  captcha: z.literal(true, { error: "Confirma que no eres un robot" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Turns the API error into the message the user sees
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
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

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
    } catch (err: unknown) {
      setError("root", { message: getLoginErrorMessage(err) });
    }
  };

  return (
    <section>
      <h1>Iniciar sesión</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          Email
          <input type="email" {...register("email")} />
        </label>
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <label>
          Contraseña
          <input type="password" {...register("password")} />
        </label>
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}

        <label>
          <input type="checkbox" {...register("captcha")} /> Confirmo que no soy un robot
        </label>
        {errors.captcha && <p className={styles.error}>{errors.captcha.message}</p>}

        {errors.root && <p className={styles.error}>{errors.root.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>
    </section>
  );
}