namespace CalendarWebApi.ViewModels;

public sealed record CalendarMonthViewModel(
  string Title,
  IReadOnlyList<CalendarDayViewModel> Days);
