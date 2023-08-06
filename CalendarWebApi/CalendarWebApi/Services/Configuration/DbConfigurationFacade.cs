namespace CalendarWebApi.Services.Configuration
{
  internal class DbConfigurationFacade : IDbConfigurationFacade
  {
    private readonly IConfiguration configuration;

    public DbConfigurationFacade(IConfiguration configuration)
    {
      this.configuration = configuration;
    }

    public string? ConnectionString => this.configuration["ConnectionStrings:CalendarConnectionString"];
  }
}
