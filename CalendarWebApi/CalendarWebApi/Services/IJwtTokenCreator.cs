using CalendarWebApi.Models;

namespace CalendarWebApi.Services
{
  public interface IJwtTokenCreator
  {
    string CreateJwtToken(User user);

    Task<RefreshToken> CreateRefreshTokenAsync(User user);
    Task<RefreshToken> RenewRefreshTokenAsync(string token);
    Task RevokeRefreshTokenAsync(string token);
  }
}
