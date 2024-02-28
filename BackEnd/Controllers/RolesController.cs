using Microsoft.AspNetCore.Mvc;
using BackEnd.Models;
using System.Data;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private static Roles selectedRole = new Roles { Name = "Administratorius" }; // Initial default role

        // Endpoint for retrieving the selected role
        [HttpGet]
        public ActionResult<Roles> GetSelectedRole()
        {
            return Ok(selectedRole);
        }

        // Endpoint for updating the selected role
        [HttpPost("update")]
        public IActionResult UpdateSelectedRole([FromBody] Roles updatedRole)
        {
            if (updatedRole == null)
            {
                return BadRequest("Role data is missing");
            }

            // Update the selected role
            selectedRole = updatedRole;

            return Ok(selectedRole);
        }
    }
}
