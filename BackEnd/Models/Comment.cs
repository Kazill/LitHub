using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        public string Text { get; set; }

        public DateTime PostedDate { get; set; } = DateTime.UtcNow;

        [ForeignKey("Id")]
        public int ProblemId { get; set; }

        [ForeignKey("Id")]
        public int? ParentCommentId { get; set; }


        public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();
    }
}