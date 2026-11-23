using GastroLinkApi_2._0.Entites;
using GastroLinkApi_2._0.Restaurantes.Dtos;
using GastroLinkApi_2._0.Services.Restaurantes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GastroLinkApi_2._0.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestauranteController : ControllerBase
    {
        private readonly RestauranteService _restauranteService;
        public RestauranteController(RestauranteService restauranteService)
        {
            _restauranteService = restauranteService;
        }
        // GET: api/Usuario autenticado 
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<RestauranteReadDto>>> GetAll()
        {
            var getAll = await _restauranteService.GetAll();
            return Ok(getAll);
        }
        // Get: api/Usuario autenticado por id
        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<RestauranteReadDto>> GetById(int id)
        {
            var restaurante = await _restauranteService.GetById(id);
            if (restaurante == null)
            {
                return NotFound();
            }
            return Ok(restaurante);
        }

        // Get: api/Me 
        [Authorize(Roles = "Restaurante")]
        [HttpGet("me")]
        public async Task<ActionResult<RestauranteReadDto>> GetMe()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int usuarioId = int.Parse(userIdClaim.Value);
            
            var getAll = await _restauranteService.GetMe(usuarioId);
            if(getAll == null)
            {
                return NotFound();
            }
            return Ok(getAll);
        }

        // POST: api/Restaurante
        [Authorize(Roles = "Restaurante")]
        [HttpPost]
        public async Task<ActionResult<RestauranteReadDto>> Create(RestauranteCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int usuarioId = int.Parse(userIdClaim.Value);
            var createdRestaurante = await _restauranteService.Create(dto, usuarioId);

            if (createdRestaurante == null)
            {
                return Conflict("Este usuário já possui um restaurante cadastrado.");
            }

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdRestaurante.Id },
                createdRestaurante
            );
        }

        // PUT: api/Restaurante/{id}
        [Authorize(Roles = "Restaurante")]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe(RestauranteUpdateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int usuarioId = int.Parse(userIdClaim.Value);
            var updatedRestaurante = await _restauranteService.UpdateMe(dto, usuarioId);
            if(updatedRestaurante == null)
            {
                return NotFound();
            }
            return Ok(updatedRestaurante);
        }

        // DELETE: api/Restaurante/Me
        [Authorize(Roles = "Restaurante")]
        [HttpDelete("me")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            
            int usuarioId = int.Parse(userIdClaim.Value);
           
            var deleted = await _restauranteService.Delete(id, usuarioId);
            if (!deleted)
            {
                return NotFound();
            }
            return Ok(deleted);
        }
    }
}
