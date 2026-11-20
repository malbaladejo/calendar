using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalendarWebApi.Controllers;

[Authorize]
public class ImportDataController : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        ViewData["Title"] = "Importer des données";
        return View();
    }
}