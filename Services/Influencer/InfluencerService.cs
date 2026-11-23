using GastroLinkApi_2._0.Data;
using GastroLinkApi_2._0.Dtos.Influencer;
using GastroLinkApi_2._0.Entites;
using Microsoft.EntityFrameworkCore;

namespace GastroLinkApi_2._0.ServicesInfluencer
{
    public class InfluencerService
    {
        private readonly AppDbContext _context;
        public InfluencerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<InfluencerReadDto>> GetAll()
        {
            var influencerDtos = await _context.Influencers
                .Select(i => new InfluencerReadDto
                {
                    Id = i.Id,
                    Nome = i.Nome,
                    Descricao = i.Descricao,
                    Instagram = i.Instagram,
                    Seguidores = i.Seguidores,
                    Telefone = i.Telefone,
                    FotoUrl = i.FotoUrl
                })
                .ToListAsync();

            return influencerDtos;
        }

        public async Task<InfluencerReadDto?> GetById(int id)
        {
            var influencer = await _context.Influencers
                .Where(i => i.Id == id)
                .Select(i => new InfluencerReadDto
                {
                    Id = i.Id,
                    Nome = i.Nome,
                    Descricao = i.Descricao,
                    Instagram = i.Instagram,
                    Seguidores = i.Seguidores,
                    Telefone = i.Telefone,
                    FotoUrl = i.FotoUrl
                })
                .FirstOrDefaultAsync();
            return influencer;
        }

        public async Task<InfluencerReadDto?> GetMe(int usuarioId)
        {
            var influencer = await _context.Influencers
                .Where(i => i.UsuarioId == usuarioId)
                .Select(i => new InfluencerReadDto
                {
                    Id = i.Id,
                    Nome = i.Nome,
                    Descricao = i.Descricao,
                    Instagram = i.Instagram,
                    Seguidores = i.Seguidores,
                    Telefone = i.Telefone,
                    FotoUrl = i.FotoUrl
                })
                .FirstOrDefaultAsync();
            return influencer;
        }

        public async Task<InfluencerReadDto> Create(InfluencerCreateDto dto, int usuarioId)
        {
            var influencer = new Influencer
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                Instagram = dto.Instagram,
                Seguidores = dto.Seguidores,
                Telefone = dto.Telefone,
                FotoUrl = dto.FotoUrl,
                UsuarioId = usuarioId
            };
            _context.Influencers.Add(influencer);
            await _context.SaveChangesAsync();
            var influencerReadDto = new InfluencerReadDto
            {
                Id = influencer.Id,
                Nome = influencer.Nome,
                Descricao = influencer.Descricao,
                Instagram = influencer.Instagram,
                Seguidores = influencer.Seguidores,
                Telefone = influencer.Telefone,
                FotoUrl = influencer.FotoUrl
            };
            return influencerReadDto;
        }

        public async Task<InfluencerReadDto?> UpdateId(InfluencerUpdateDto dto, int id, int usuarioId)
        {
            var influencer = await _context.Influencers
                .FirstOrDefaultAsync(i => i.Id == id && i.UsuarioId == usuarioId);
            if (influencer == null)
            {
                return null;
            }
            influencer.Nome = dto.Nome ?? influencer.Nome;
            influencer.Descricao = dto.Descricao ?? influencer.Descricao;
            influencer.Instagram = dto.Instagram ?? influencer.Instagram;
            influencer.Seguidores = dto.Seguidores ?? influencer.Seguidores;
            influencer.Telefone = dto.Telefone ?? influencer.Telefone;
            influencer.FotoUrl = dto.FotoUrl ?? influencer.FotoUrl;
            await _context.SaveChangesAsync();
            var influencerReadDto = new InfluencerReadDto
            {
                Id = influencer.Id,
                Nome = influencer.Nome,
                Descricao = influencer.Descricao,
                Instagram = influencer.Instagram,
                Seguidores = influencer.Seguidores,
                Telefone = influencer.Telefone,
                FotoUrl = influencer.FotoUrl
            };
            return influencerReadDto;
        }

        public async Task<bool> Delete(int id, int usuarioId)
        {
            var influencer = await _context.Influencers
                .FirstOrDefaultAsync(i => i.Id == id && i.UsuarioId == usuarioId);
            if (influencer == null)
            {
                return false;
            }
            _context.Influencers.Remove(influencer);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
