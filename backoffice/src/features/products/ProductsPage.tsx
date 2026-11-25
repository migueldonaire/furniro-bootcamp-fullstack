import { useGetAdminProductsQuery, type ProductStatus } from "./productsApi";
import { formatEuro } from "../../lib/money";
import { useState } from "react";

export function ProductsPage() {
  const [status, setStatus] = useState<ProductStatus | "">("");
  const {
    data: products,
    isLoading,
    isError,
  } = useGetAdminProductsQuery({ status: status || undefined });
  return (
    <section>
      <div>
        <div>
          <h1>Productos</h1>
          <p>Administra tus productos, edita información y controla el stock.</p>
        </div>
      </div>
      <div>
        <div>
          <p>Buscar productos por nombres</p>
        </div>
        <div>
          <label htmlFor="status-filter">Estado:</label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as "" | ProductStatus)}
          >
            <option value={""}>Todos</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Desactivados</option>
          </select>
        </div>
      </div>
      {isLoading && <p>Cargando productos...</p>}
      {products?.length === 0 && <p>No hay productos disponibles.</p>}
      {isError && <p>Error al cargar los productos.</p>}
      {products && products.length > 0 && (
        <table>
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
