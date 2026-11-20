using CalendarWebApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

internal static class JwtExtensions
{
  public static WebApplicationBuilder AddJwt(this WebApplicationBuilder builder)
  {
    var services = builder.Services;

    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
           .AddJwtBearer(options =>
           {
             options.TokenValidationParameters = new TokenValidationParameters
             {
               ValidateIssuer = true,
               ValidateAudience = true,
               ValidateLifetime = true,
               ValidateIssuerSigningKey = true,
               // TODO use Configuration facade ?
               ValidIssuer = builder.Configuration["Jwt:Issuer"],
               ValidAudience = builder.Configuration["Jwt:Issuer"],
               IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
             };

             options.Events = new JwtBearerEvents
             {
               OnChallenge = context =>
               {
                 if (!context.Request.Path.StartsWithSegments("/api") &&
                     context.Request.Headers.Accept.Any(value => value?.Contains("text/html", StringComparison.OrdinalIgnoreCase) == true))
                 {
                   context.HandleResponse();
                   context.Response.Redirect("/Home/Login");
                 }

                 return Task.CompletedTask;
               },
               OnMessageReceived = context =>
               {
                 context.Token = context.Request.Cookies[JwtCookies.AccessToken];
                 return Task.CompletedTask;
               }
             };
           });
    services.AddControllersWithViews();

    return builder;
  }
}
