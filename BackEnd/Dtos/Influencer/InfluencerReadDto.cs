namespace GastroLinkApi_2._0.Dtos.Influencer
{
    public class InfluencerReadDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string Instagram { get; set; } = string.Empty;
        public int Seguidores { get; set; }
        public string? Telefone { get; set; }
        public string? FotoUrl { get; set; }
    }
}
