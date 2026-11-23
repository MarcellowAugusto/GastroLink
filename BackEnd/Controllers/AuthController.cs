using GastroLinkApi_2._0.Dtos.Login;
using GastroLinkApi_2._0.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GastroLinkApi_2._0.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var resultado = await _authService.Login(loginDto);

            if (resultado == null)
            {
                return Unauthorized(new
                {
                    message = "Email ou senha inválidos."
                });
            }

            return Ok(new
            {
                token = resultado.Value.Token,
                role = resultado.Value.Role
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                var result = await _authService.Register(registerDto);

                return Ok(new
                {
                    message = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
