namespace CalendarWebApi.Services.Configuration
{
  public interface IJwtConfigurationFacade
  {
    string? Issuer { get; }
    string? Key { get; }
    int RefreshTokenDurationInDays { get; }
    int TokenDurationInMinutes { get; }
  }
}
