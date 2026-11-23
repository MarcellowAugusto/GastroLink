namespace GastroLinkApi_2._0.Entites
{
    public class Restaurante
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;   
        public string Endereco { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string? FotoUrl { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public ICollection<Proposta> Propostas { get; set; } = new List<Proposta>();
    }
}
