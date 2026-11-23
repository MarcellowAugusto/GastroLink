using System.ComponentModel.DataAnnotations;
using GastroLinkApi_2._0.Enum;

namespace GastroLinkApi_2._0.Dtos.Proposta
{
    public class PropostaUpdateDto
    {
        [StringLength(500, ErrorMessage = "A descrição da proposta não pode exceder 500 caracteres.")]
        public string? Descricao { get; set; }
        
        public StatusProposta Status { get; set; }
        public TipoSolicitante Solicitante { get; set; }
    }
}
