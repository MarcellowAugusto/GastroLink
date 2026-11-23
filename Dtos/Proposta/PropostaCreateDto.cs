using System.ComponentModel.DataAnnotations;

public class PropostaCreateDto
{
    [Required(ErrorMessage = "A descrição da proposta é obrigatória.")]
    [StringLength(500, ErrorMessage = "A descrição da proposta não pode exceder 500 caracteres.")]
    public required string Descricao { get; set; }

    public int RestauranteId { get; set; }

    public int InfluencerId { get; set; }
}