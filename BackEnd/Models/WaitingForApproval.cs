using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
namespace BackEnd.Models;

public class WaitingForApproval
{
    [Key]
    public int Id { get; set; }
    public User user { get; set; }
    [StringLength(maximumLength: 20)]
    public string Status { get; set; }
}