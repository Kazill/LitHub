using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackEnd.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ProjectController : ControllerBase
	{
		private readonly LithubContext _context;
		public ProjectController(LithubContext context)
		{
			_context = context;
		}
		// GET: api/<UserController>
		[HttpGet]
		public List<Project> Get()
		{
			var user = _context.Project.ToList();
			return user;
		}

		// GET api/<UserController>/5
		[HttpGet("{id}")]
		public IActionResult Get(int id)
	{
    try
    {
        var project = _context.Project.FirstOrDefault(x => x.Id == id);
        if (project == null)
        {
            return NotFound(); // Return 404 if project not found
        }
        return Ok(project); // Return 200 OK with the project data
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}"); // Return 500 Internal Server Error if an exception occurs
    }
}

		// POST api/<UserController>
		[HttpPost]
		public void Post(Project model)
		{
			try
			{
				if (ModelState.IsValid)
				{
					_context.Project.Add(model);
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
public IActionResult Put(int id, [FromBody] Project updatedProject)
{
    try
    {
        var existingProject = _context.Project.FirstOrDefault(p => p.Id == id);
        if (existingProject == null)
        {
            return NotFound(); // Return 404 if project not found
        }

        // Update the existing project entity with the data from updatedProject
        existingProject.Title = updatedProject.Title;
        existingProject.About = updatedProject.About;
        existingProject.Languages = updatedProject.Languages;
        existingProject.GitHubLink = updatedProject.GitHubLink;
        existingProject.LastUpdated = updatedProject.LastUpdated;

        _context.SaveChanges(); // Save changes to the database

        return NoContent(); // Return 204 No Content if update is successful
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}"); // Return 500 Internal Server Error if an exception occurs
    }
}

		// DELETE api/<UserController>/5
		[HttpDelete("{id}")]
		public IActionResult Delete(int id)
		{
   		try
   		{
        var project = _context.Project.FirstOrDefault(p => p.Id == id);
        if (project == null)
        {
            return NotFound(); // Return 404 if project not found
        }

        _context.Project.Remove(project);
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
