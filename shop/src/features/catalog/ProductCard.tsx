import styles from "./ProductCard.module.css";

type ProductCardProps = {
  imgURL: string | null;
  title: string;
  description: string;
  price: string;
};

export function ProductCard({ imgURL, title, description, price }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className="image-container">
        {imgURL ? (
          <img className={styles.image} src={imgURL} alt={title} />
        ) : (
          <div className={styles.imageEmpty}>No existe imagen</div>
        )}
      </div>
      <div className={styles.cardText}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <p className={styles.price}>{price}</p>
      </div>
    </article>
  );
}
