using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StockInventoryAPI.Data;
using StockInventoryAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login(User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u =>
            u.Username == user.Username && u.Password == user.Password);

        Console.WriteLine(user.Username);
        Console.WriteLine(user.Password);

        if (existingUser == null)
            return Unauthorized();

        var key = "ThisIsMySuperSecretKey12345_ThisIsExtraSecureKey_2026";

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenKey = Encoding.UTF8.GetBytes(key);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Username)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(tokenKey),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Ok(new
        {
            token = tokenHandler.WriteToken(token)
        });
    }
}