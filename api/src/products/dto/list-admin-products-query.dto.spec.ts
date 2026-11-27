import "reflect-metadata"; // los decoradores (@Type, @IsIn...) la necesitan; Nest no la carga en este test
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ListAdminProductsQueryDto } from "./list-admin-products-query.dto";

// Hace lo mismo que el ValidationPipe: convierte la query y devuelve los campos con error
async function invalidFields(query: Record<string, string>) {
  const dto = plainToInstance(ListAdminProductsQueryDto, query);
  const errors = await validate(dto);
  return errors.map((error) => error.property);
}

describe("ListAdminProductsQueryDto", () => {
  it("una query correcta no da errores", async () => {
    // Dado: una query como la que manda el backoffice (todo llega como texto)
    const query = { page: "2", limit: "6", status: "ACTIVE", sort: "priceAsc" };

    // Cuando: la validamos
    const fields = await invalidFields(query);

    // Entonces: no hay errores, así que la petición pasa
    expect(fields).toEqual([]);
  });

  it("sin filtros tampoco da errores (todos son opcionales)", async () => {
    // Dado / Cuando: una petición sin query
    const fields = await invalidFields({});

    // Entonces: vale, el servicio pondrá página 1 y límite 6
    expect(fields).toEqual([]);
  });

  it("un estado que no existe da 400", async () => {
    // Dado / Cuando: ?status=HOLA
    const fields = await invalidFields({ status: "HOLA" });

    // Entonces: falla el campo status
    expect(fields).toEqual(["status"]);
  });

  it("un orden que no existe da 400", async () => {
    // Dado / Cuando: ?sort=hola
    const fields = await invalidFields({ sort: "hola" });

    // Entonces: falla el campo sort
    expect(fields).toEqual(["sort"]);
  });

  it("una categoría que no es un UUID da 400 (antes daba 500)", async () => {
    // Dado / Cuando: ?category=hola
    const fields = await invalidFields({ category: "hola" });

    // Entonces: falla category y la consulta nunca llega a la base de datos
    expect(fields).toEqual(["category"]);
  });

  it("no se pueden pedir más de 50 productos por página", async () => {
    // Dado / Cuando: ?limit=100
    const fields = await invalidFields({ limit: "100" });

    // Entonces: falla limit por el @Max(50)
    expect(fields).toEqual(["limit"]);
  });

  it("la página 0 no existe", async () => {
    // Dado / Cuando: ?page=0
    const fields = await invalidFields({ page: "0" });

    // Entonces: falla page por el @Min(1)
    expect(fields).toEqual(["page"]);
  });
});
