export interface TableColumn {
  name: string
  type: string
  required: boolean
}

export interface TableSchema {
  name: string
  displayName: string
  columns: TableColumn[]
}

export const MOCK_TABLES: TableSchema[] = [
  {
    name: "users",
    displayName: "Utilisateurs",
    columns: [
      { name: "id", type: "number", required: true },
      { name: "email", type: "string", required: true },
      { name: "first_name", type: "string", required: true },
      { name: "last_name", type: "string", required: true },
      { name: "phone", type: "string", required: false },
      { name: "created_at", type: "date", required: false },
    ],
  },
  {
    name: "products",
    displayName: "Produits",
    columns: [
      { name: "id", type: "number", required: true },
      { name: "name", type: "string", required: true },
      { name: "description", type: "string", required: false },
      { name: "price", type: "number", required: true },
      { name: "stock", type: "number", required: true },
      { name: "category", type: "string", required: false },
    ],
  },
  {
    name: "orders",
    displayName: "Commandes",
    columns: [
      { name: "id", type: "number", required: true },
      { name: "user_id", type: "number", required: true },
      { name: "product_id", type: "number", required: true },
      { name: "quantity", type: "number", required: true },
      { name: "total_price", type: "number", required: true },
      { name: "status", type: "string", required: true },
      { name: "order_date", type: "date", required: false },
    ],
  },
  {
    name: "categories",
    displayName: "Catégories",
    columns: [
      { name: "id", type: "number", required: true },
      { name: "name", type: "string", required: true },
      { name: "description", type: "string", required: false },
      { name: "parent_id", type: "number", required: false },
    ],
  },
]
