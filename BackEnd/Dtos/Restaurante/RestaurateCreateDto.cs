using System.ComponentModel.DataAnnotations;

namespace GastroLinkApi_2._0.Restaurantes.Dtos
{
    public class RestauranteCreateDto
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O campo Nome deve ter no máximo 100 caracteres.")]
        public required string Nome { get; set; }
        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [StringLength(500, ErrorMessage = "O campo Descrição deve ter no máximo 500 caracteres.")]
        public required string Descricao { get; set; } 
        [Required(ErrorMessage = "O endereço é obrigatório.")]
        [StringLength(50, ErrorMessage = "O campo Endereço deve ter no máximo 50 caracteres.")]
        public required string Endereco { get; set; }
        [Required(ErrorMessage = "A categoria é obrigatória.")]
        [StringLength(100, ErrorMessage = "O campo Categoria deve ter no máximo 100 caracteres.")]
        public required string Categoria { get; set; }
        [Required(ErrorMessage = "O telefone é obrigatório.")]
        [Phone(ErrorMessage = "O telefone informado não é válido.")]
        [StringLength(20, ErrorMessage = "O campo Telefone deve ter no máximo 20 caracteres.")]
        public required string Telefone { get; set; }
        [StringLength(500, ErrorMessage = "O campo FotoUrl deve ter no máximo 500 caracteres.")]
        public string? FotoUrl { get; set; }
    }
}
