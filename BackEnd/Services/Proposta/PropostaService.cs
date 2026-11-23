using GastroLinkApi_2._0.Data;
using GastroLinkApi_2._0.Dtos.Influencer;
using GastroLinkApi_2._0.Dtos.Proposta;
using GastroLinkApi_2._0.Entites;
using GastroLinkApi_2._0.Enum;
using GastroLinkApi_2._0.Restaurantes.Dtos;
using Microsoft.EntityFrameworkCore;


namespace GastroLinkApi_2._0.ServicesProposta
{
    public class PropostaService
    {
        private readonly AppDbContext _context;

        public PropostaService(AppDbContext context)
        {
            _context = context;
        }

        //Restaurante
        public async Task<List<PropostaReadDto>> GetRest(int usuarioId)
        {
            var restaurante = await _context.Restaurantes
                .FirstOrDefaultAsync(r => r.UsuarioId == usuarioId);
            if (restaurante == null)
            {
                return new List<PropostaReadDto>();
            }

            var proposta = await _context.Propostas
                .Where(r => r.RestauranteId == restaurante.Id)
                .Select(r => new PropostaReadDto
                {
                    Id = r.Id,
                    Descricao = r.Descricao,
                    DataCriacao = r.DataCriacao,
                    Status = r.Status,
                    Solicitante = r.Solicitante,

                    InfluencerId = r.InfluencerId,
                    NomeInfluencer = r.Influencer.Nome,
                    EmailInfluencer = r.Influencer.Usuario.Email,

                    RestauranteId = r.RestauranteId,
                    NomeRestaurante = r.Restaurante.Nome,
                    EmailRestaurante = r.Restaurante.Usuario.Email

                })
                .ToListAsync();
           
            return proposta;
        }

        //influencer
        public async Task<List<PropostaReadDto>> GetInflue(int usuarioId)
        {
            var influencer = await _context.Influencers
                .FirstOrDefaultAsync(i => i.UsuarioId == usuarioId);
            if(influencer == null)
            {
                return new List<PropostaReadDto>();
            }

            var proposta = await _context.Propostas
                .Where(p => p.InfluencerId == influencer.Id)
                .Select(p => new PropostaReadDto
                {
                    Id = p.Id,
                    Descricao = p.Descricao,
                    DataCriacao = p.DataCriacao,
                    Status = p.Status,
                    Solicitante = p.Solicitante,

                    InfluencerId = p.InfluencerId,
                    NomeInfluencer = p.Influencer.Nome,
                    EmailInfluencer = p.Influencer.Usuario.Email,

                    RestauranteId = p.RestauranteId,
                    NomeRestaurante = p.Restaurante.Nome,
                    EmailRestaurante = p.Restaurante.Usuario.Email
                })
                .ToListAsync();

            return proposta;
        }
      

        public async Task<PropostaReadDto> CreateRest(PropostaCreateDto dto, int usuarioId)
        {
            var restaurante = await _context.Restaurantes.FirstOrDefaultAsync(r => r.UsuarioId == usuarioId);
            if (restaurante == null) 
            {
                throw new Exception("Restaurante não encontrado.");
            }

            var influencer = await _context.Influencers.FirstOrDefaultAsync(i => i.Id == dto.InfluencerId);
            if (influencer == null)
            {
                throw new Exception("Influenciador não encontrado.");
            }

            var proposta = new Proposta
            {
                Descricao = dto.Descricao,
                DataCriacao = DateTime.UtcNow,
                Status = StatusProposta.Pendente,
                Solicitante = TipoSolicitante.Restaurante,
                InfluencerId = influencer.Id,
                RestauranteId = restaurante.Id
            };

            _context.Propostas.Add(proposta);
            await _context.SaveChangesAsync();
            return new PropostaReadDto
            {
                Id = proposta.Id,
                Descricao = proposta.Descricao,
                DataCriacao = proposta.DataCriacao,
                Status = proposta.Status,
                Solicitante = proposta.Solicitante,

                InfluencerId = proposta.InfluencerId,
                NomeInfluencer = proposta.Influencer.Nome,

                RestauranteId = proposta.RestauranteId,
                NomeRestaurante = proposta.Restaurante.Nome
            };
        }

        public async Task<PropostaReadDto> CreateInflu(PropostaCreateDto propostaCreateDto, int usuarioId)
        {
            var influencer = await _context.Influencers.FirstOrDefaultAsync(r => r.UsuarioId == usuarioId);
            if(influencer == null)
            {
                throw new Exception("Influenciador não encontrado.");
            }

            var restaurente = await _context.Restaurantes.FirstOrDefaultAsync(i => i.Id == propostaCreateDto.RestauranteId);
            if (restaurente == null)
            {
                throw new Exception("Restaurante não encontrado.");
            }

            var proposta = new Proposta
            {
                Descricao = propostaCreateDto.Descricao,
                DataCriacao = DateTime.UtcNow,
                Status = StatusProposta.Pendente,
                Solicitante = TipoSolicitante.Influencer,
                InfluencerId = influencer.Id,
                RestauranteId = restaurente.Id
            };
            _context.Propostas.Add(proposta);
            await _context.SaveChangesAsync();
            return new PropostaReadDto
            {
                Id = proposta.Id,
                Descricao = proposta.Descricao,
                DataCriacao = proposta.DataCriacao,
                Status = proposta.Status,
                Solicitante = proposta.Solicitante,

                InfluencerId = proposta.InfluencerId,
                NomeInfluencer = proposta.Influencer.Nome,

                RestauranteId = proposta.RestauranteId,
                NomeRestaurante = proposta.Restaurante.Nome
            };
        }

        public async Task<PropostaReadDto?> Update (int id, PropostaUpdateDto dto, int usuarioId)
        {
            var proposta = await _context.Propostas
                        .Include(p => p.Influencer)
                        .Include(p => p.Restaurante)
                        .FirstOrDefaultAsync(p => p.Id == id);

            if (proposta == null)
            {
                return null;
            }

            if(proposta.Solicitante == TipoSolicitante.Influencer)
            {
                var restaurante = await _context.Restaurantes.FirstOrDefaultAsync(r => r.UsuarioId == usuarioId);

                if(restaurante == null || restaurante.Id != proposta.RestauranteId)
                {
                    return null;
                }
            }
            else if(proposta.Solicitante == TipoSolicitante.Restaurante)
            {
                var influencer = await _context.Influencers.FirstOrDefaultAsync(r => r.UsuarioId == usuarioId);

                if(influencer == null || influencer.Id != proposta.InfluencerId)
                {
                    return null;
                }
            }
            proposta.Descricao = dto.Descricao ?? proposta.Descricao;
            proposta.Status = dto.Status;

            await _context.SaveChangesAsync();

            return new PropostaReadDto
            {
                Id = proposta.Id,
                Descricao = proposta.Descricao,
                DataCriacao = proposta.DataCriacao,
                Status = proposta.Status,
                Solicitante = proposta.Solicitante,

                InfluencerId = proposta.InfluencerId,
                NomeInfluencer = proposta.Influencer.Nome,

                RestauranteId = proposta.RestauranteId,
                NomeRestaurante = proposta.Restaurante.Nome
            };
        }


    }
}
