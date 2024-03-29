﻿using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly LithubContext _context;
        private readonly IConfiguration _configuration;
        public UserController(LithubContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]

        public ActionResult<User> Login(UserDto request)
        {
            var user = _context.User.FirstOrDefault(x => x.UserName == request.UserName && x.Password == request.Password);
            if (user == null)
            {
                return BadRequest("Blogas vartotojas ar slaptazodis");
            }
            string token = CreateToken(user);
            return Ok(token);
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim> {
                new Claim("username", user.UserName),
                new Claim("role", user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        // GET: api/<UserController>
        [HttpGet]
        public List<User> Get()
        {
            var user = _context.User.ToList();
            return user;
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return _context.User.Select(x => x.Id == id).ToString();
        }

        // GET api/<UserController>/5
        [HttpGet("username/{username}")]
        public IActionResult Get(string username)
        {
            var user = _context.User.FirstOrDefault(x => x.UserName == username);
            if (user == null)
            {
                return NotFound(); // Return 404 Not Found if user is not found
            }
            return Ok(user);
        }


        // POST api/<UserController>
        [HttpPost]
        public void Post(User model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _context.User.Add(model);
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