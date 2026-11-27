import { ProductCard } from "./ProductCard";
import styles from "./ProductCard.module.css";
import { useGetProductsQuery } from "./catalogApi";
import { formatEuro, priceWithTax } from "../../lib/money";

export function CatalogPage() {
  const { data, isLoading, error } = useGetProductsQuery();
  if (isLoading) return <p>Cargando productos...</p>;
  if (error) return <p>No se han podido cargar los productos.</p>;
  if (data?.length === 0) return <p>Todavía no hay productos</p>;

  return (
    <section className={styles.cardContainer}>
      {data?.map((product) => (
        <ProductCard
          key={product.id}
          imgURL={product.imgURL}
          title={product.title}
          description={product.description}
          price={formatEuro(priceWithTax(Number(product.basePrice), Number(product.taxRate)))}
        ></ProductCard>
      ))}
    </section>
  );
}
