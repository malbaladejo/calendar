namespace CalendarWebApi.Models
{
  public class RefreshToken
  {
    public RefreshToken()
    {

    }

    public RefreshToken(string userId, string token, DateTime expiresAt, DateTime createdAt)
    {
      this.UserId = userId;
      this.Token = token;
      this.ExpiresAt = expiresAt;
      this.CreatedAt = createdAt;
    }

    public string UserId { get; set; }
    public string Token { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? RevokedAt { get; set; }
  }
}
