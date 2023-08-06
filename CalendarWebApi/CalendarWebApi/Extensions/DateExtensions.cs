namespace CalendarWebApi.Extensions
{

  public static class DateTimeExtensions
  {
    public static DateTime BeginOfDay(this DateTime date) => date.Date;

    public static DateTime EndOfDay(this DateTime date) => new DateTime(date.Year, date.Month, date.Day, 23, 59, 59);

    public static DateTime FirstDayOfWeek(this DateTime date)
    {
      while (date.DayOfWeek != DayOfWeek.Monday)
        date = date.AddDays(-1);

      return date.BeginOfDay();
    }

    public static DateTime LastDayOfWeek(this DateTime date)
    {
      while (date.DayOfWeek != DayOfWeek.Sunday)
        date = date.AddDays(1);

      return date.EndOfDay();
    }

    public static DateTime FirstDayOfMonth(this DateTime date) => new DateTime(date.Year, date.Month, 1);

    public static DateTime LastDayOfMonth(this DateTime date)
        => new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month)).EndOfDay();

    public static DateTime LastDayOfYear(this DateTime date) => new DateTime(date.Year, 12, 31).EndOfDay();

    public static int NumberOfWeekSinceBeginning(this DateTime firstDayOfSequence, DateTime currentDate)
    {
      int weekNumber = 0;

      var firstDayOfCurrentWeek = currentDate.FirstDayOfWeek();
      var firstDayOfWeek = firstDayOfSequence;

      while (firstDayOfCurrentWeek != firstDayOfWeek)
      {
        weekNumber++;
        firstDayOfWeek = firstDayOfWeek.AddDays(7);
      }

      return weekNumber;
    }
  }
}
