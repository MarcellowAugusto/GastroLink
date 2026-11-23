using GastroLinkApi_2._0.Enum;

namespace GastroLinkApi_2._0.Dtos.Proposta
{
    public class PropostaReadDto
    {
        public int Id { get; set; }
        public required string Descricao { get; set; } 
        public DateTime DataCriacao { get; set; } 
        public StatusProposta Status { get; set; }
        public TipoSolicitante Solicitante { get; set; }

        public int InfluencerId { get; set; }
        public string NomeInfluencer { get; set; } = string.Empty;
        public string EmailInfluencer { get; set; } = string.Empty;

        public int RestauranteId { get; set; }
        public string NomeRestaurante { get; set; } = string.Empty;
        public string EmailRestaurante { get; set; } = string.Empty;

    }
}
