using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers;

[Route("api/[controller]")]
[ApiController]

public class AdminController: ControllerBase
{
    private readonly LithubContext _context;
    private readonly IConfiguration _configuration;
    public AdminController(LithubContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }
    
    public class Info
    {
        public int Id { get; set; }
        public string username { get; set; }
        public string Status { get; set; }
    }
    
    private int GetStatusOrder(string status)
    {
        switch (status.ToLower())
        {
            case "patvirtintas":
                return 2;
            case "laukia":
                return 1;
            case "atšauktas":
                return 3;
            default:
                return 4; // If there are other status values not covered, they'll be sorted last
        }
    }
    
    // GET: api/<UserController>
    [HttpGet("waiting")]
    public List<Info> Get()
    {
        var infoList = _context.Waiting.Include(w => w.user).ToList();
        List<Info> dataList = infoList.Select(info => new Info
        {
            username = info.user.UserName, // Replace Id with username from the associated user
            Status = info.Status
        }).OrderBy(info => GetStatusOrder(info.Status))
            .ToList();
        return dataList;
    }
}