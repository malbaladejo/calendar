using CalendarWebApi.Services.Configuration;
using CalendarWebApi.Services.Impl;

internal class Program
{
  private static void Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddCors(options =>
    {
      options.AddPolicy(name: "debug",
            policy =>
            {
              policy.WithOrigins("http://localhost:4200");
            });
    });

    builder.Services.AddControllers();

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();

    builder.AddSwaggerGen()
           .AddJwt();

    builder.Logging.AddLog4Net();
    builder.Services.AddCustomLabelsRepository()
                    .AddUserService()
                    .AddLabelService()
                    .AddJwtTokenCreator()
                    .AddEmailService()
                    .AddConfigurationFacade();

    var app = builder.Build();

    // sert index.html automatiquement sur "/"
    app.UseDefaultFiles();

    // sert les fichiers statiques (js, css, etc.)
    app.UseStaticFiles();


    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
      app.UseSwagger();
      app.UseSwaggerUI();
      app.UseCors("debug");
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.MapFallbackToFile("index.html");

    app.Run();
  }
}
