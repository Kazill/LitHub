using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
                new Claim("role", user.Role),
                new Claim("userid", user.Id.ToString())
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
        public User Get(int id)
        {
            return _context.User.ToList().Find(x => x.Id == id);
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
        // DELETE api/<UserController>/Approve/5
        [HttpPost("Approve/{id}")]
        public async Task<IActionResult> ApproveUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            if (user.Role != "Prisiregistravęs")
            {
                return BadRequest("User cannot be approved.");
            }

            user.Role = "Patvirtinas"; // Assume "Patvirtinas" is the role for approved users.
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Or return Ok(user); if you want to send back the updated user data.
        }

        // POST: api/<UserController>/Revoke/5
        [HttpPost("Revoke/{id}")]
        public async Task<IActionResult> RevokeUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            if (user.Role != "Patvirtinas")
            {
                return BadRequest("User is not approved, or cannot have approval revoked.");
            }

            user.Role = "Prisiregistravęs"; // Revert to initial unapproved role.
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Or return Ok(user); if you want to send back the updated user data.
        }
        private bool UserExists(int id)
        {
            Console.WriteLine(_context.User.Any(e => e.Id == id));
            return _context.User.Any(e => e.Id == id);
        }
    }
}