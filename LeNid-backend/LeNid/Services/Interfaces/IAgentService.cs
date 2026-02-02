using LeNid.Models;

namespace LeNid.Services.Interfaces
{
    public interface IAgentService
    {
        Task<IEnumerable<Agent>> GetAllAsync();
        Task<Agent?> GetByIdAsync(int id);
        Task<Agent> AddAsync(Agent agent);
        Task<bool> UpdateAsync(int id, Agent agent);
        Task<bool> DeleteAsync(int id);
    }
}