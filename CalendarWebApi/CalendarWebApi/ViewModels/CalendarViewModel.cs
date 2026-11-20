namespace CalendarWebApi.ViewModels;

public sealed record CalendarViewModel(
  string Title,
  IReadOnlyList<CalendarMonthViewModel> Months);

public sealed record CalendarMonthViewModel(
  string Title,
  IReadOnlyList<CalendarDayViewModel> Days);

public sealed record CalendarDayViewModel(
  string DisplayLabel,
  string DateIso,
  string CssClass,
  string? AccessibleLabel);
