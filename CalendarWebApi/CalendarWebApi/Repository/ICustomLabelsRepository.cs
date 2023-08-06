using CalendarWebApi.Models;

namespace CalendarWebApi.Repository
{
  public interface ICustomLabelsRepository
  {
    IEnumerable<CustomLabel> GetData(string key, int year);
    void SetData(string key, CustomLabel value);
  }
}