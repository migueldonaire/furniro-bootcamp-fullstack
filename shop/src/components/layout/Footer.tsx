import { useGetHealthQuery } from "../../app/api";

// Shows the version of the web and of the API: useful to check a deploy
export function Footer() {
  const { data, isError } = useGetHealthQuery();
  const webVersion = import.meta.env.VITE_APP_VERSION ?? "dev";

  return (
    <footer className="footer">
      <small>
        Web {webVersion} · API {isError ? "sin conexión" : (data?.version ?? "...")}
      </small>
    </footer>
  );
}
