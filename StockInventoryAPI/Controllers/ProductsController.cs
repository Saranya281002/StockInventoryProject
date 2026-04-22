using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockInventoryAPI.Data;
using StockInventoryAPI.Models;
using StockInventoryAPI.Services;

namespace StockInventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ProductService _service;

        public ProductsController(AppDbContext context, ProductService service)
        {
            _context = context;
            _service = service;
        }
        // GET all
        [HttpGet]
        public IActionResult GetProducts()
        {
            var products = _context.Products.ToList();
            return Ok(products);
        }

        // GET by ID (optional but good)
        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // POST (Add)
        [HttpPost]
        public IActionResult AddProduct(Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return Ok(product);
        }

        // PUT (Update)
        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, Product updatedProduct)
        {
            var product = _context.Products.Find(id);
            if (product == null)
                return NotFound();

            product.Name = updatedProduct.Name;
            product.Category = updatedProduct.Category;
            product.Price = updatedProduct.Price;

            _context.SaveChanges();

            return Ok(product);
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            _context.SaveChanges();

            return Ok();
        }
        [HttpPost("stock")]
        public IActionResult AddStock(StockTransaction transaction)
        {
            if (transaction == null)
                return BadRequest("Transaction is null");
            //Console.WriteLine(transaction.ProductId);
            //Console.WriteLine(transaction.Quantity);
            //Console.WriteLine(transaction.Type);
            _context.StockTransactions.Add(transaction);
            _context.SaveChanges();
            var currentStock = _context.StockTransactions
    .Where(t => t.ProductId == transaction.ProductId)
    .Sum(t => t.Type == "IN" ? t.Quantity : -t.Quantity);

            if (transaction.Type == "OUT" && transaction.Quantity > currentStock)
            {
                return BadRequest("Not enough stock");
            }
            return Ok();
        }
        [HttpGet("{id}/stock")]
        public IActionResult GetStock(int id)
        {
            var transactions = _context.StockTransactions
                .Where(t => t.ProductId == id)
                .ToList();

            var stock = transactions
                .Where(t => t.Type == "IN").Sum(t => t.Quantity)
                - transactions
                .Where(t => t.Type == "OUT").Sum(t => t.Quantity);

            return Ok(stock);
        }
        [HttpGet("stock/all")]
        public IActionResult GetAllStock()
        {
            var stockData = _context.StockTransactions
                .GroupBy(t => t.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    Stock = g.Where(t => t.Type == "IN").Sum(t => t.Quantity)
                          - g.Where(t => t.Type == "OUT").Sum(t => t.Quantity)
                })
                .ToList();

            return Ok(stockData);
        }
        [HttpGet("{id}/transactions")]
        public IActionResult GetTransactions(int id)
        {
            var transactions = _context.StockTransactions
                .Where(t => t.ProductId == id)
                .OrderByDescending(t => t.Date)
                .ToList();

            return Ok(transactions);
        }
        [HttpGet("dashboard")]
        public IActionResult GetDashboard()
        {
            var totalProducts = _context.Products.Count();

            var totalStock = _context.StockTransactions
                .Sum(t => t.Type == "IN" ? t.Quantity : -t.Quantity);

            var lowStock = _context.StockTransactions
                .GroupBy(t => t.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    Stock = g.Sum(t => t.Type == "IN" ? t.Quantity : -t.Quantity)
                })
                .Where(x => x.Stock < 5)
                .Count();

            return Ok(new { totalProducts, totalStock, lowStock });
        }
    }
}