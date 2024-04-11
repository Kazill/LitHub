using System.ComponentModel.DataAnnotations;
namespace BackEnd.Models;

public class RegisterDto
{
    [Required]
    public string UserName { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
    [Required]
    [DataType(DataType.Password)]
    public string PasswordConfirm { get; set; }
    [Required]
    [Phone]
    public string PhoneNumber { get; set; }
}