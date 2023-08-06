namespace CalendarWebApi.Services.Configuration
{
  public interface IDbConfigurationFacade
  {
    string? ConnectionString { get; }
  }
}
