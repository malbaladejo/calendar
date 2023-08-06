namespace CalendarWebApi.Services.Configuration
{
  internal class LoginConfigurationFacade : ILoginConfigurationFacade
  {
    private readonly IConfiguration configuration;

    public LoginConfigurationFacade(IConfiguration configuration)
    {
      this.configuration = configuration;
    }

    public string? EmailTemplate => this.configuration["Login:email-template"];
    public string? LoginUrl => this.configuration["Login:login-url"];
  }
}
