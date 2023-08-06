using CalendarWebApi.Models;
using CalendarWebApi.Repository;
using Microsoft.AspNetCore.Mvc;

namespace CalendarWebApi.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class CalendarController : ControllerBase
  {
    private readonly ILogger<CalendarController> _logger;
    private readonly ICustomLabelsRepository customLabelsRepository;

    public CalendarController(ILogger<CalendarController> logger, ICustomLabelsRepository customLabelsRepository)
    {
      _logger = logger;
      this.customLabelsRepository = customLabelsRepository;
    }

    [HttpGet]
    public IEnumerable<CustomLabel> Get(string key, int year)
    {
      _logger.LogInformation($"get from [{key}]: {year}");

      return this.customLabelsRepository.GetData(key, year);
    }

    [HttpPost]
    public void SetLabel(Payload<CustomLabel> payload)
    {
      _logger.LogInformation($"set from [{payload.Key}]: {payload.Data.Date}:{payload.Data.Label}");
      this.customLabelsRepository.SetData(payload.Key, payload.Data);
    }
  }
}
