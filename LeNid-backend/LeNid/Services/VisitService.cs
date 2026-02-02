using LeNid.Data;
using LeNid.Models;
using LeNid.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LeNid.Services
{
    public class VisitService : IVisitService
    {
        private readonly ApplicationDbContext _context;

        public VisitService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Visit>> GetAllAsync()
        {
            return await _context.Visits
                .Include(v => v.Property)
                .Include(v => v.Agent)
                .ToListAsync();
        }

        public async Task<Visit?> GetByIdAsync(int id)
        {
            return await _context.Visits.FindAsync(id);
        }

        public async Task<Visit> AddAsync(Visit visit)
        {
            _context.Visits.Add(visit);
            await _context.SaveChangesAsync();
            return visit;
        }

        public async Task<bool> UpdateAsync(int id, Visit visit)
        {
            var existing = await _context.Visits.FindAsync(id);
            if (existing == null) return false;

            existing.PropertyId = visit.PropertyId;
            existing.AgentId = visit.AgentId;
            existing.VisitorName = visit.VisitorName;
            existing.VisitDate = visit.VisitDate;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var visit = await _context.Visits.FindAsync(id);
            if (visit == null) return false;

            _context.Visits.Remove(visit);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}