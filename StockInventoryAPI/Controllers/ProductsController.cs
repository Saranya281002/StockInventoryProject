using Microsoft.AspNetCore.Mvc;
using StockInventoryAPI.Models;

namespace StockInventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private static List<Product> products = new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", Category = "Electronics", Price = 50000 },
            new Product { Id = 2, Name = "Phone", Category = "Electronics", Price = 20000 }
        };

        // GET all
        [HttpGet]
        public IActionResult GetProducts()
        {
            return Ok(products);
        }

        // GET by ID (optional but good)
        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // POST (Add)
        [HttpPost]
        public IActionResult AddProduct(Product product)
        {
            product.Id = products.Count + 1;
            products.Add(product);
            return Ok(product);
        }

        // PUT (Update)
        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, Product updatedProduct)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return NotFound();

            product.Name = updatedProduct.Name;
            product.Category = updatedProduct.Category;
            product.Price = updatedProduct.Price;

            return Ok(product);
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return NotFound();

            products.Remove(product);
            return Ok();
        }
    }
}