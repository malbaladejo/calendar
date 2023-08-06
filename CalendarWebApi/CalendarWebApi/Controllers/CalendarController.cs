using CalendarWebApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace CalendarWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalendarController : ControllerBase
    {

        private readonly ILogger<CalendarController> _logger;

        public CalendarController(ILogger<CalendarController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<CustomLabel> Get(Payload<int> payload)
        {
            _logger.LogInformation($"get from [{payload.Key}]: {payload.year}");

            return new CustomLabel[0];
        }

        [HttpPost]
        public void SetLabel(Payload<CustomLabel> payload)
        {
            _logger.LogInformation($"set from [{payload.Key}]: {payload.Data.Date}:{payload.Data.Label}");
        }
    }
}