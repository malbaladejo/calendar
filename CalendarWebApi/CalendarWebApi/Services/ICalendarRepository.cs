using CalendarWebApi.Models;

namespace CalendarWebApi.Services
{
  public interface ICalendarRepository
  {
    // Label
    Task<IEnumerable<CustomLabel>> GetLabelsByDateAsync(string userId, DateTime startDate, DateTime endDate);

    Task SetCustomLabelAsync(string userId, CustomLabel label);

    // User
    Task InsertUserAsync(User user);

    Task<User?> GetUserByNameAsync(string name);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByIdAsync(string userId);
    Task<User?> GetUserByPasswordAsync(string password);

    Task<User?> UpdateTempPasswordAsync(string userId, string? password, DateTime? dateTime);

    Task InsertRefreshTokenAsync(RefreshToken token);
    Task<RefreshToken> GetRefreshTokentAsync(string tokenValue);
    Task RevokeRefreshTokenAsync(string tokenValue, string? replacedByToken = null);
    Task RevokeAllRefreshTokensByUserIdAsync(string userId);
    Task PurgeRefreshTokenByUserIdAsync(string userId);
  }
}
