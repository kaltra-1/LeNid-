using LeNid.Models;

namespace LeNid.Services.Interfaces
{
    public interface IVisitService
    {
        Task<IEnumerable<Visit>> GetAllAsync();
        Task<Visit?> GetByIdAsync(int id);
        Task<Visit> AddAsync(Visit visit);
        Task<bool> UpdateAsync(int id, Visit visit);
        Task<bool> DeleteAsync(int id);
    }
}