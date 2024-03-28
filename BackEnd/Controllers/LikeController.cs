using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikeController : ControllerBase
    {
        private readonly LithubContext _context;

        public LikeController(LithubContext context)
        {
            _context = context;
        }

        // GET: api/Like
        [HttpGet]
        public ActionResult<IEnumerable<Like>> GetLikes()
        {
            return _context.Like.ToList();
        }

        // GET: api/Like/5
        [HttpGet("{id}")]
        public ActionResult<Like> GetLike(int id)
        {
            var like = _context.Like.Find(id);

            if (like == null)
            {
                return NotFound();
            }

            return like;
        }

        // POST: api/Like
        [HttpPost]
        public ActionResult<Like> PostLike(Like like)
        {
            _context.Like.Add(like);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetLike), new { id = like.Id }, like);
        }

        // DELETE: api/Like/5
        [HttpDelete("{id}")]
        public IActionResult DeleteLike(int id)
        {
            var like = _context.Like.Find(id);
            if (like == null)
            {
                return NotFound();
            }

            _context.Like.Remove(like);
            _context.SaveChanges();

            return NoContent();
        }

        // PUT: api/Like/5
        [HttpPut("{id}")]
        public IActionResult PutLike(int id, Like like)
        {
            if (id != like.Id)
            {
                return BadRequest();
            }

            _context.Entry(like).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LikeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool LikeExists(int id)
        {
            return _context.Like.Any(e => e.Id == id);
        }
        // GET: api/Like/byProblemId/5
        [HttpGet("byProblemId/{problemId}")]
        public ActionResult<IEnumerable<Like>> GetLikesByProblemId(int problemId)
        {
            var likes = _context.Like.Where(l => l.problemId == problemId).ToList();

            if (likes == null || likes.Count == 0)
            {
                return NotFound();
            }

            return likes;
        }
    }
}
