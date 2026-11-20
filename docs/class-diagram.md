# Furniro — Class Diagram

```mermaid
classDiagram
direction LR

class User {
  +UUID id
  +string name
  +string lastName
  +string email
  +string passwordHash
  +string role
  +string phone
  +date dateOfBirth
  +string language
  +string status
  +datetime createdAt
  +register()
  +login()
  +updateProfile()
}

class UserAddress {
  +UUID id
  +UUID userId
  +string street
  +string city
  +string province
  +string postalCode
  +string country
}

class Category {
  +UUID id
  +string name
  +string description
}

class Product {
  +UUID id
  +UUID categoryId
  +string name
  +string description
  +string sku
  +decimal basePrice
  +decimal taxRate
  +string currency
  +int stock
  +string status
  +datetime createdAt
  +datetime updatedAt
  +updateStock()
  +priceWithTax()
}

class ProductImage {
  +UUID id
  +UUID productId
  +string url
  +int sortOrder
  +boolean isPrimary
}

class Order {
  +UUID id
  +UUID userId
  +datetime orderDate
  +string status
  +decimal shippingCost
  +string currency
  +calculateSubtotal()
  +calculateTaxTotal()
  +calculateTotal()
  +updateStatus()
}

class OrderAddress {
  +UUID id
  +UUID orderId
  +string fullName
  +string street
  +string city
  +string province
  +string postalCode
  +string country
}

class OrderLine {
  +UUID id
  +UUID orderId
  +UUID productId
  +string productName
  +string sku
  +int quantity
  +decimal unitPrice
  +decimal taxRate
  +string currency
  +calculateSubtotal()
  +calculateTax()
  +calculateTotal()
}

User "1" *-- "0..1" UserAddress : default address
User "1" --> "0..*" Order : places
Category "1" --> "0..*" Product : classifies
Product "1" *-- "0..*" ProductImage : images
Order "1" *-- "1" OrderAddress : shipping address
Order "1" *-- "1..*" OrderLine : contains
Product "1" <-- "0..*" OrderLine : historical reference
```

## Notas

- `role`: `CUSTOMER` o `ADMIN`. No hay clases `Customer` ni `Admin`.
- `Product.status`: `ACTIVE` o `INACTIVE`. Eliminar un producto desde el backoffice lo desactiva (borrado lógico); así `OrderLine.productId` siempre apunta a un producto existente.
- `basePrice` es el precio sin IVA. El precio mostrado al cliente se calcula con `priceWithTax()`.
- Subtotales, IVA y total del pedido no se guardan: se calculan con los métodos `calculate…()` a partir de `OrderLine` y `shippingCost`.
- `UserAddress` es opcional (`0..1`): el usuario puede registrarse sin dirección.
- Un producto puede crearse sin imágenes (`0..*`).
- Los campos `userId`, `orderId`, `productId` y `categoryId` se mantienen porque este diagrama también sirve para diseñar la base de datos.
