using Microsoft.EntityFrameworkCore;
using BackEnd.Models;

namespace BackEnd.Data
{
    public class LithubContext:DbContext
    {
        public LithubContext(DbContextOptions<LithubContext> options)
            : base(options)
        {
        }

        public DbSet<User> User { get; set; }
		public DbSet<Project> Project { get; set; }
	}
}
