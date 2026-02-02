using Microsoft.EntityFrameworkCore;
using LeNid.Models; // This allows the context to see your Property and Visit models

namespace LeNid.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Property> Properties { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<Agent> Agents { get; set; } 
    }
}