using System.Security.Claims;

namespace CalendarWebApi.Extensions
{
  public static class ClaimsPrincipalExtension
  {
    public static string? GetUserId(this ClaimsPrincipal user)
      => user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    public static string? GetUserName(this ClaimsPrincipal user)
      => user.FindFirst(ClaimTypes.Name)?.Value;

    public static string? GetEmail(this ClaimsPrincipal user)
      => user.FindFirst(ClaimTypes.Email)?.Value;

  }
}
