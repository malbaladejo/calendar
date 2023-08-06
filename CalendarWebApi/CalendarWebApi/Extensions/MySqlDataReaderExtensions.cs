using MySqlConnector;

namespace CalendarWebApi.Extensions
{
  public static class MySqlDataReaderExtensions
  {
    public static string? GetStringOrNull(this MySqlDataReader reader, string name)
      => reader.IsDBNull(reader.GetOrdinal(name)) ? null : reader.GetString(reader.GetOrdinal(name));

    public static DateTime? GetDateTimeOrNull(this MySqlDataReader reader, string name)
      => reader.IsDBNull(reader.GetOrdinal(name)) ? null : reader.GetDateTime(reader.GetOrdinal(name));
  }
}
