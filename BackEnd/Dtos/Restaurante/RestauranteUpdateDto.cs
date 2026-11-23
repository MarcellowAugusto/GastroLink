using System.ComponentModel.DataAnnotations;

namespace GastroLinkApi_2._0.Restaurantes.Dtos
{
    public class RestauranteUpdateDto
    {
        [StringLength(100, ErrorMessage = "O campo Nome deve ter no máximo 100 caracteres.")]
        public  string? Nome { get; set; }
        [StringLength(500, ErrorMessage = "O campo Descrição deve ter no máximo 500 caracteres.")]
        public  string? Descricao { get; set; }
        [StringLength(50, ErrorMessage = "O campo Endereço deve ter no máximo 50 caracteres.")]
        public  string? Endereco { get; set; }
        [StringLength(100, ErrorMessage = "O campo Categoria deve ter no máximo 100 caracteres.")]
        public  string? Categoria { get; set; }
        [Phone(ErrorMessage = "O telefone informado não é válido.")]
        [StringLength(20, ErrorMessage = "O campo Telefone deve ter no máximo 20 caracteres.")]
        public  string? Telefone { get; set; }
        [StringLength(500, ErrorMessage = "O campo FotoUrl deve ter no máximo 500 caracteres.")]
        public string? FotoUrl { get; set; }
    }
}
