using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using GastroLinkApi_2._0.ServicesInfluencer;
using GastroLinkApi_2._0.Dtos.Influencer;
using Microsoft.AspNetCore.Authorization;

namespace GastroLinkApi_2._0.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InfluencerController : ControllerBase
    {
        private readonly InfluencerService _influencerService;
        public InfluencerController(InfluencerService influencerService)
        {
            _influencerService = influencerService;
        }


        // GET: api/Pode ser acessado por qualquer usuário autenticado
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<InfluencerReadDto>>> GetAll()
        {
            var influencers = await _influencerService.GetAll();
            return Ok(influencers);
        }

        // GET: api/Pode ser acessado por qualquer usuário autenticado
        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<InfluencerReadDto>> GetById(int id)
        {
            var influencer = await _influencerService.GetById(id);
            if (influencer == null)
            {
                return NotFound();
            }
            return Ok(influencer);
        }

        // Get: api/Me - Pode ser acessado apenas por usuários com a role "Influencer"
        [Authorize(Roles = "Influencer")]
        [HttpGet("me")]
        public async Task<ActionResult<InfluencerReadDto>> GetMe()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int usuarioId = int.Parse(userIdClaim.Value);

            var influencer = await _influencerService.GetMe(usuarioId);
            if (influencer == null)
            {
                return NotFound();
            }
            return Ok(influencer);
        }

        // Create: api/Influencer - Pode ser acessado apenas por usuários com a role "Influencer"
        [Authorize(Roles = "Influencer")]
        [HttpPost]
        public async Task<IActionResult> Create (InfluencerCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int usuarioId = int.Parse(userIdClaim.Value);

            var createdInfluencer = await _influencerService.Create(dto, usuarioId);

            return Ok(createdInfluencer);
        }

        [Authorize(Roles = "Influencer")]
        [HttpPut("me")]
        public async Task<IActionResult> Update(int id, InfluencerUpdateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int usuarioId = int.Parse(userIdClaim.Value);
            var updatedInfluencer = await _influencerService.UpdateId(dto, id, usuarioId);
            if (updatedInfluencer == null)
            {
                return NotFound();
            }
            return NoContent();
        }
        
        // Delete: api/Influencer/{id} - Pode ser acessado apenas por usuários com a role "Influencer"
        [Authorize(Roles = "Influencer")]
        [HttpDelete("me")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int usuarioId = int.Parse(userIdClaim.Value);
            var deleted = await _influencerService.Delete(id, usuarioId);
            if (!deleted)
            {
                return NotFound();
            }
            return Ok(deleted);
        }

    }
}
