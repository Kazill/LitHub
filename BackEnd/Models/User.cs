using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [StringLength(maximumLength: 100)]
        public string UserName { get; set; }
        [StringLength(maximumLength: 100)]
        public string Email { get; set; }
        [StringLength(maximumLength: 100)]
        public string Password { get; set; }
        [StringLength(maximumLength: 20)]
        [Phone]
        public string PhoneNumber { get; set; }
        [DefaultValue("Prisiregistravęs")]
        [StringLength(maximumLength: 100)]
        public string Role { get; set; }

    }
}
