namespace CalendarWebApi.Models
{
  public class CustomLabel
  {
    public string? UserId { get; set; }

    public DateTime Date { get; set; }
    public DateTime? LastUpdate { get; set; }

    public string? Label { get; set; }
    public string? Tag { get; set; }
    public string? Style { get; set; }
    public string? Color { get; set; }

    public string GetKey()
      => $"{this.UserId}-{this.Date.ToString("yyyy-MM-dd")}";
  }
}
