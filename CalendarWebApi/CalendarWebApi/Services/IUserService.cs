using CalendarWebApi.Models;

namespace CalendarWebApi.Services
{
  public interface IUserService
  {
    Task<User> CreateUserAsync(string name, string email, string? password = null);

    Task<User> GetUserByIdAsync(string userId);

    Task<User> GetUserAsync(string nameOrEmail);

    Task<User> GetUserByPasswordAsync(string nameOrEmail, string password, bool resetPassword = true);

    Task<string> GenerateOTPAsync(string userId);

    Task SendConnexionEmailAsync(string userId);
  }
}
