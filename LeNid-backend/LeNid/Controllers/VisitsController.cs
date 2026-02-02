using LeNid.Models;
using LeNid.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LeNid.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitsController : ControllerBase
    {
        private readonly IVisitService _visitService;

        public VisitsController(IVisitService visitService)
        {
            _visitService = visitService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visit>>> GetAll()
        {
            var visits = await _visitService.GetAllAsync();
            return Ok(visits);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Visit>> GetById(int id)
        {
            var visit = await _visitService.GetByIdAsync(id);
            if (visit == null) return NotFound();
            return Ok(visit);
        }

        [HttpPost]
        public async Task<ActionResult<Visit>> Create(Visit visit)
        {
            var newVisit = await _visitService.AddAsync(visit);
            return CreatedAtAction(nameof(GetById), new { id = newVisit.Id }, newVisit);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Visit visit)
        {
            var success = await _visitService.UpdateAsync(id, visit);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _visitService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}