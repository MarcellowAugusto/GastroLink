using GastroLinkApi_2._0.Data;
using GastroLinkApi_2._0.Entites;

using GastroLinkApi_2._0.Restaurantes.Dtos;
using Microsoft.EntityFrameworkCore;

namespace GastroLinkApi_2._0.Services.Restaurantes
{
    public class RestauranteService
    {
        private readonly AppDbContext _appDbContext;

        public RestauranteService(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<List<RestauranteReadDto>> GetAll()
        {
            var getAll = await _appDbContext.Restaurantes
                .Select(r => new RestauranteReadDto
                {
                    Id = r.Id,
                    Nome = r.Nome,
                    Descricao = r.Descricao,
                    Endereco = r.Endereco,
                    Categoria = r.Categoria,
                    Telefone = r.Telefone,
                    FotoUrl = r.FotoUrl
                })
                .ToListAsync();
            return getAll;
        }

        public async Task<RestauranteReadDto?> GetById(int id)
        {
            var restaurante = await _appDbContext.Restaurantes
                .Where(r => r.Id == id)
                .Select(r => new RestauranteReadDto
                {
                    Id = r.Id,
                    Nome = r.Nome,
                    Descricao = r.Descricao,
                    Endereco = r.Endereco,
                    Categoria = r.Categoria,
                    Telefone = r.Telefone,
                    FotoUrl = r.FotoUrl
                })
                .FirstOrDefaultAsync();
            return restaurante;

        }

        public async Task<RestauranteReadDto?> GetMe(int usuarioId)
        {
            var getAll = await _appDbContext.Restaurantes
                .Where(r => r.UsuarioId == usuarioId)
                .Select(r => new RestauranteReadDto
                {
                    Id = r.Id,
                    Nome = r.Nome,
                    Descricao = r.Descricao,
                    Endereco = r.Endereco,
                    Categoria = r.Categoria,
                    Telefone = r.Telefone,
                    FotoUrl = r.FotoUrl
                })
                .FirstOrDefaultAsync();
            return getAll;
        }

        public async Task<RestauranteReadDto?> Create(RestauranteCreateDto dto, int usuarioId)
        {
            var restauranteExistente = await _appDbContext.Restaurantes
                .FirstOrDefaultAsync(r => r.UsuarioId == usuarioId);

            if (restauranteExistente != null)
            {
                return null;
            }

            var createRestaurante = new Restaurante
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                Endereco = dto.Endereco,
                Categoria = dto.Categoria,
                Telefone = dto.Telefone,
                FotoUrl = dto.FotoUrl,
                UsuarioId = usuarioId
            };

            _appDbContext.Restaurantes.Add(createRestaurante);

            await _appDbContext.SaveChangesAsync();

            return new RestauranteReadDto
            {
                Id = createRestaurante.Id,
                Nome = createRestaurante.Nome,
                Descricao = createRestaurante.Descricao,
                Endereco = createRestaurante.Endereco,
                Categoria = createRestaurante.Categoria,
                Telefone = createRestaurante.Telefone,
                FotoUrl = createRestaurante.FotoUrl
            };
        }

        public async Task<RestauranteReadDto?> UpdateMe(RestauranteUpdateDto dto, int usuarioId)
        {
            var restaurante = await _appDbContext.Restaurantes.FirstOrDefaultAsync(r => r.UsuarioId == usuarioId);
            if (restaurante == null)
            {
                return null;
            }
            restaurante.Nome = dto.Nome ?? restaurante.Nome;
            restaurante.Descricao = dto.Descricao ?? restaurante.Descricao;
            restaurante.Endereco = dto.Endereco ?? restaurante.Endereco;
            restaurante.Categoria = dto.Categoria ??     restaurante.Categoria;
            restaurante.Telefone = dto.Telefone ?? restaurante.Telefone;
            restaurante.FotoUrl = dto.FotoUrl ?? restaurante.FotoUrl;
            
            await _appDbContext.SaveChangesAsync();
            
            return new RestauranteReadDto
            {
                Id = restaurante.Id,
                Nome = restaurante.Nome,
                Descricao = restaurante.Descricao,
                Endereco = restaurante.Endereco,
                Categoria = restaurante.Categoria,
                Telefone = restaurante.Telefone,
                FotoUrl = restaurante.FotoUrl
            };
        }

        public async Task<bool> Delete(int id, int usuarioId)
        {
            var restaurante = await _appDbContext.Restaurantes.FirstOrDefaultAsync(r => r.Id == id && r.UsuarioId == usuarioId);
            if (restaurante == null)
            {
                return false;
            }
            
            _appDbContext.Remove(restaurante);
            await _appDbContext.SaveChangesAsync();
            return true;
        }
    }
}
