using GastroLinkApi_2._0.Entites;

namespace GastroLinkApi_2._0.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(Usuario usuario);
    }
}
