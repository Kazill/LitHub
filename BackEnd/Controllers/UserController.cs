﻿using BackEnd.Data;
using BackEnd.Models;
using Firebase.Storage;
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
        private readonly ImagesController _imagesController;
        public UserController(LithubContext context, IConfiguration configuration, ImagesController imagesController)
        {
            _context = context;
            _configuration = configuration;
            _imagesController = imagesController;
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
                    Role = "Prisiregistravęs",
                    ImageLink = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT550iCbL2jq7s7PMi3ikSNrvX1zpZYiZ_BTsQ9EUk4-Q&s"
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

        [HttpPost("upload")]
        public async Task<string> UploadImage([FromBody] string imageBase64, int id)
        {
            User user = _context.User.ToList().Find(x => x.Id == id);

            string link = await _imagesController.PostImage(imageBase64, Guid.NewGuid().ToString());

            user.ImageLink = link;
            _context.Update(user);
            _context.SaveChanges();

            return link;
        }

        [HttpPost("login")]

        public ActionResult<User> Login(LoginDto request)
        {
            var user = _context.User
                .AsEnumerable() 
                .FirstOrDefault(x => 
                    x.Email == request.Email && 
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

        [HttpPost("AskConf/{username}")]
        public void AskConfirmation(string username)
        {
            var user = _context.User.FirstOrDefault(x => x.UserName == username);
            var newApproval = new WaitingForApproval
            {
                user = user,
                Status = "Laukia"
            };
            var waitting = _context.Waiting.FirstOrDefault(x => x.user == user);
            if (waitting != null) return;
            _context.Waiting.Add(newApproval);
            _context.SaveChanges();
        }
        [HttpGet("Waitting/{username}")]
        public Boolean Waiting(string username)
        {
            var user = _context.User.FirstOrDefault(x => x.UserName == username);
            if (user == null)
            {
                return false;
            }
            var waitting = _context.Waiting.FirstOrDefault(x=>x.user== user);
            if(waitting == null)
            {
                return true;
            }
            return false;
        }
        [HttpGet("Users")]
        public IActionResult getUsers()
        {
            List<object> usersList = new List<object>();
            var users = _context.User.Select(x=>new
            {
                x.UserName,
                x.Email,x.Role,x.Company,x.GithubProfile
            }).ToList();

            foreach (var user in users)
            {
                if (user.Role == "Patvirtinas")
                {
                    var projectCount = _context.Problem.Where(x => x.User.UserName == user.UserName).Count();
                    usersList.Add(new
                    {
                        user.UserName,
                        user.Email,
                        user.Role,
                        user.Company,
                        user.GithubProfile,
                        projectCount
                    });
                }
                else if(user.Role=="Prisiregistravęs")
                {
                    var workCount = _context.Marked.Where(x => x.userName == user.UserName).Count();
                    usersList.Add(new
                    {
                        user.UserName,
                        user.Email,
                        user.Role,
                        user.Company,
                        user.GithubProfile,
                        workCount
                    });
                }
            }
            return Ok(usersList);
        }
        
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateUserProfile(int id, [FromBody] UserProfileUpdateDto updateDto)
        {
            if (id <= 0 || updateDto == null)
            {
                return BadRequest();
            }

            try
            {
                var user = await _context.User.FindAsync(id);

                if (user == null)
                {
                    throw new KeyNotFoundException("User not found");
                }

                var check = await _context.User.AnyAsync(x=>x.Email==updateDto.Email);
                List<ErrorInfo> errors = new List<ErrorInfo>();

                if (_context.User.Any(x => x.Email == updateDto.Email && x.Id != id))
                {
                    errors.Add(new ErrorInfo{ error = "Email", message = "El. paštas jau egzistuoja."});
                }

                if (errors.Count() != 0)
                {
                    return BadRequest(errors);
                }
                user.Email = updateDto.Email;
                user.Company = updateDto.Company;
                user.GithubProfile = updateDto.GithubProfile;
                user.PhoneNumber = updateDto.PhoneNumber;
                user.ImageLink = updateDto.ImageLink;
                user.About = updateDto.About;

                _context.User.Update(user);
                await _context.SaveChangesAsync();
                return Ok(user);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet("work/{id}")]
        public IActionResult getWork(int id)
        {
            List<Problem> workList = new List<Problem>();
            var user = _context.User.FirstOrDefault(x=>x.Id==id);
            if (user == null)
            {
                return NotFound();
            }
                var markedList = _context.Marked.Where(x => x.userName == user.UserName).ToList();
                foreach (var item in markedList)
                {
                    var problem = _context.Problem.FirstOrDefault(x => x.Id == item.problemId);
                    if (problem != null)
                    {
                        workList.Add(problem);
                    }
                }
        
                workList = workList
                    .OrderBy(p => (p.IsClosed ?? false) || (p.IsPrivate ?? false)) // Sort by IsClosed or IsPrivate being true (true first)
                    .ThenByDescending(p => p.lastUpdate)
                    .ToList();
            return Ok(workList);
        }
    }
}