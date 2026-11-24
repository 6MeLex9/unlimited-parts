// Seed data generator for the "Parts Unlimited" demo environment.
// Purpose: reproduce the test data set that Azure DevOps Demo Generator creates.
// Usage:   node tools/generate_seed_data.js
// Output:  data/*.json, data/sql/*.sql, data/seed_summary.json
// Texts (descriptions, cities) are read from tools/seed_text.json (UTF-8, no BOM).
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const SQL = path.join(DATA, 'sql');
fs.mkdirSync(SQL, { recursive: true });

const T = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_text.json'), 'utf8').replace(/^\uFEFF/, ''));

// Deterministic PRNG so regenerated data is always identical.
let state = 20240517;
function rnd() {
  state = (state * 1103515245 + 12345) & 0x7fffffff;
  return state / 0x7fffffff;
}
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const int = (min, max) => min + Math.floor(rnd() * (max - min + 1));

// ---------------------------------------------------------------- categories
const categoryRows = [
  [1, 'Brakes', null],
  [2, 'Brakes - Disc', 1],
  [3, 'Brakes - Pads', 1],
  [4, 'Chains', null],
  [5, 'Chains - Chains', 4],
  [6, 'Lighting', null],
  [7, 'Lighting - Headlights', 6],
  [8, 'Lighting - Tail Lights', 6],
  [9, 'Wheels', null],
  [10, 'Wheels - Tires', 9],
  [11, 'Wheels - Rims', 9],
  [12, 'Steering', null],
  [13, 'Steering - Handlebars', 12],
  [14, 'Fenders', null],
  [15, 'Carriers', null],
  [16, 'Shelters', null],
  [17, 'Accessories', null],
  [18, 'Helmets', null],
  [19, 'Gloves', null],
  [20, 'Pedals', null]
];

const categories = categoryRows.map(([Id, Name, ParentCategoryId]) => ({
  Id,
  Name,
  Description: T.categories[Name] || T.categories.default,
  ParentCategoryId
}));

// ---------------------------------------------------------------- products
// [Sku, Name, CategoryId, Stock, ListPrice, Discount]
const productRows = [
  ['BK-M68B-42', 'Mountain-500 Black, 42', 3, 8, 1350.0, 0.07],
  ['BK-M68B-46', 'Mountain-500 Silver, 46', 3, 3, 1350.0, 0.07],
  ['BK-M18B-42', 'Mountain-100 Black, 42', 1, 3, 1900.0, 0.12],
  ['BK-M18B-44', 'Mountain-100 Silver, 44', 2, 2, 1900.0, 0.12],
  ['BK-M18B-46', 'Mountain-100 Black, 46', 1, 7, 1900.0, 0.12],
  ['BK-M18B-48', 'Mountain-100 Silver, 48', 2, 0, 1900.0, 0.12],
  ['CH-9047', 'KMC X9 Chain', 4, 15, 24.99, 0.03],
  ['CH-4932', 'KMC X8 Chain', 5, 22, 19.99, 0.03],
  ['CH-4820', 'Shimano CN-HG53 Chain', 5, 11, 34.5, 0.03],
  ['CH-5011', 'Chain Tensioner Pro', 4, 4, 49.0, 0.03],
  ['FR-R92B-38', 'HL Road Frame - Red, 38', 2, 4, 2250.0, 0.05],
  ['FR-R92B-42', 'HL Road Frame - Black, 42', 2, 1, 2250.0, 0.05],
  ['FR-R92B-44', 'HL Road Frame - Red, 44', 2, 9, 2250.0, 0.05],
  ['FR-R92B-52', 'HL Road Frame - Blue, 52', 3, 0, 2250.0, 0.05],
  ['HL-U509', 'HL Road Frame - Black, 58', 1, 2, 1211.11, 0.1],
  ['HL-U509-B', 'HL Road Frame - Black, 52', 3, 2, 1211.11, 0.1],
  ['HL-U509-R', 'HL Road Frame - Red, 62', 1, 5, 1211.11, 0.1],
  ['HL-U509-S', 'HL Road Frame - Blue, 56', 2, 6, 1211.11, 0.1],
  ['SO-B909-L', 'LL Mountain Frame - Silver, 26', 1, 12, 359.0, 0.08],
  ['SO-B909-M', 'LL Mountain Frame - Silver, 24', 1, 6, 359.0, 0.08],
  ['SO-B909-R', 'LL Mountain Frame - Black, 26', 1, 1, 359.0, 0.08],
  ['LT-7000', 'Headlight 900 Lumen', 6, 6, 89.9, 0.0],
  ['LT-7010', 'Headlight 300 Lumen', 7, 13, 39.9, 0.0],
  ['LT-7020', 'Tail Light Red Pro', 8, 9, 19.9, 0.0],
  ['LT-7030', 'Tail Light Mini', 8, 17, 12.5, 0.0],
  ['LT-7040', 'Headlight Spare Bulb', 7, 30, 7.9, 0.0],
  ['WH-1001', 'Tire 29 x 2.1 Knobby', 10, 7, 45.0, 0.0],
  ['WH-1002', 'Tire 26 x 1.95 Gravel', 10, 12, 38.0, 0.0],
  ['WH-1003', 'Rim 29 Alloy 32H', 11, 5, 59.0, 0.0],
  ['WH-1004', 'Wheel Set 29 Trail', 9, 2, 210.0, 0.0],
  ['ST-2001', 'Handlebar 720 mm', 13, 2, 35.0, 0.0],
  ['ST-2002', 'Grips Ergo Set', 13, 25, 14.0, 0.0],
  ['ST-2003', 'Stem 90 mm', 12, 6, 27.0, 0.0],
  ['FD-3001', 'Fender Mud Guard Rear', 14, 8, 22.0, 0.0],
  ['FD-3002', 'Fender Mud Guard Front', 14, 9, 20.0, 0.0],
  ['CR-4001', 'Carrier Rack Alloy', 15, 3, 44.0, 0.0],
  ['CR-4002', 'Carrier Platform Steel', 15, 1, 39.0, 0.0],
  ['SH-5001', 'Shelter Bike Cover', 16, 1, 69.0, 0.0],
  ['AC-6001', 'Bottle Cage Alloy', 17, 40, 9.5, 0.0],
  ['AC-6002', 'Bike Bell', 17, 33, 6.5, 0.0],
  ['HM-7001', 'Helmet Road Aero', 18, 6, 89.0, 0.0],
  ['GL-8001', 'Gloves Gel Short', 19, 18, 24.0, 0.0],
  ['PD-9001', 'Pedal Platform Alloy', 20, 21, 32.0, 0.0]
];

const products = productRows.map(([sku, name, categoryId, stock, listPrice, discount], i) => ({
  Id: i + 1,
  Sku: sku,
  Name: name,
  CategoryId: categoryId,
  Stock: stock,
  ListPrice: listPrice,
  Discount: discount,
  Price: +(listPrice * (1 - discount)).toFixed(2),
  PhotoUrl: '/img/products/' + sku.toLowerCase() + '.png',
  IsActive: true
}));

// ---------------------------------------------------------------- customers
const customers = Array.from({ length: 40 }, (_, i) => ({
  Id: i + 1,
  UserName: 'user' + String(i + 1).padStart(3, '0') + '@unlimitedparts.demo',
  FullName: pick(T.firstNames) + ' ' + pick(T.lastNames),
  City: pick(T.cities),
  Region: pick(T.regions),
  CreatedAt: '2024-0' + int(1, 9) + '-' + String(int(10, 28)).padStart(2, '0')
}));

// ---------------------------------------------------------------- orders
const orderStatuses = ['Completed', 'Completed', 'Completed', 'Shipped', 'Pending', 'Cancelled'];
const orders = [];
const orderItems = [];
let itemId = 1;

for (let o = 1; o <= 120; o++) {
  const customer = pick(customers);
  const month = int(0, 11);
  const day = int(1, 28);
  const created = new Date(Date.UTC(2024, month, day));
  let total = 0;
  const lines = int(1, 4);
  for (let k = 0; k < lines; k++) {
    const product = pick(products);
    const quantity = int(1, 3);
    const lineTotal = +(product.Price * quantity).toFixed(2);
    total += lineTotal;
    orderItems.push({
      Id: itemId++,
      OrderId: o,
      ProductId: product.Id,
      Quantity: quantity,
      UnitPrice: product.Price,
      LineTotal: lineTotal
    });
  }
  orders.push({
    Id: o,
    OrderNumber: 'ORD-2024' + String(month + 1).padStart(2, '0') + '-' + String(o).padStart(4, '0'),
    CustomerId: customer.Id,
    OrderDate: created.toISOString().slice(0, 10),
    Status: pick(orderStatuses),
    TotalAmount: +total.toFixed(2)
  });
}

const cart = Array.from({ length: 12 }, (_, i) => {
  const product = pick(products);
  return {
    Id: i + 1,
    SessionId: 'sess-' + String(int(1000, 9999)),
    ProductId: product.Id,
    Quantity: int(1, 3)
  };
});

// ---------------------------------------------------------------- write JSON
const writeJson = (name, value) =>
  fs.writeFileSync(path.join(DATA, name), JSON.stringify(value, null, 2) + '\n', 'utf8');

writeJson('Category.json', categories);
writeJson('Product.json', products);
writeJson('Customer.json', customers);
writeJson('Order.json', orders);
writeJson('OrderItem.json', orderItems);
writeJson('Cart.json', cart);

// ---------------------------------------------------------------- write SQL
const lit = (v) =>
  v === null
    ? 'NULL'
    : typeof v === 'number'
      ? String(v)
      : "N'" + String(v).replace(/'/g, "''") + "'";

const ddl = [
  "-- Generated by tools/generate_seed_data.js",
  "-- Educational test data for Parts Unlimited (SQL Server compatible subset)",
  "IF OBJECT_ID('Cart','U') IS NOT NULL DROP TABLE Cart;",
  "IF OBJECT_ID('OrderItem','U') IS NOT NULL DROP TABLE OrderItem;",
  "IF OBJECT_ID('Orders','U') IS NOT NULL DROP TABLE Orders;",
  "IF OBJECT_ID('Customer','U') IS NOT NULL DROP TABLE Customer;",
  "IF OBJECT_ID('Product','U') IS NOT NULL DROP TABLE Product;",
  "IF OBJECT_ID('Category','U') IS NOT NULL DROP TABLE Category;",
  "",
  "CREATE TABLE Category (Id INT PRIMARY KEY, Name NVARCHAR(100) NOT NULL, Description NVARCHAR(400) NULL, ParentCategoryId INT NULL);",
  "CREATE TABLE Product (Id INT PRIMARY KEY, Sku NVARCHAR(50) NOT NULL, Name NVARCHAR(200) NOT NULL, CategoryId INT NOT NULL REFERENCES Category(Id), Stock INT NOT NULL, ListPrice DECIMAL(10,2) NOT NULL, Discount DECIMAL(5,2) NOT NULL, Price DECIMAL(10,2) NOT NULL, PhotoUrl NVARCHAR(300) NULL, IsActive BIT NOT NULL);",
  "CREATE TABLE Customer (Id INT PRIMARY KEY, UserName NVARCHAR(200) NOT NULL, FullName NVARCHAR(200) NULL, City NVARCHAR(100) NULL, Region NVARCHAR(100) NULL, CreatedAt DATE NULL);",
  "CREATE TABLE Orders (Id INT PRIMARY KEY, OrderNumber NVARCHAR(50) NOT NULL, CustomerId INT NOT NULL REFERENCES Customer(Id), OrderDate DATE NOT NULL, Status NVARCHAR(30) NOT NULL, TotalAmount DECIMAL(12,2) NOT NULL);",
  "CREATE TABLE OrderItem (Id INT PRIMARY KEY, OrderId INT NOT NULL REFERENCES Orders(Id), ProductId INT NOT NULL REFERENCES Product(Id), Quantity INT NOT NULL, UnitPrice DECIMAL(10,2) NOT NULL, LineTotal DECIMAL(12,2) NOT NULL);",
  "CREATE TABLE Cart (Id INT PRIMARY KEY, SessionId NVARCHAR(50) NOT NULL, ProductId INT NOT NULL REFERENCES Product(Id), Quantity INT NOT NULL);",
  ""
].join('\n');

const insert = (table, cols, rows) =>
  rows.map((r) => 'INSERT INTO ' + table + ' (' + cols.join(', ') + ') VALUES (' + r.map(lit).join(', ') + ');').join('\n') + '\n';

const seed =
  insert('Category', ['Id', 'Name', 'Description', 'ParentCategoryId'],
    categories.map((c) => [c.Id, c.Name, c.Description, c.ParentCategoryId])) +
  '\n' +
  insert('Product', ['Id', 'Sku', 'Name', 'CategoryId', 'Stock', 'ListPrice', 'Discount', 'Price', 'PhotoUrl', 'IsActive'],
    products.map((p) => [p.Id, p.Sku, p.Name, p.CategoryId, p.Stock, p.ListPrice, p.Discount, p.Price, p.PhotoUrl, 1])) +
  '\n' +
  insert('Customer', ['Id', 'UserName', 'FullName', 'City', 'Region', 'CreatedAt'],
    customers.map((c) => [c.Id, c.UserName, c.FullName, c.City, c.Region, c.CreatedAt])) +
  '\n' +
  insert('Orders', ['Id', 'OrderNumber', 'CustomerId', 'OrderDate', 'Status', 'TotalAmount'],
    orders.map((o) => [o.Id, o.OrderNumber, o.CustomerId, o.OrderDate, o.Status, o.TotalAmount])) +
  '\n' +
  insert('OrderItem', ['Id', 'OrderId', 'ProductId', 'Quantity', 'UnitPrice', 'LineTotal'],
    orderItems.map((i) => [i.Id, i.OrderId, i.ProductId, i.Quantity, i.UnitPrice, i.LineTotal])) +
  '\n' +
  insert('Cart', ['Id', 'SessionId', 'ProductId', 'Quantity'],
    cart.map((c) => [c.Id, c.SessionId, c.ProductId, c.Quantity]));

fs.writeFileSync(path.join(SQL, '01_schema.sql'), ddl, 'utf8');
fs.writeFileSync(path.join(SQL, '02_seed_data.sql'), seed, 'utf8');

const summary = {
  generator: 'tools/generate_seed_data.js',
  seed: 20240517,
  categories: categories.length,
  products: products.length,
  customers: customers.length,
  orders: orders.length,
  orderItems: orderItems.length,
  cartLines: cart.length,
  revenueExcludingCancelled: +orders
    .filter((o) => o.Status !== 'Cancelled')
    .reduce((sum, o) => sum + o.TotalAmount, 0)
    .toFixed(2)
};
fs.writeFileSync(path.join(DATA, 'seed_summary.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(summary, null, 2));
