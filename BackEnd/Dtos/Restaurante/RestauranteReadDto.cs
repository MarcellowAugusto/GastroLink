namespace GastroLinkApi_2._0.Restaurantes.Dtos
{
    public class RestauranteReadDto
    {
        public int Id { get; set; }
        public required string Nome { get; set; } 
        public required string Descricao { get; set; } 
        public required string Endereco { get; set; } 
        public required string Categoria { get; set; } 
        public required string Telefone { get; set; } 
        public string? FotoUrl { get; set; }
    }
}
