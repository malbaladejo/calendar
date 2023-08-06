using CalendarWebApi.Models;

namespace CalendarWebApi.Services.Impl.MySql
{
  internal class MySqlRepository : ICalendarRepository
  {
    private readonly MySqlUserRepository userRepository;
    private readonly MySqlLabelRepository labelRepository;
    private readonly MySqlRefreshTokenRepository refreshTokenRepository;

    public MySqlRepository(
      MySqlUserRepository userRepository,
      MySqlLabelRepository labelRepository,
      MySqlRefreshTokenRepository refreshTokenRepository)
    {
      this.userRepository = userRepository;
      this.labelRepository = labelRepository;
      this.refreshTokenRepository = refreshTokenRepository;
    }

    public Task<IEnumerable<CustomLabel>> GetLabelsByDateAsync(string userId, DateTime startDate, DateTime endDate)
      => this.labelRepository.GetLabelsByDateAsync(userId, startDate, endDate);

    public Task SetCustomLabelAsync(string userId, CustomLabel label)
      => this.labelRepository.SetCustomLabelAsync(userId, label);

    public Task InsertUserAsync(User user)
      => this.userRepository.InsertUserAsync(user);

    public Task<User?> GetUserByNameAsync(string name)
      => this.userRepository.GetUserByNameAsync(name);

    public Task<User?> GetUserByEmailAsync(string email)
      => this.userRepository.GetUserByEmailAsync(email);

    public Task<User?> GetUserByIdAsync(string userId)
      => this.userRepository.GetUserByIdAsync(userId);

    public Task<User?> GetUserByPasswordAsync(string password)
      => this.userRepository.GetUserByPasswordAsync(password);

    public Task<User?> UpdateTempPasswordAsync(string userId, string? password, DateTime? dateTime)
      => this.userRepository.UpdateTempPasswordAsync(userId, password, dateTime);

    public Task InsertRefreshTokenAsync(RefreshToken token)
      => this.refreshTokenRepository.InsertRefreshTokenAsync(token);
    public Task<RefreshToken> GetRefreshTokentAsync(string tokenValue)
      => this.refreshTokenRepository.GetRefreshTokentAsync(tokenValue);

    public Task RevokeRefreshTokenAsync(string tokenValue, string? replacedByToken = null)
        => this.refreshTokenRepository.RevokeRefreshTokenAsync(tokenValue, replacedByToken);

    public Task RevokeAllRefreshTokensByUserIdAsync(string userId)
      => this.refreshTokenRepository.RevokeAllRefreshTokensByUserIdAsync(userId);

    public Task PurgeRefreshTokenByUserIdAsync(string userId)
       => this.refreshTokenRepository.PurgeRefreshTokenByUserIdAsync(userId);
  }
}
