using System.Text;
using BackEnd.Controllers;
using BackEnd.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DBConnection");
builder.Services.AddDbContext<LithubContext>(option => {
    option.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddTransient<ImagesController>();


var provider = builder.Services.BuildServiceProvider();
var configuration = provider.GetService<IConfiguration>();
builder.Services.AddCors(options =>
{
    var frontendURL = configuration.GetValue<string>("frontend_url");

    options.AddDefaultPolicy(builder =>
    {
        builder./*WithOrigins(frontendURL).*/AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin => true).AllowCredentials(); // allow credentials;
    });
});

builder.Services.AddControllers();

var key = Encoding.ASCII.GetBytes(builder.Configuration["AppSettings:Token"]);

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdministratorPolicy", policy => policy.RequireRole("Administratorius"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();
