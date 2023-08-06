using CalendarWebApi.Services.Impl.MySql;

namespace CalendarWebApi.Services.Impl
{
  internal static class ServiceImplExtensions
  {
    public static IServiceCollection AddJwtTokenCreator(this IServiceCollection services)
    {
      services.AddSingleton<IJwtTokenCreator, JwtTokenCreator>();
      return services;
    }
    public static IServiceCollection AddEmailService(this IServiceCollection services)
    {
      services.AddSingleton<IEmailService, EmailService>();
      return services;
    }

    public static IServiceCollection AddUserService(this IServiceCollection services)
    {
      services.AddSingleton<IUserService, UserService>();
      return services;
    }

    public static IServiceCollection AddLabelService(this IServiceCollection services)
    {
      services.AddSingleton<ILabelService, LabelService>();
      return services;
    }

    public static IServiceCollection AddCustomLabelsRepository(this IServiceCollection services)
    {
      services
        .AddSingleton<ICalendarRepository, MySqlRepository>()
        .AddSingleton<MySqlUserRepository>()
        .AddSingleton<MySqlLabelRepository>()
        .AddSingleton<MySqlRefreshTokenRepository>();

      return services;
    }
  }
}
