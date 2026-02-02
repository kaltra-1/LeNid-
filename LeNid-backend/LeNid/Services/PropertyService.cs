using LeNid.Data;
using LeNid.Interfaces;
using LeNid.Models;
using Microsoft.EntityFrameworkCore;

namespace LeNid.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly ApplicationDbContext _context;

        public PropertyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Property>> GetAllAsync()
        {
            return await _context.Properties.ToListAsync();
        }

        public async Task<Property?> GetByIdAsync(int id)
        {
            return await _context.Properties.FindAsync(id);
        }

        public async Task<Property> AddAsync(Property property)
        {
            _context.Properties.Add(property);
            await _context.SaveChangesAsync();
            return property;
        }

        public async Task<bool> UpdateAsync(int id, Property property)
        {
            var existing = await _context.Properties.FindAsync(id);
            if (existing == null) return false;

            existing.Title = property.Title;
            existing.Location = property.Location;
            existing.Type = property.Type;
            existing.Bedrooms = property.Bedrooms;
            existing.Price = property.Price;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property == null) return false;

            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}