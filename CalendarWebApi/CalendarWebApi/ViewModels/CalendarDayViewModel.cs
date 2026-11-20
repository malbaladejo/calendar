using CalendarWebApi.Models;

namespace CalendarWebApi.ViewModels;

public sealed record CalendarDayViewModel(
  string DisplayLabel,
  string DateIso,
  string CssClass,
  string? AccessibleLabel,
  CustomLabel? CustomLabel);
