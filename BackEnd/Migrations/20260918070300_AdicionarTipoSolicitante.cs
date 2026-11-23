using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GastroLinkApi_2._0.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarTipoSolicitante : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Solicitante",
                table: "Propostas",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Solicitante",
                table: "Propostas");
        }
    }
}
