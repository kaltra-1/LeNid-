using LeNid.Models;

namespace LeNid.Interfaces
{
    public interface IPropertyService
    {
        Task<IEnumerable<Property>> GetAllAsync();
        Task<Property?> GetByIdAsync(int id);
        Task<Property> AddAsync(Property property);
        Task<bool> UpdateAsync(int id, Property property);
        Task<bool> DeleteAsync(int id);
    }
}
