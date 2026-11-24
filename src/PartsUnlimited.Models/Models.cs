using System;
using System.Collections.Generic;

namespace PartsUnlimited.Models
{
    /// <summary>
    /// Минимальная модель данных тестового окружения Parts Unlimited.
    /// Соответствует data/*.json и data/sql/01_schema.sql.
    /// </summary>
    public class Product
    {
        public int Id { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int Stock { get; set; }
        public decimal ListPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal Price { get; set; }
        public string PhotoUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? ParentCategoryId { get; set; }
    }

    public class Customer
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public enum OrderStatus
    {
        Pending,
        Shipped,
        Completed,
        Cancelled
    }

    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItem> Items { get; } = new List<OrderItem>();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineTotal { get; set; }
    }

    public class CartLine
    {
        public int Id { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
