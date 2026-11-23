using GastroLinkApi_2._0.Enum;

namespace GastroLinkApi_2._0.Entites
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string SenhaHash { get; set; } = string.Empty;
        public RolesUser Role { get; set; }
        public Influencer Influencer { get; set; } = null!;
        public Restaurante Restaurante { get; set; } = null!;
    }
}
