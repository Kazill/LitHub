using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
