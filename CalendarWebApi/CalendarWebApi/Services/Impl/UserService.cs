using CalendarWebApi.Models;
using CalendarWebApi.Services.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace CalendarWebApi.Services.Impl
{
  internal class UserService : IUserService
  {
    private readonly ICalendarRepository calendarRepository;
    private readonly IEmailService emailService;
    private readonly ILoginConfigurationFacade loginConfigurationFacade;
    private readonly ILogger<UserService> logger;
    private readonly string htmlBodyFilePath;

    private const int passwordDurationInMinutes = 10;

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
        var password = GenerateOTP();
        var user = await this.calendarRepository.UpdateTempPasswordAsync(userId, password, DateTime.UtcNow);

        await this.SendConnexionEmailAsync(user, password);

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



    public async Task<User> GetUserByPasswordAsync(string nameOrEmail, string password)
    {
      this.logger.LogInformation("Getting user by password {name},  {password}", nameOrEmail, password);
      var user = await this.GetUserAsync(nameOrEmail);

      if (user == null)
      {
        this.logger.LogWarning("User {name} not found.", nameOrEmail);
        return null;
      }

      this.logger.LogInformation("User {userId} found", user.UserId);

      if (user.PasswordCreationDate == null || string.IsNullOrEmpty(user.Password))
      {
        this.logger.LogWarning("User {userId} has no password creation date.", user.UserId);
        return null;
      }

      this.logger.LogInformation("Password duration ok fo User {userId}", user.UserId);

      var duration = DateTime.UtcNow - user.PasswordCreationDate.Value;
      if (duration.TotalMinutes > passwordDurationInMinutes)
      {
        this.logger.LogWarning("User {userId} password expired. Duration: {duration} minutes.", user.UserId, duration.TotalMinutes);
        return null;
      }

      this.logger.LogInformation("Reset OTP for User {userId}.", user.UserId);
      await this.calendarRepository.UpdateTempPasswordAsync(user.UserId, null, null);

      if (!PasswordHasher.Verify(password, user.Password))
      {
        this.logger.LogWarning("User {userId} password does not match. Reset password.", user.UserId);
        return null;
      }

      this.logger.LogInformation("User {userId} password verified.", user.UserId);

      return user;
    }

    private async Task SendConnexionEmailAsync(User user, string password)
    {
      try
      {
        this.logger.LogInformation($"Send connexion email to {user.UserId}");
        var subject = "Votre lien sécurisé vers Calendrier est ici ";
        var htmlBody = File.ReadAllText(this.htmlBodyFilePath);
        htmlBody = htmlBody.Replace("[url]", string.Format(loginConfigurationFacade.LoginUrl, user.Name, password));
        htmlBody = htmlBody.Replace("[otp]", password);

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

    private static string GenerateOTP()
    {
      var sb = new StringBuilder(6);

      for (int i = 0; i < 6; i++)
      {
        sb.Append(RandomNumberGenerator.GetInt32(0, 10));
      }

      return sb.ToString();
    }
  }
}
