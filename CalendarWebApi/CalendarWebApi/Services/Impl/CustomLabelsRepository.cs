using CalendarWebApi.Models;
using System.Text.Json;

namespace CalendarWebApi.Services.Impl
{
  public class CustomLabelsRepository
  {
    private readonly string dataPath;
    private readonly JsonSerializerOptions jsonSerializerOptions;
    public CustomLabelsRepository(IWebHostEnvironment environment)
    {
      dataPath = Path.Combine(environment.ContentRootPath, "data");

      jsonSerializerOptions = new JsonSerializerOptions
      {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
      };
    }

    public IEnumerable<CustomLabel> GetData(string key, int year)
    {
      EnsureUserDataDirectory(key);

      var filePath = GetFileDataPath(key, year);
      if (!File.Exists(filePath))
        return new CustomLabel[0];

      var json = File.ReadAllText(filePath);
      var data = JsonSerializer.Deserialize<CustomLabel[]>(json, jsonSerializerOptions);
      return data ?? new CustomLabel[0];
    }

    public void SetData(string key, CustomLabel value)
    {
      EnsureUserDataDirectory(key);
      var year = value.Date.Year;
      var filePath = GetFileDataPath(key, year);

      var data = GetData(key, year).ToList();

      var item = data.FirstOrDefault(d => DateEquals(d.Date, value.Date));
      if (item == null)
      {
        data.Add(value);
      }
      else
      {
        item.Label = value.Label;

        if (string.IsNullOrWhiteSpace(item.Label))
        {
          data.RemoveAll(d => DateEquals(d.Date, value.Date));

          if (data.Count == 0)
          {
            File.Delete(filePath);
            return;
          }
        }
      }

      var json = JsonSerializer.Serialize(data, jsonSerializerOptions);
      File.WriteAllText(filePath, json);
    }

    private bool DateEquals(DateTime date1, DateTime date2)
      => date1.Year == date2.Year &&
      date1.Month == date2.Month &&
      date1.Day == date2.Day;

    private void EnsureDataDirectory()
    {
      if (!Directory.Exists(dataPath))
        Directory.CreateDirectory(dataPath);
    }

    private void EnsureUserDataDirectory(string key)
    {
      EnsureDataDirectory();

      if (!Directory.Exists(GetUserDataPath(key)))
        Directory.CreateDirectory(GetUserDataPath(key));
    }

    private string GetUserDataPath(string key) => Path.Combine(dataPath, key);
    private string GetFileDataPath(string key, int year) => Path.Combine(GetUserDataPath(key), year.ToString() + ".json");

  }
}
