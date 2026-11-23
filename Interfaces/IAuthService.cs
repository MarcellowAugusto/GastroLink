using GastroLinkApi_2._0.Dtos.Login;

namespace GastroLinkApi_2._0.Interfaces
{
    public interface IAuthService
    {
        Task<(string Token, string Role)?> Login(LoginDto loginDto);

        Task<string> Register(RegisterDto registerDto);
    }
}
