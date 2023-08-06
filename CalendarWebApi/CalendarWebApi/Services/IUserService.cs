using CalendarWebApi.Models;

namespace CalendarWebApi.Services
{
  public interface IUserService
  {
    Task<User> CreateUserAsync(string name, string email);

    Task<User> GetUserByIdAsync(string userId);

    Task<User> GetUserAsync(string nameOrEmail);

    Task<User> GetUserByPasswordAsync(string userId);

    Task SendConnexionEmailAsync(string userId);
  }
}
