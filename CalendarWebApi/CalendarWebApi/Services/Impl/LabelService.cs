using CalendarWebApi.Extensions;
using CalendarWebApi.Models;

namespace CalendarWebApi.Services.Impl
{
  internal class LabelService : ILabelService
  {
    private readonly ICalendarRepository calendarRepository;
    private readonly ILogger<LabelService> logger;

    public LabelService(
      ICalendarRepository calendarRepository,
      ILogger<LabelService> logger)
    {
      this.calendarRepository = calendarRepository;
      this.logger = logger;
    }

    public async Task<IEnumerable<CustomLabel>> GetLabelsByDateAsync(string userId, DateTime startDate, DateTime endDate)
    {
      this.logger.LogInformation("Getting label {start}->{end} for user {userId}", startDate, endDate, userId);
      try
      {
        var results = await this.calendarRepository.GetLabelsByDateAsync(userId, startDate.BeginOfDay(), endDate.EndOfDay());
        this.logger.LogInformation("Number of label {count} for {start}->{end} for user {userId}", results.Count(), startDate, endDate, userId);
        return results;
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error during creating labels.");
        throw;
      }
    }

    public async Task<CustomLabel> SetCustomLabelAsync(string userId, CustomLabel label)
    {
      this.logger.LogInformation("Saving label {date} for user {userId}", label.Date, userId);
      try
      {
        label.UserId = userId;

        if (!label.LastUpdate.HasValue)
          label.LastUpdate = DateTime.UtcNow;

        await this.calendarRepository.SetCustomLabelAsync(userId, label);
        this.logger.LogInformation("Label {id} {date}  saved", label.UserId, label.Date);

        return label;
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error during saving label.");
        throw;
      }
    }
  }
}
