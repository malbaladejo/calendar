using CalendarWebApi.Extensions;
using CalendarWebApi.Models;
using CalendarWebApi.Services.Configuration;
using MySqlConnector;

namespace CalendarWebApi.Services.Impl.MySql
{
  internal class MySqlLabelRepository
  {
    private readonly string connectionString;
    private readonly ILogger<MySqlLabelRepository> logger;

    public MySqlLabelRepository(
      IDbConfigurationFacade dbConfigurationFacade,
      MySqlUserRepository userRepository,
      ILogger<MySqlLabelRepository> logger)
    {
      this.connectionString = dbConfigurationFacade.ConnectionString;
      this.logger = logger;
    }

    public async Task<IEnumerable<CustomLabel>> GetLabelsByDateAsync(string userId, DateTime startDate, DateTime endDate)
    {
      const string query = @"
        SELECT UserId, Date, LastUpdate, Label, Tag, Style, Color
        FROM `calendar_label`
        WHERE UserId = @UserId
        AND Date >= @Start
        AND Date < @End";

      logger.LogInformation("Getting CustomLabel {start}->{end} for user {UserId}.", startDate, endDate, userId);
      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@UserId", userId);
        command.Parameters.AddWithValue("@Start", startDate);
        command.Parameters.AddWithValue("@End", endDate);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        var results = new List<CustomLabel>();

        while (await reader.ReadAsync())
        {
          CustomLabel label = ReadLabel(reader);
          results.Add(label);
        }
        logger.LogInformation("CustomLabel CustomLabel {start}->{end} for user {UserId} retrieved successfully.", startDate, endDate, userId);

        return results;
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex,
            "SQL error while getting CustomLabel {start}->{end} for user {UserId}.",
            startDate, endDate, userId);
        throw;
      }
      catch (Exception ex)
      {
        logger.LogError(ex,
            "Unexpected error while getting CustomLabel {start}->{end} for user {UserId}.",
            startDate, endDate, userId);
        throw;
      }
    }

    private static CustomLabel ReadLabel(MySqlDataReader reader)
    {
      return new CustomLabel
      {
        UserId = reader.GetStringOrNull("UserId"),
        Date = reader.GetDateTime(reader.GetOrdinal("Date")),
        LastUpdate = reader.GetDateTime(reader.GetOrdinal("LastUpdate")),
        Label = reader.GetStringOrNull("Label"),
        Tag = reader.GetStringOrNull("Tag"),
        Style = reader.GetStringOrNull("Style"),
        Color = reader.GetStringOrNull("Color")
      };
    }

    public async Task SetCustomLabelAsync(string userId, CustomLabel label)
    {
      const string query = @"
        INSERT INTO `calendar_label`
            (`UserId`, `Date`, `LastUpdate`, `Label`, `Tag`, `Style`, `Color`)
        VALUES
            (@UserId, @Date, @LastUpdate, @Label, @Tag, @Style, @Color)
        ON DUPLICATE KEY UPDATE
            `Date` = @Date,
            `LastUpdate` = @LastUpdate,
            `Label` = @Label,
            `Tag` = @Tag,
            `Style` = @Style,
            `Color` = @Color;";

      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);

        command.Parameters.AddWithValue("@UserId", label.UserId);
        command.Parameters.AddWithValue("@Date", label.Date);
        command.Parameters.AddWithValue("@LastUpdate", label.LastUpdate);
        command.Parameters.AddWithValue("@Label", label.Label);
        command.Parameters.AddWithValue("@Tag", label.Tag);
        command.Parameters.AddWithValue("@Style", label.Style);
        command.Parameters.AddWithValue("@Color", label.Color);

        await connection.OpenAsync();
        int rowsAffected = await command.ExecuteNonQueryAsync();

        logger.LogInformation(
            "CustomLabel {Date} for user {UserId} upserted successfully ({Rows} row(s) affected).",
            label.Date, label.UserId, rowsAffected);
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex,
            "SQL error while upserting CustomLabel {Date} for user {UserId}.",
            label.Date, label.UserId);
        throw;
      }
      catch (Exception ex)
      {
        logger.LogError(ex,
            "Unexpected error while upserting CustomLabel {Date} for user {UserId}.",
            label.Date, label.UserId);
        throw;
      }
    }
  }
}
