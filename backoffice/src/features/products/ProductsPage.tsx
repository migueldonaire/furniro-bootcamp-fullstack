import {
  productCategories,
  type SortOption,
  useGetAdminProductsQuery,
  type ProductStatus,
} from "./productsApi";
import { formatEuro } from "../../lib/money";
import { useEffect, useState } from "react";
import styles from "./ProductsPage.module.css";
import { Pagination } from "../../components/Pagination/Pagination";

export function ProductsPage() {
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
      setPage(1);
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
    category: category || undefined,
    sort: sort || "newest",
    search: debouncedSearch || undefined,
    page: page,
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
            placeholder="Buscar productos por nombre o por SKU"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div>
          <label className={styles.visuallyHidden} htmlFor="category-filter">
            Categoría:
          </label>
          <select
            className={styles.field}
            id="category-filter"
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            value={category}
          >
            <option value={""}>Todas</option>
            {productCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
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
            onChange={(e) => {
              setStatus(e.target.value as "" | ProductStatus);
              setPage(1);
            }}
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
          <select
            onChange={(e) => {
              setSort(e.target.value as SortOption);
              setPage(1);
            }}
            className={styles.field}
            id="sort-filter"
            value={sort}
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="priceAsc">Precio Ascendente</option>
            <option value="priceDesc">Precio Descendente</option>
          </select>
        </div>
      </div>
      {isLoading && <p>Cargando productos...</p>}
      {products?.data.length === 0 && <p>No hay productos disponibles.</p>}
      {isError && <p>Error al cargar los productos.</p>}
      {products && products.data.length > 0 && (
        <>
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
              {products?.data.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <span>No hay imagen</span>
                    )}
                  </td>
                  <td>
                    <strong>{product.name}</strong>{" "}
                    <p>
                      <small>SKU: {product.sku}</small>
                    </p>
                  </td>
                  <td>{product.categoryName}</td>
                  <td>{formatEuro(Number(product.basePrice))}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span
                      className={`${styles.stateBadge} ${product.status === "ACTIVE" ? styles.active : styles.inactive}`}
                    >
                      {product.status === "ACTIVE" ? "Activo" : "Desactivado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(products.pagination.total / products.pagination.limit)}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </section>
  );
}
