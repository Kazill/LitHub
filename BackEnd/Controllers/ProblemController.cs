using System;
using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackEnd.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class ProblemController : ControllerBase
    {
        
        private readonly LithubContext _context;
        public ProblemController(LithubContext context)
        {
            _context = context;
        }
        // GET: api/<UserController>
        [HttpGet]
        public List<Problem> Get()
        {
            var problem = _context.Problem.ToList();
            return problem;
        }
        // GET: api/<UserController>
        [HttpGet("SortedByDate")]
        public IActionResult GetSortedByDate()
        {
            var problems = _context.Problem
                .OrderByDescending(p => !p.IsClosed) // Sort by IsClosed in descending order (true first)
                .ThenBy(p => p.lastUpdate) // Then sort by lastUpdate within each group of IsClosed
                .ToList();
            return Ok(problems);
        }
        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public Problem Get(int id)
        {
            return _context.Problem.ToList().Find(x => x.Id == id);
        }

        // POST api/<UserController>
        [HttpPost]
        public void Post(Problem model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _context.Problem.Add(model);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }  

		// PUT api/<UserController>/5
		[HttpPut("{id}")]
		public IActionResult Put(int id, [FromBody] Problem updatedProblem)
		{
			try
			{
				var existingProblem = _context.Problem.FirstOrDefault(p => p.Id == id);

				if (existingProblem == null)
				{
					return NotFound(); // Return 404 if the problem is not found
				}

				// Update the properties of existingProblem with the values from the updatedProblem
				existingProblem.Title = updatedProblem.Title;
				existingProblem.Description = updatedProblem.Description;
				existingProblem.Languages = updatedProblem.Languages;
				existingProblem.Link = updatedProblem.Link;
				existingProblem.lastUpdate = updatedProblem.lastUpdate;
                existingProblem.IsClosed = updatedProblem.IsClosed;
                existingProblem.Source = updatedProblem.Source;

				_context.SaveChanges();

				return Ok(existingProblem); // Return 200 OK if the update is successful, optionally you can return the updated problem
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}"); // Return 500 Internal Server Error if an exception occurs
			}
		}


		// DELETE api/<ProblemController>/5
		[HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var problem = _context.Problem.FirstOrDefault(p => p.Id == id);
                if (problem == null)
                {
                    return NotFound(); // Return 404 if problem not found
                }

                _context.Problem.Remove(problem);
                _context.SaveChanges();

                return NoContent(); // Return 204 No Content if deletion is successful
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}"); // Return 500 Internal Server Error if an exception occurs
            }
        }
    }
}
