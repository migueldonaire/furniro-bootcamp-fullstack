import logo from "../../assets/images/logo.png";
import styles from "./Header-BreadCrumb.module.css";

type HeaderBreadcrumbProps = {
  title: string;
  breadcrumbs: readonly { label: string; to?: string }[];
};

export function HeaderBreadcrumb({ title, breadcrumbs }: HeaderBreadcrumbProps) {
  return (
    <div className={styles.banner}>
      <img className={styles.logo} src={logo} alt="" />
      <h1>{title}</h1>
      <nav aria-label="Ruta de navegación">
        <ol className={styles.breadcrumbs}>
          {breadcrumbs.map(({ label, to }, index) => (
            <li key={to ?? label}>
              {index > 0 && <span aria-hidden="true"> › </span>}
              {to ? <a href={to}>{label}</a> : <span aria-current="page">{label}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
