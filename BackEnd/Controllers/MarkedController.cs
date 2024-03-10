using System;
using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackEnd.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class MarkedController : ControllerBase
    {
        
        private readonly LithubContext _context;
        public MarkedController(LithubContext context)
        {
            _context = context;
        }
        // GET: api/<UserController>
        [HttpGet]
        public List<Marked> Get()
        {
            var marked = _context.Marked.ToList();
            return marked;
        }
        [HttpGet("{id}")]
        public Marked Get(int id)
        {
            return _context.Marked.ToList().Find(x => x.Id == id);
        }

        // GET api/<UserController>/5
        [HttpGet("problem/{problemId}")]
        public List<Marked> GetByProblem(int problemId)
        {
            return _context.Marked.ToList().FindAll(x => x.problemId == problemId);
        }
        // GET api/<UserController>/5
        [HttpGet("user/{userName}")]
        public List<Marked> GetByUser(string userName)
        {
            return _context.Marked.ToList().FindAll(x => x.userName == userName);
        }

        // POST api/<UserController>
        [HttpPost]
        public void Post(Marked model)
        {
            Console.WriteLine("njnj");
            try
            {
                if (ModelState.IsValid)
                {
                    _context.Marked.Add(model);
                    _context.SaveChanges();
                }
            }catch (Exception ex)
            {
                throw;
            }
        }


    }
}
