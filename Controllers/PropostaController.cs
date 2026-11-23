using GastroLinkApi_2._0.Dtos.Proposta;
using GastroLinkApi_2._0.ServicesProposta;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GastroLinkApi_2._0.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class PropostaController : ControllerBase
    {
        private readonly PropostaService _propostaService;
        public PropostaController(PropostaService propostaService)
        {
            _propostaService = propostaService;
        }

        // GET:api/Método que só pode ser acessado por role "Restaurante" 
        [Authorize(Roles = "Restaurante")]
        [HttpGet("me/restaurante")]
        public async Task<ActionResult<List<PropostaReadDto>>> GetRest()
        {
            var restaurante = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (restaurante == null)
            {
                return Unauthorized();
            }

            int usuarioId = int.Parse(restaurante);

            var proposta = await _propostaService.GetRest(usuarioId);

            return Ok(proposta);
        }

        // GET:api/Método que só pode ser acessado por role "Influencer" 
        [Authorize(Roles = "Influencer")]
        [HttpGet("me/influencer")]
        public async Task<ActionResult<List<PropostaReadDto>>> GetInflue()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            int usuarioId = int.Parse(userId);

            var propostas = await _propostaService.GetInflue(usuarioId);

            return Ok(propostas);
        }

        // POST: api/Proposta, pode ser acessado somente por role "Restaurante"
        [Authorize(Roles = "Restaurante")]
        [HttpPost("Restaurante")]
        public async Task<IActionResult> CreateRest(PropostaCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null)
            {
                return Unauthorized();
            }

            int usuarioId = int.Parse(userId);

            var proposta = await _propostaService.CreateRest(dto, usuarioId);

            return Ok(proposta);
        } 
        
        // POST: api/Proposta, pode ser acessado somente por role "Influencer"
        [Authorize(Roles = "Influencer")]
        [HttpPost("influencer")]
        public async Task<IActionResult> CreateInflu(PropostaCreateDto Dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null)
            {
                return Unauthorized();
            }

            int usuarioId = int.Parse(userId);

            var proposta = await _propostaService.CreateInflu(Dto, usuarioId);

            return Ok(proposta);
        }
        
        // Post: api/Proposta, pode ser acesado somente pelo role "Influencer"
        [Authorize(Roles = "Restaurante, Influencer")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, PropostaUpdateDto propostaUpdateDto)
        {
            var proposta = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(proposta == null)
            {
                return Unauthorized();

            }
            var usuarioId = int.Parse(proposta);

            var updatedProposta = await _propostaService.Update(id, propostaUpdateDto, usuarioId);
            if (updatedProposta == null)
            {
                return NotFound();
            }
            return Ok(updatedProposta);
        }
        

    }
}
