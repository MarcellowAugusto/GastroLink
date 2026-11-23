using Microsoft.EntityFrameworkCore;

namespace GastroLinkApi_2._0.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Entites.Usuario> Usuarios { get; set; } = null!;
        public DbSet<Entites.Influencer> Influencers { get; set; } = null!;
        public DbSet<Entites.Restaurante> Restaurantes { get; set; } = null!;
        public DbSet<Entites.Proposta> Propostas { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Usuario 1 : 1 Influencer
            modelBuilder.Entity<Entites.Influencer>()
                .HasOne(i => i.Usuario)
                .WithOne(u => u.Influencer)
                .HasForeignKey<Entites.Influencer>(i => i.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            // Usuario 1 : 1 Restaurante
            modelBuilder.Entity<Entites.Restaurante>()
                .HasOne(r => r.Usuario)
                .WithOne(u => u.Restaurante)
                .HasForeignKey<Entites.Restaurante>(r => r.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            // Influencer 1 : N Propostas
            modelBuilder.Entity<Entites.Proposta>()
                .HasOne(p => p.Influencer)
                .WithMany(i => i.Propostas)
                .HasForeignKey(p => p.InfluencerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Restaurante 1 : N Propostas
            modelBuilder.Entity<Entites.Proposta>()
                .HasOne(p => p.Restaurante)
                .WithMany(r => r.Propostas)
                .HasForeignKey(p => p.RestauranteId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
