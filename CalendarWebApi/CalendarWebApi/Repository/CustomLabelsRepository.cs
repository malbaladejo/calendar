using CalendarWebApi.Models;
using System.Text.Json;

namespace CalendarWebApi.Repository
{
  public class CustomLabelsRepository : ICustomLabelsRepository
  {
    private readonly string dataPath;
    private readonly JsonSerializerOptions jsonSerializerOptions;
    public CustomLabelsRepository(IWebHostEnvironment environment)
    {
      this.dataPath = Path.Combine(environment.ContentRootPath, "data");

      this.jsonSerializerOptions = new JsonSerializerOptions
      {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
      };
    }

    public IEnumerable<CustomLabel> GetData(string key, int year)
    {
      this.EnsureUserDataDirectory(key);

      var filePath = this.GetFileDataPath(key, year);
      if (!File.Exists(filePath))
        return new CustomLabel[0];

      var json = File.ReadAllText(filePath);
      var data = JsonSerializer.Deserialize<CustomLabel[]>(json, this.jsonSerializerOptions);
      return data ?? new CustomLabel[0];
    }

    public void SetData(string key, CustomLabel value)
    {
      this.EnsureUserDataDirectory(key);
      var year = value.Date.Year;
      var filePath = this.GetFileDataPath(key, year);

      var data = this.GetData(key, year).ToList();

      var item = data.FirstOrDefault(d => this.DateEquals(d.Date, value.Date));
      if (item == null)
      {
        data.Add(value);
      }
      else
      {
        item.Label = value.Label;

        if (string.IsNullOrWhiteSpace(item.Label))
        {
          data.RemoveAll(d => this.DateEquals(d.Date, value.Date));

          if (data.Count == 0)
          {
            File.Delete(filePath);
            return;
          }
        }
      }

      var json = JsonSerializer.Serialize(data, this.jsonSerializerOptions);
      File.WriteAllText(filePath, json);
    }

    private bool DateEquals(DateTime date1, DateTime date2)
      => date1.Year == date2.Year &&
      date1.Month == date2.Month &&
      date1.Day == date2.Day;

    private void EnsureDataDirectory()
    {
      if (!Directory.Exists(this.dataPath))
        Directory.CreateDirectory(this.dataPath);
    }

    private void EnsureUserDataDirectory(string key)
    {
      this.EnsureDataDirectory();

      if (!Directory.Exists(this.GetUserDataPath(key)))
        Directory.CreateDirectory(this.GetUserDataPath(key));
    }

    private string GetUserDataPath(string key) => Path.Combine(this.dataPath, key);
    private string GetFileDataPath(string key, int year) => Path.Combine(this.GetUserDataPath(key), year.ToString() + ".json");

  }
}
