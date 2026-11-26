import { useGetAdminProductsQuery, type ProductStatus } from "./productsApi";
import { formatEuro } from "../../lib/money";
import { useEffect, useState } from "react";
import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const {
    data: products,
    isLoading,
    isError,
  } = useGetAdminProductsQuery({
    status: status || undefined,
    search: debouncedSearch || undefined,
  });
  return (
    <section>
      <div>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Productos</h1>
            <p className={styles.subtitle}>
              Administra tus productos, edita información y controla el stock.
            </p>
          </div>

          <button type="button" className={styles.addButton}>
            + Agregar producto
          </button>
        </div>
      </div>
      <div className={styles.filtersSearch}>
        <div className={styles.searchBox}>
          <label className={styles.visuallyHidden} htmlFor="product-search">
            Buscar:
          </label>
          <input
            className={styles.fieldSearch}
            type="search"
            id="product-search"
            placeholder="Buscar productos por nombres o por SKU"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div>
          <label className={styles.visuallyHidden} htmlFor="category-filter">
            Categoría:
          </label>
          <select className={styles.field} id="category-filter">
            <option value="">Todas las categorías</option>
          </select>
        </div>
        <div>
          <label className={styles.visuallyHidden} htmlFor="status-filter">
            Estado:
          </label>
          <select
            className={styles.field}
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as "" | ProductStatus)}
          >
            <option value={""}>Todos</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Desactivados</option>
          </select>
        </div>
        <div>
          <label className={styles.visuallyHidden} htmlFor="sort-filter">
            Ordenar por:
          </label>
          <select className={styles.field} id="sort-filter">
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
          </select>
        </div>
      </div>
      {isLoading && <p>Cargando productos...</p>}
      {products?.length === 0 && <p>No hay productos disponibles.</p>}
      {isError && <p>Error al cargar los productos.</p>}
      {products && products.length > 0 && (
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio sin IVA</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} width="50" />
                  ) : (
                    <span>No hay imagen</span>
                  )}
                </td>
                <td>
                  <p>{product.name}</p> <small>SKU: {product.sku}</small>
                </td>
                <td>{product.categoryName}</td>
                <td>{formatEuro(Number(product.basePrice))}</td>
                <td>{product.stock}</td>
                <td>{product.status === "ACTIVE" ? "Activo" : "Desactivado"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
