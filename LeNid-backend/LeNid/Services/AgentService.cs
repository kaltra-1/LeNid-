using LeNid.Data;
using LeNid.Models;
using LeNid.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LeNid.Services
{
    public class AgentService : IAgentService
    {
        private readonly ApplicationDbContext _context;

        public AgentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Agent>> GetAllAsync()
        {
            return await _context.Agents.ToListAsync();
        }

        public async Task<Agent?> GetByIdAsync(int id)
        {
            return await _context.Agents.FindAsync(id);
        }

        public async Task<Agent> AddAsync(Agent agent)
        {
            _context.Agents.Add(agent);
            await _context.SaveChangesAsync();
            return agent;
        }

        public async Task<bool> UpdateAsync(int id, Agent agent)
        {
            var existing = await _context.Agents.FindAsync(id);
            if (existing == null) return false;

            existing.Name = agent.Name;
            existing.Phone = agent.Phone;
            existing.Email = agent.Email;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var agent = await _context.Agents.FindAsync(id);
            if (agent == null) return false;

            _context.Agents.Remove(agent);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}