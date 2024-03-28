using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Like
    {
        [Key]
        public int Id { get; set; }
        public string userName { get; set; }
        public string role { get; set; }
        public int problemId { get; set; }
        public int commentId { get; set; }
    }
}
