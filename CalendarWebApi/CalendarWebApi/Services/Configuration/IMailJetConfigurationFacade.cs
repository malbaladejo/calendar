namespace CalendarWebApi.Services.Configuration
{
  public interface IMailJetConfigurationFacade
  {
    string? ApiKey { get; }
    string? SecretKey { get; }
    string? Sender { get; }
  }
}
