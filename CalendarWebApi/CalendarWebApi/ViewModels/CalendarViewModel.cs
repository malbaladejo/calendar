namespace CalendarWebApi.ViewModels;

public sealed record CalendarViewModel(
  string Title,
  IReadOnlyList<CalendarMonthViewModel> Months);
