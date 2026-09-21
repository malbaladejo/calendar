using CalendarWebApi.Models;

namespace CalendarWebApi.Services.Impl.MySql
{
  internal class MockRepository : ICalendarRepository
  {
    private List<CustomLabel> labels;

    private void EnsureLabels()
    {
      if (this.labels != null)
        return;

      this.labels = new List<CustomLabel>();
      for (var i = 0; i < 60; i++)
      {
        var label = new CustomLabel();
        label.Label = i.ToString();
        label.Date = DateTime.Now.AddDays(i - 30);
        label.UserId = "1";
        label.Color = 
        this.labels.Add(label);

      }
    }

    public async Task<IEnumerable<CustomLabel>> GetLabelsByDateAsync(string userId, DateTime startDate, DateTime endDate)
    {
      this.EnsureLabels();

      return this.labels.Where(l => l.Date >= startDate && l.Date < endDate);

    }

    public async Task<RefreshToken> GetRefreshTokentAsync(string tokenValue)
    {
      return new RefreshToken
      {
        CreatedAt = DateTime.Now,
        ExpiresAt = DateTime.Now.AddMinutes(10),
        Token = "test",
        UserId = "1"
      };
    }

    private readonly User user = new User
    {
      Email = "test@test.com",
      Name = "test",
      UserId = "1"
    };

    public async Task<User?> GetUserByEmailAsync(string email) => this.user;

    public async Task<User?> GetUserByIdAsync(string userId) => this.user;

    public async Task<User?> GetUserByNameAsync(string name) => this.user;

    public async Task<User?> GetUserByPasswordAsync(string password) => this.user;

    public async Task InsertRefreshTokenAsync(RefreshToken token)
    {

    }

    public async Task InsertUserAsync(User user)
    {

    }

    public async Task PurgeRefreshTokenByUserIdAsync(string userId)
    {

    }

    public async Task RevokeAllRefreshTokensByUserIdAsync(string userId)
    {

    }

    public async Task RevokeRefreshTokenAsync(string tokenValue, string? replacedByToken = null)
    {

    }

    public async Task SetCustomLabelAsync(string userId, CustomLabel label)
    {
      var dbLabel = this.labels.FirstOrDefault(l => l.Date == label.Date);
      if (dbLabel != null)
      {
        dbLabel.Label = label.Label;
        dbLabel.Color = label.Color;
        dbLabel.Style = label.Style;
        dbLabel.Tag = label.Tag;
      }
      else
      {
        this.labels.Add(label);
      }
    }

    public async Task<User?> UpdateTempPasswordAsync(string userId, string? password, DateTime? dateTime)
    {
      this.user.Password = password;
      this.user.PasswordCreationDate = dateTime;
      return this.user;
    }
  }
}
