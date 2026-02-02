using LeNid.Models;
using LeNid.Services;
using LeNid.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LeNid.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgentsController : ControllerBase
    {
        private readonly IAgentService _agentService;

        public AgentsController(IAgentService agentService)
        {
            _agentService = agentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Agent>>> GetAll()
        {
            return Ok(await _agentService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Agent>> GetById(int id)
        {
            var agent = await _agentService.GetByIdAsync(id);
            if (agent == null) return NotFound();
            return Ok(agent);
        }

        [HttpPost]
        public async Task<ActionResult<Agent>> Create(Agent agent)
        {
            var newAgent = await _agentService.AddAsync(agent);
            return CreatedAtAction(nameof(GetById), new { id = newAgent.Id }, newAgent);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Agent agent)
        {
            var success = await _agentService.UpdateAsync(id, agent);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _agentService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}