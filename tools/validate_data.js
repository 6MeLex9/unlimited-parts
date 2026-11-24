// Валидатор тестовых данных: проверяет целостность JSON-наборов и соответствие
// ожидаемым количествам из data/demo-generator/parts-unlimited.json.
// Запуск: node tools/validate_data.js   (или python tools/validate_data.py)
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const load = (name) => JSON.parse(fs.readFileSync(path.join(DATA, name), 'utf8'));

const categories = load('Category.json');
const products = load('Product.json');
const customers = load('Customer.json');
const orders = load('Order.json');
const orderItems = load('OrderItem.json');
const cart = load('Cart.json');
const manifest = JSON.parse(fs.readFileSync(path.join(DATA, 'demo-generator', 'parts-unlimited.json'), 'utf8'));

const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

// 1. Уникальность ключей
const unique = (rows, key, label) => {
  const seen = new Set();
  for (const row of rows) {
    check(!seen.has(row[key]), `${label}: duplicate ${key}=${row[key]}`);
    seen.add(row[key]);
  }
};
unique(categories, 'Id', 'Category');
unique(products, 'Id', 'Product');
unique(products, 'Sku', 'Product');
unique(customers, 'Id', 'Customer');
unique(orders, 'Id', 'Orders');

// 2. Ссылочная целостность
const categoryIds = new Set(categories.map((c) => c.Id));
const productIds = new Set(products.map((p) => p.Id));
const customerIds = new Set(customers.map((c) => c.Id));
const orderIds = new Set(orders.map((o) => o.Id));

for (const p of products) check(categoryIds.has(p.CategoryId), `Product ${p.Sku}: unknown CategoryId ${p.CategoryId}`);
for (const c of categories) check(c.ParentCategoryId === null || categoryIds.has(c.ParentCategoryId), `Category ${c.Name}: unknown parent ${c.ParentCategoryId}`);
for (const o of orders) check(customerIds.has(o.CustomerId), `Order ${o.OrderNumber}: unknown CustomerId ${o.CustomerId}`);
for (const i of orderItems) {
  check(orderIds.has(i.OrderId), `OrderItem ${i.Id}: unknown OrderId ${i.OrderId}`);
  check(productIds.has(i.ProductId), `OrderItem ${i.Id}: unknown ProductId ${i.ProductId}`);
  check(i.LineTotal === +(i.UnitPrice * i.Quantity).toFixed(2), `OrderItem ${i.Id}: LineTotal mismatch`);
}
for (const line of cart) check(productIds.has(line.ProductId), `Cart ${line.Id}: unknown ProductId ${line.ProductId}`);

// 3. Остатки и цены
for (const p of products) {
  check(p.Stock >= 0, `Product ${p.Sku}: negative stock`);
  check(p.Price === +(p.ListPrice * (1 - p.Discount)).toFixed(2), `Product ${p.Sku}: Price mismatch`);
  check(p.Discount >= 0 && p.Discount < 1, `Product ${p.Sku}: Discount out of range`);
}

// 4. Сумма заказа = сумма позиций
for (const o of orders) {
  const sum = +orderItems
    .filter((i) => i.OrderId === o.Id)
    .reduce((acc, i) => acc + i.LineTotal, 0)
    .toFixed(2);
  check(sum === o.TotalAmount, `Order ${o.OrderNumber}: TotalAmount ${o.TotalAmount} != ${sum}`);
}

// 5. Иерархия категорий: не больше двух уровней
for (const c of categories) {
  if (c.ParentCategoryId === null) continue;
  const parent = categories.find((x) => x.Id === c.ParentCategoryId);
  check(parent && parent.ParentCategoryId === null, `Category ${c.Name}: nesting deeper than 2 levels`);
}

// 6. Соответствие ожидаемым количествам из манифеста
const expected = manifest.seedData.expectedCounts;
const actual = {
  categories: categories.length,
  products: products.length,
  customers: customers.length,
  orders: orders.length,
  orderItems: orderItems.length,
  cartLines: cart.length
};
for (const [key, value] of Object.entries(expected)) {
  check(actual[key] === value, `Count mismatch ${key}: expected ${value}, got ${actual[key]}`);
}

if (errors.length) {
  console.error(`FAILED: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error(' - ' + e));
  process.exit(1);
}

console.log('OK: seed data is consistent');
console.table(actual);
