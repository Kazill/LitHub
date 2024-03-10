using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Marked
    {
        [Key]
        public int Id { get; set; }
        public string userName { get;set; }
        public int problemId { get; set; }
    }
}
