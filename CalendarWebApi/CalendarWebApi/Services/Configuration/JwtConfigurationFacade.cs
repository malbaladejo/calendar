namespace CalendarWebApi.Services.Configuration
{
  internal class JwtConfigurationFacade : IJwtConfigurationFacade
  {
    private readonly IConfiguration configuration;

    public JwtConfigurationFacade(IConfiguration configuration)
    {
      this.configuration = configuration;
    }

    public string? Key => this.configuration["Jwt:Key"];
    public string? Issuer => this.configuration["Jwt:Issuer"];
    public int TokenDurationInMinutes => this.configuration.GetValue<int?>("Jwt:TokenDurationInMinutes") ?? 15;
    public int RefreshTokenDurationInDays => this.configuration.GetValue<int?>("Jwt:RefreshTokenDurationInDays") ?? 15;
  }
}
