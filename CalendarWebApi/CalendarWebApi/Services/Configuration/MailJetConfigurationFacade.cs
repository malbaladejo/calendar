namespace CalendarWebApi.Services.Configuration
{
  internal class MailJetConfigurationFacade : IMailJetConfigurationFacade
  {
    private readonly IConfiguration configuration;

    public MailJetConfigurationFacade(IConfiguration configuration)
    {
      this.configuration = configuration;
    }

    public string? ApiKey => this.configuration["MailJet:ApiKey"];
    public string? SecretKey => this.configuration["MailJet:SecretKey"];
    public string? Sender => this.configuration["MailJet:Sender"];
  }
}
