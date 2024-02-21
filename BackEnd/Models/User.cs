using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [StringLength(maximumLength: 100)]
        public string Name { get; set; }
    }
}
