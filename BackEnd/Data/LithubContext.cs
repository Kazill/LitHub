using Microsoft.EntityFrameworkCore;
using BackEnd.Models;
using System.Data;

namespace BackEnd.Data
{
    public class LithubContext:DbContext
    {
        public LithubContext(DbContextOptions<LithubContext> options)
            : base(options)
        {
        }

        public DbSet<User> User { get; set; }
        public DbSet<Problem> Problem { get; set; }
        public DbSet<Marked> Marked { get; set; }
        public DbSet<Comment> Comment { get; set; }
        public DbSet<Like> Like { get; set; }
        public DbSet<WaitingForApproval> Waiting { get; set; }
    }
}
