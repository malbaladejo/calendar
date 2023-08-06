using CalendarWebApi.Services;

namespace CalendarWebApi.Models
{
  public class User
  {
    public string? UserId { get; set; }
    public string? Name { get; set; }

    public string? Email { get; set; }
    public string? Password { get; set; }

    public DateTime? PasswordCreationDate { get; set; }

    public string? Role { get; set; }

    public static User Create(string name, string email)
    {
      return new User
      {
        UserId = IdCreator.Create(IdType.User),
        Name = name,
        Email = email
      };
    }
  }
}
