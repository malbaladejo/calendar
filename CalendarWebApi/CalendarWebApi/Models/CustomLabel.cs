namespace CalendarWebApi.Models
{
  public class CustomLabel
  {
    public string? UserId { get; set; }

    public DateTime Date { get; set; }
    public DateTime? LastUpdate { get; set; }

    public string? Label { get; set; }
    public string? Tag { get; set; }

    /// <summary>
    /// <see cref="CustomLabelStyles"/>
    /// </summary>
    public string? Style { get; set; }

    /// <summary>
    /// <see cref="CustomLabelColors"/>
    /// </summary>
    public string? Color { get; set; }

    public string GetKey()
      => $"{this.UserId}-{this.Date.ToString("yyyy-MM-dd")}";
  }

  public static class CustomLabelColors
  {
    public static readonly string Red = "red";
    public static readonly string orange = "orange";
    public static readonly string yellow = "yellow";
    public static readonly string green = "green";
    public static readonly string blue = "blue";
    public static readonly string purple = "purple";
  }
  
  public static class CustomLabelStyles
  {
    public static readonly string Bold = "bold";
    public static readonly string Italic = "italic";

  }
}
