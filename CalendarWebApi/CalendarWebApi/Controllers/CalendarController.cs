using CalendarWebApi.Extensions;
using CalendarWebApi.Models;
using CalendarWebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalendarWebApi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class CalendarController : ControllerBase
  {
    private readonly ILabelService labelService;
    private readonly ILogger<CalendarController> logger;

    public CalendarController(
      ILabelService labelService,
      ILogger<CalendarController> logger)
    {
      this.labelService = labelService;
      this.logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<CustomLabel>>> GetAsync(DateTime beginDate, DateTime endDate)
    {
      // TODO faire une userFacade
      var userId = User.GetUserId();
      this.logger.LogInformation("Getting labels {start}-{end} for user {user}", beginDate, endDate, userId);

      try
      {
        if (beginDate > endDate)
        {
          return BadRequest("beginDate must be before endDate.");
        }

        var results = await this.labelService.GetLabelsByDateAsync(userId, beginDate, endDate);

        return Ok(results);
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error");
        return BadRequest();
      }
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CustomLabel>> SetLabel(CustomLabel label)
    {
      try
      {
        var userId = User.GetUserId();
        this.logger.LogInformation("Saving label {date} for user {user}", label.Date, userId);

        var result = await this.labelService.SetCustomLabelAsync(userId, label);

        return Ok(result);
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error");
        return BadRequest();
      }
    }

    [HttpPost("massupload")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<CustomLabel>>> MassUpload(IEnumerable<CustomLabel> labels)
    {
      try
      {
        var userId = User.GetUserId();
        this.logger.LogInformation("Mass upload");

        var results = new List<CustomLabel>();

        foreach (var label in labels)
        {
          var result = await this.labelService.SetCustomLabelAsync(userId, label);
          results.Add(result);
        }

        return Ok(results);
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error");
        return BadRequest();
      }
    }
  }
}
