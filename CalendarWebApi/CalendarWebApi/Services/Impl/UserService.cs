using CalendarWebApi.Models;
using CalendarWebApi.Services.Configuration;
using System.Security.Cryptography;

namespace CalendarWebApi.Services.Impl
{
  internal class UserService : IUserService
  {
    private readonly ICalendarRepository calendarRepository;
    private readonly IEmailService emailService;
    private readonly ILoginConfigurationFacade loginConfigurationFacade;
    private readonly ILogger<UserService> logger;
    private readonly string htmlBodyFilePath;

    public UserService(
      ICalendarRepository calendarRepository,
      IEmailService emailService,
      IWebHostEnvironment environment,
      ILoginConfigurationFacade loginConfigurationFacade,
      ILogger<UserService> logger)
    {
      this.calendarRepository = calendarRepository;
      this.emailService = emailService;
      this.loginConfigurationFacade = loginConfigurationFacade;
      this.logger = logger;
      this.htmlBodyFilePath = Path.Combine(environment.WebRootPath, this.loginConfigurationFacade.EmailTemplate);
    }

    public async Task<User> CreateUserAsync(string name, string email)
    {
      this.logger.LogInformation("Creating user {name}", name);
      try
      {
        // TODO check if name or email allready used

        var user = User.Create(name, email);
        await this.calendarRepository.InsertUserAsync(user);
        this.logger.LogInformation("User created with id:{id}", user.UserId);
        return user;
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error during creating user.");
        throw;
      }
    }

    public async Task SendConnexionEmailAsync(string userId)
    {
      this.logger.LogInformation("Sending connexion email for user {userId}", userId);
      try
      {
        var password = GenerateUrlSafeToken();
        var user = await this.calendarRepository.UpdateTempPasswordAsync(userId, password, DateTime.UtcNow);

        await this.SendConnexionEmailAsync(user);

        this.logger.LogInformation("Connexion email sent for user {id}", userId);
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error during sending connexion email for {userId}.", userId);
        throw;
      }
    }

    public async Task<User> GetUserByIdAsync(string userId)
    {
      this.logger.LogInformation("Getting user by id {name}", userId);
      User? user = null;

      user = await this.calendarRepository.GetUserByIdAsync(userId);

      if (user == null)
      {
        // TODO must have a more explicit error
        throw new InvalidOperationException("User not found");
      }
      return user;
    }

    private const int passwordDurationInMinutes = 10;

    public async Task<User> GetUserByPasswordAsync(string password)
    {
      this.logger.LogInformation("Getting user by password {password}", password);
      User? user = null;

      user = await this.calendarRepository.GetUserByPasswordAsync(password);

      if (user == null)
      {
        return null;
      }

      if (user.PasswordCreationDate == null)
      {
        return null;
      }

      var duration = DateTime.UtcNow - user.PasswordCreationDate.Value;
      if (duration.TotalMinutes > passwordDurationInMinutes)
      {
        return null;
      }

      await this.calendarRepository.UpdateTempPasswordAsync(user.UserId, null, null);

      return user;
    }

    private async Task SendConnexionEmailAsync(User user)
    {
      try
      {
        this.logger.LogInformation($"Send connexion email to {user.UserId}");
        var subject = "Votre lien sécurisé vers Calendrier est ici ";
        var htmlBody = File.ReadAllText(this.htmlBodyFilePath);
        htmlBody = htmlBody.Replace("[url]", $"{loginConfigurationFacade.LoginUrl}{user.Password}");

        await this.emailService.SendEmailAsync(user.Email, subject, htmlBody);
        this.logger.LogInformation($"Connexion email sent to {user.UserId}");
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, $"Cannot send connexion email to {user.UserId}");
      }
    }

    public async Task<User> GetUserAsync(string nameOrEmail)
    {
      this.logger.LogInformation("Getting user by name or emails {name}", nameOrEmail);
      User? user = null;

      if (nameOrEmail.Contains("@"))
        user = await this.calendarRepository.GetUserByEmailAsync(nameOrEmail);
      else
        user = await this.calendarRepository.GetUserByNameAsync(nameOrEmail);

      if (user == null)
      {
        // TODO must have a more explicit error
        throw new InvalidOperationException("User not found");
      }
      return user;
    }

    private static string GenerateUrlSafeToken(int byteLength = 32)
    {
      byte[] bytes = RandomNumberGenerator.GetBytes(byteLength);
      return Convert.ToBase64String(bytes)
          .Replace("+", "-")
          .Replace("/", "_")
          .TrimEnd('=');
    }
  }
}
