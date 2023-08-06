namespace CalendarWebApi.Services.Configuration
{
  internal static class ConfigurationExtensions
  {
    public static IServiceCollection AddConfigurationFacade(this IServiceCollection services)
    {
      services.AddSingleton<IDbConfigurationFacade, DbConfigurationFacade>();
      services.AddSingleton<IJwtConfigurationFacade, JwtConfigurationFacade>();
      services.AddSingleton<IMailJetConfigurationFacade, MailJetConfigurationFacade>();
      services.AddSingleton<ILoginConfigurationFacade, LoginConfigurationFacade>();
      return services;
    }
  }
}
