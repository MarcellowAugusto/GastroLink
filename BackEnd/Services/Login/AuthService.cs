using GastroLinkApi_2._0.Interfaces;
using GastroLinkApi_2._0.Data;
using GastroLinkApi_2._0.Dtos.Login;
using GastroLinkApi_2._0.Entites;

using Microsoft.EntityFrameworkCore;

namespace GastroLinkApi_2._0.Services.Login
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        private readonly ITokenService _tokenService;

        public AuthService(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<(string Token, string Role)?> Login(LoginDto loginDto)
        {
            var user = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
                return null;

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(
                loginDto.Senha,
                user.SenhaHash
            );

            if (!isPasswordValid)
                return null;

            var token = _tokenService.GenerateToken(user);

            return (token, user.Role.ToString());
        }

        public async Task<string> Register(RegisterDto registerDto)
        {
            var userExists = await _context.Usuarios
                .AnyAsync(u => u.Email == registerDto.Email);

            if (userExists)
                throw new Exception("Usuário já existe.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(
                registerDto.Senha
            );

            var newUser = new Usuario
            {
                Email = registerDto.Email,
                SenhaHash = hashedPassword,
                Role = registerDto.Role
            };

            _context.Usuarios.Add(newUser);

            await _context.SaveChangesAsync();

            return "Usuário registrado com sucesso.";
        }

    }
}
