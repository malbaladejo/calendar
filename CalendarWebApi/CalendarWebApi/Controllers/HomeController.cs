using CalendarWebApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace CalendarWebApi.Controllers;

[Authorize]
public class HomeController : Controller
{
  [AllowAnonymous]
  [HttpGet]
  public IActionResult Login()
  {
    ViewData["Title"] = "Connexion";
    ViewData["IsLoginPage"] = true;
    return View();
  }

  public IActionResult Index(int offset = 0)
  {
    ViewData["IsHomePage"] = true;
    var today = DateTime.Today;
    var currentOffset = Math.Clamp(offset, -1200, 1200);
    var firstMonth = new DateTime(today.Year, today.Month, 1).AddMonths(currentOffset);
    var frenchCulture = CultureInfo.GetCultureInfo("fr-FR");
    var months = new List<CalendarMonthViewModel>();

    for (var monthOffset = 0; monthOffset < 6; monthOffset++)
    {
      var month = firstMonth.AddMonths(monthOffset);
      var days = new List<CalendarDayViewModel>();

      var daysInMonth = DateTime.DaysInMonth(month.Year, month.Month);
      for (var dayNumber = 1; dayNumber <= daysInMonth; dayNumber++)
      {
        var date = month.AddDays(dayNumber - 1);
        var isToday = date == today;
        var cssClass = isToday
          ? "calendar-day calendar-day--today"
          : "calendar-day";

        days.Add(new CalendarDayViewModel(
          DisplayLabel: date.ToString("d ddd", frenchCulture),
          DateIso: date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
          CssClass: cssClass,
          AccessibleLabel: date.ToString("D", frenchCulture)));
      }

      months.Add(new CalendarMonthViewModel(
        Title: month.ToString("MMMM yyyy", frenchCulture),
        Days: days));
    }

    var model = new CalendarViewModel(
      Title: "Calendrier",
      Months: months);

    ViewData["Title"] = model.Title;
    ViewData["CurrentYear"] = today.Year;
    ViewData["PreviousSixMonthsUrl"] = Url.Action(nameof(Index), "Home", new { offset = Math.Max(-1200, currentOffset - 6) });
    ViewData["PreviousMonthUrl"] = Url.Action(nameof(Index), "Home", new { offset = Math.Max(-1200, currentOffset - 1) });
    ViewData["NextMonthUrl"] = Url.Action(nameof(Index), "Home", new { offset = Math.Min(1200, currentOffset + 1) });
    ViewData["NextSixMonthsUrl"] = Url.Action(nameof(Index), "Home", new { offset = Math.Min(1200, currentOffset + 6) });
    return View(model);
  }
}
