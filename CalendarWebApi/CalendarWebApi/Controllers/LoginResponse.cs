using CalendarWebApi.Models;

namespace CalendarWebApi.Controllers
{
  public class LoginResponse
  {
    public int TokenDurationInMinutes { get; set; }
    public int RefreshTokenDurationInDays { get; set; }
    public User? User { get; set; }

  }
}
