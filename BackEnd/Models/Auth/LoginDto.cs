using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class LoginDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
