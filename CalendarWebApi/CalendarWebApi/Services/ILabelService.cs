using CalendarWebApi.Models;

namespace CalendarWebApi.Services
{
  public interface ILabelService
  {
    Task<IEnumerable<CustomLabel>> GetLabelsByDateAsync(string userId, DateTime startDate, DateTime endDate);

    Task<CustomLabel> SetCustomLabelAsync(string userId, CustomLabel label);
  }

}
