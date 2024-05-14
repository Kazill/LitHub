using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd.Data;
using BackEnd.Models;
using System.Threading.Tasks;
using System;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly LithubContext _context;

        public CommentController(LithubContext context)
        {
            _context = context;
        }

        [HttpGet("problem/{problemId}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetCommentsForProblem(int problemId)
        {
            // Fetch top-level comments
            var comments = await _context.Comment
                .Where(c => c.ProblemId == problemId && c.ParentCommentId == null)
                .ToListAsync();

            // Assuming CommentDto is a DTO that includes a collection for replies
            List<CommentDto> commentDtos = new List<CommentDto>();

            foreach (var comment in comments)
            {
                var commentDto = new CommentDto
                {
                    Id = comment.Id,
                    Author = comment.Author,
                    Text = comment.Text,
                    Url = comment.Url,
                    PostedDate = comment.PostedDate,
                    ProblemId = comment.ProblemId,
                    Replies = new List<CommentDto>() // Initialize the Replies collection
                };

                // Fetch replies for each top-level comment
                var replies = await _context.Comment
                    .Where(c => c.ParentCommentId == comment.Id)
                    .ToListAsync();

                foreach (var reply in replies)
                {
                    commentDto.Replies.Add(new CommentDto
                    {
                        // Map reply properties to your CommentDto
                        Id = reply.Id,
                        Author = reply.Author,
                        Text = reply.Text,
                        Url = reply.Url,
                        PostedDate = reply.PostedDate,
                        ProblemId = reply.ProblemId,
                        ParentCommentId = reply.ParentCommentId
                    });
                }

                commentDtos.Add(commentDto);
            }

            return commentDtos;
        }

        // GET: api/Comment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
        {
            return await _context.Comment
                .Where(c => c.ParentCommentId == null) // Fetch only top-level comments
                .ToListAsync();
        }

        // GET: api/Comment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comment = await _context.Comment.FindAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            return comment;
        }

        // GET: api/Comment/5/replies
        [HttpGet("{id}/replies")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentReplies(int id)
        {
            var replies = await _context.Comment
                .Where(c => c.ParentCommentId == id) // Fetch replies to the specified comment
                .ToListAsync();

            if (!replies.Any())
            {
                return NotFound();
            }

            return replies;
        }

        // POST: api/Comment
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment([FromBody] CommentDto commentDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors);
                Console.WriteLine($"Model state errors: {string.Join(", ", errors.Select(e => e.ErrorMessage))}");
                return BadRequest(ModelState);
            }

            var comment = new Comment
            {
                Author = commentDto.Author,
                Text = commentDto.Text,
                Url = commentDto.Url,
                ProblemId = commentDto.ProblemId,
                ParentCommentId = commentDto.ParentCommentId,
                PostedDate = commentDto.PostedDate
            };

            Console.WriteLine($"Received comment: {System.Text.Json.JsonSerializer.Serialize(commentDto)}");

            // Optionally, check if the referenced problem exists
            var problemExists = await _context.Problem.AnyAsync(p => p.Id == commentDto.ProblemId);
            if (!problemExists)
            {
                return BadRequest("Problem does not exist.");
            }

            // If ParentCommentId has value, optionally check if the parent comment exists
            if (commentDto.ParentCommentId.HasValue)
            {
                var parentCommentExists = await _context.Comment.AnyAsync(c => c.Id == commentDto.ParentCommentId.Value);
                if (!parentCommentExists)
                {
                    return BadRequest("Parent comment does not exist.");
                }
            }

            _context.Comment.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
        }
    }
}
