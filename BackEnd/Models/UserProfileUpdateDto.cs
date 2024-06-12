namespace BackEnd.Models;

public class UserProfileUpdateDto{
    public string Email { get; set; }
    public string? Company { get; set; }
    public string? GithubProfile { get; set; }
    public string PhoneNumber { get; set; }
    public string? ImageLink { get; set; }
    public string? About { get; set; }
}