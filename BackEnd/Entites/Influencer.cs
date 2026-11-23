namespace GastroLinkApi_2._0.Entites
{
    public class Influencer
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; } 
        public string Instagram { get; set; } = string.Empty;
        public int Seguidores { get; set; } 
        public string? Telefone { get; set; } 
        public string? FotoUrl { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public ICollection<Proposta> Propostas { get; set; } = new List<Proposta>();
    }
}
