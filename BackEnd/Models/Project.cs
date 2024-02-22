using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
	public class Project
	{
		[Key]
		public int Id { get; set; }

		[StringLength(maximumLength: 500)]
		public string Title { get; set; }

		[StringLength(maximumLength: 500)]
		public string About { get; set; }

		[StringLength(maximumLength: 500)]
		public string Languages { get; set; }

		[StringLength(maximumLength: 500)]
		public string GitHubLink { get; set; }

		public DateOnly LastUpdated { get; set; }
	}
}