namespace BackEnd.Models
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Author { get; set; }
        public string Text { get; set; }
        public string Url { get; set; }
        public DateTime PostedDate { get; set; } = DateTime.UtcNow;
        public int ProblemId { get; set; }
        // Assuming ParentCommentId might be useful in the DTO for structuring replies in the client
        public int? ParentCommentId { get; set; }
        // Collection of replies, which are also CommentDto instances
        public List<CommentDto> Replies { get; set; } = new List<CommentDto>();
    }

}
