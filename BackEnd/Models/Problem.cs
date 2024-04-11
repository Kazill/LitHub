using System.ComponentModel.DataAnnotations;

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
    }
}
