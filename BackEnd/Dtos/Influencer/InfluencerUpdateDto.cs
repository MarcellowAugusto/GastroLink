using System.ComponentModel.DataAnnotations;

namespace GastroLinkApi_2._0.Dtos.Influencer
{
    public class InfluencerUpdateDto
    {
        [StringLength(100, ErrorMessage = "O campo Nome deve ter no máximo 100 caracteres.")]
        public string? Nome { get; set; }
        [StringLength(500, ErrorMessage = "O campo Descrição deve ter no máximo 500 caracteres.")]
        public string? Descricao { get; set; }
        [StringLength(100, ErrorMessage = "O campo Instagram deve ter no máximo 100 caracteres.")]
        public string? Instagram { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "O número de seguidores não pode ser negativo.")]
        public int? Seguidores { get; set; }
        [StringLength(20, ErrorMessage = "O campo Telefone deve ter no máximo 20 caracteres.")]
        [Phone(ErrorMessage = "O campo Telefone deve ser um número de telefone válido.")]
        public string? Telefone { get; set; }
        [StringLength(500, ErrorMessage = "O campo FotoUrl deve ter no máximo 500 caracteres.")]
        public string? FotoUrl { get; set; }
    }
}
