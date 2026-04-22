using StockInventoryAPI.Data;
using StockInventoryAPI.Models;

namespace StockInventoryAPI.Services
{
    public class ProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public List<Product> GetAllProducts()
        {
            return _context.Products.ToList();
        }

        public void AddStock(StockTransaction transaction)
        {
            _context.StockTransactions.Add(transaction);
            _context.SaveChanges();
        }
    }
}
