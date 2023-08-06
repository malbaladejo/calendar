namespace CalendarWebApi.Services.Configuration
{
  public interface ILoginConfigurationFacade
  {
    string? EmailTemplate { get; }
    string? LoginUrl { get; }
  }
}
