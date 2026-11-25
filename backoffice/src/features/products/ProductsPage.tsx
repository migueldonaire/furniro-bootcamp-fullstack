import { useGetAdminProductsQuery } from "./productsApi";
import { formatEuro } from "../../lib/money";

export function ProductsPage() {
  const { data: products, isLoading, isError } = useGetAdminProductsQuery({});

  return (
    <section>
      <div>
        <div>
          <h1>Productos</h1>
          <p>Administra tus productos, edita información y controla el stock.</p>
        </div>
      </div>
      <div>
        <div className="">
          <p>Buscar productos por nombres</p>
        </div>
        <div className="">
          <button>estado</button>
        </div>
      </div>
      {isLoading && <p>Cargando productos...</p>}
      {products?.length === 0 && <p>No hay productos disponibles.</p>}
      {isError && <p>Error al cargar los productos.</p>}
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
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
    </section>
  );
}
