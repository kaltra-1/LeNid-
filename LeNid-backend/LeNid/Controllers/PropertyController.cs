using LeNid.Interfaces;
using LeNid.Models;
using Microsoft.AspNetCore.Mvc;

namespace LeNid.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertiesController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> GetAll()
        {
            var properties = await _propertyService.GetAllAsync();
            return Ok(properties);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Property>> GetById(int id)
        {
            var property = await _propertyService.GetByIdAsync(id);
            if (property == null) return NotFound();
            return Ok(property);
        }

        [HttpPost]
        public async Task<ActionResult<Property>> Create(Property property)
        {
            var newProperty = await _propertyService.AddAsync(property);
            return CreatedAtAction(nameof(GetById), new { id = newProperty.Id }, newProperty);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Property property)
        {
            var success = await _propertyService.UpdateAsync(id, property);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _propertyService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}