using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    public class Problem
    {
        [Key]
        public int Id { get; set; }

        [StringLength(maximumLength: 100)]
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateOnly lastUpdate { get; set; }
        [StringLength(maximumLength: 100)]
        public string? Languages { get; set; }
        [StringLength(maximumLength: 100)]
        public string? Link { get; set; }
        [StringLength(maximumLength: 100)]
        public string? Source { get; set; }
        public bool? IsClosed { get; set; }
        public bool? IsPrivate { get; set; }
        public int? SourceId { get; set; }
        [ForeignKey("SourceId")]
        [DeleteBehavior(DeleteBehavior.SetNull)]
        public User? User { get; set; }
    }
}
