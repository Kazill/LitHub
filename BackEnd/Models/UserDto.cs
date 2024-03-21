using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class UserDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
