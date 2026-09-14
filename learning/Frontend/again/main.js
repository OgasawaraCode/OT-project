const products = [
  { name: "りんご", price: 150, stock: 3 },
  { name: "バナナ", price: 100, stock: 0 },
  { name: "みかん", price: 200, stock: 5 },
];

for (const product of products) {
  if (product.stock > 0) {
    console.log(
      `${product.name}は${product.price}円です。在庫は${product.stock}個あります。`
    );
  }
}