using GastroLinkApi_2._0.Enum;

namespace GastroLinkApi_2._0.Entites
{
    public class Proposta
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
        public StatusProposta Status { get; set; } = StatusProposta.Pendente;
        public TipoSolicitante Solicitante { get; set; }
        public int InfluencerId { get; set; }
        public Influencer Influencer { get; set; } = null!;
        public int RestauranteId { get; set; }
        public Restaurante Restaurante { get; set; } = null!; 

    }
}
