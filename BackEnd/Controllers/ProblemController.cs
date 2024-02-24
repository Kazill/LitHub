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
            Console.WriteLine("njnj");
            try
            {
                if (ModelState.IsValid)
                {
                    _context.Problem.Add(model);
                    _context.SaveChanges();
                }
            }catch (Exception ex)
            {
                throw;
            }
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
