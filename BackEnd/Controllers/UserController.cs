using BackEnd.Data;
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
        
        public class ErrorInfo
        {
            public string error { get; set; }
            public string message { get; set; }
        }
        
        [HttpPost("register")]
        public IActionResult Register(RegisterDto post)
        {
            try
            {
                List<ErrorInfo> errors = new List<ErrorInfo>();
                if (_context.User.Any(x => x.UserName == post.UserName))
                {
                    errors.Add(new ErrorInfo{ error = "UserName", message = "Vartotojo vardas jau egzistuoja."});
                }

                if (_context.User.Any(x => x.Email == post.Email))
                {
                    errors.Add(new ErrorInfo{ error = "Email", message = "El. paštas jau egzistuoja."});
                }

                if (post.Password != post.PasswordConfirm)
                {
                    errors.Add(new ErrorInfo{ error = "PasswordConfirm", message = "Slaptažodžiai nesutampa."});
                }

                if (errors.Count() != 0)
                {
                    return BadRequest(errors);
                }

                var newUser = new User
                {
                    UserName = post.UserName,
                    Email = post.Email,
                    Password = post.Password,
                    PhoneNumber = post.PhoneNumber,
                    Role = "Prisiregistravęs"
                };
                _context.User.Add(newUser);
                _context.SaveChanges();
                return Ok("User registered successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Klaida registracijoje: {ex.Message}");

                return StatusCode(500, "Įvyko klaida.");
            }
        }

        [HttpPost("login")]

        public ActionResult<User> Login(LoginDto request)
        {
            var user = _context.User
                .AsEnumerable() 
                .FirstOrDefault(x => 
                    x.UserName == request.UserName && 
                    x.Password == request.Password);
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