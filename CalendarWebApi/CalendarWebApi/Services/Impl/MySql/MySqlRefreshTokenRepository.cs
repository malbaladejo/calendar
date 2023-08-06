using CalendarWebApi.Extensions;
using CalendarWebApi.Models;
using CalendarWebApi.Services.Configuration;
using MySqlConnector;

namespace CalendarWebApi.Services.Impl.MySql
{
  internal class MySqlRefreshTokenRepository
  {
    private readonly string connectionString;
    private readonly IJwtConfigurationFacade jwtConfigurationFacade;
    private readonly ILogger<MySqlRefreshTokenRepository> logger;

    public MySqlRefreshTokenRepository(
      IDbConfigurationFacade dbConfigurationFacade,
      IJwtConfigurationFacade jwtConfigurationFacade,
      ILogger<MySqlRefreshTokenRepository> logger)
    {
      this.connectionString = dbConfigurationFacade.ConnectionString;
      this.jwtConfigurationFacade = jwtConfigurationFacade;
      this.logger = logger;
    }

    public async Task InsertRefreshTokenAsync(RefreshToken token)
    {
      const string query = @"
            INSERT INTO calendar_refresh_tokens (UserId, Token, ExpiresAt, CreatedAt)
            VALUES (@UserId, @Token, @ExpiresAt, @CreatedAt)";

      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);

        command.Parameters.AddWithValue("@UserId", token.UserId);
        command.Parameters.AddWithValue("@Token", token.Token);
        command.Parameters.AddWithValue("@ExpiresAt", token.ExpiresAt);
        command.Parameters.AddWithValue("@CreatedAt", token.CreatedAt);

        connection.Open();
        int rowsAffected = await command.ExecuteNonQueryAsync();
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during inserting refresh token for {UserId}.", token.UserId);
        throw; // ou return null selon le comportement souhaité
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Error during refresh token insertion.");
        throw;
      }
    }

    public async Task<RefreshToken> GetRefreshTokentAsync(string tokenValue)
    {
      const string query = @"SELECT UserId, Token, ExpiresAt, CreatedAt, RevokedAt
                             FROM calendar_refresh_tokens
                             WHERE Token = @Token";
      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);

        command.Parameters.AddWithValue("@Token", tokenValue);

        connection.Open();
        using var reader = await command.ExecuteReaderAsync();

        if (reader.Read())
        {
          var token = ReadToken(reader);

          logger.LogInformation("Get token {name} ok. UserId:{userId}", tokenValue, token.UserId);

          return token;
        }

        logger.LogWarning("No token found {UserId}.", tokenValue);
        return null;
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during readin refresh token {tokenValue}.", tokenValue);
        throw; // ou return null selon le comportement souhaité
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Error during refresh token read.");
        throw;
      }
    }

    public async Task RevokeRefreshTokenAsync(string tokenValue, string? replacedByToken = null)
    {
      const string query = @"UPDATE calendar_refresh_tokens
                           SET RevokedAt = @RevokedAt,
                               ReplacedByToken = @ReplacedByToken
                           WHERE Token = @Token";
      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@Token", tokenValue);
        command.Parameters.AddWithValue("@RevokedAt", DateTime.UtcNow);
        command.Parameters.AddWithValue("@ReplacedByToken", (object?)replacedByToken ?? DBNull.Value);
        await connection.OpenAsync();
        var affected = await command.ExecuteNonQueryAsync();
        if (affected == 0)
          logger.LogWarning("No token found to revoke: {Token}", tokenValue);
        else
          logger.LogInformation("{nb} Token(s) revoked: {Token}", affected, tokenValue);
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during token revocation {Token}.", tokenValue);
        throw;
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Error during token revocation.");
        throw;
      }
    }

    public async Task RevokeAllRefreshTokensByUserIdAsync(string userId)
    {
      const string query = @"UPDATE calendar_refresh_tokens
                           SET RevokedAt = @RevokedAt
                           WHERE UserId = @UserId";
      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@UserId", userId);
        command.Parameters.AddWithValue("@RevokedAt", DateTime.UtcNow);
        await connection.OpenAsync();
        var affected = await command.ExecuteNonQueryAsync();
        if (affected == 0)
          logger.LogWarning("No token found to revoke: {Token}", userId);
        else
          logger.LogInformation("{affected} Token(s) revoked for {Token}", affected, userId);
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during token revocation {Token}.", userId);
        throw;
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Error during token revocation.");
        throw;
      }
    }

    public async Task PurgeRefreshTokenByUserIdAsync(string userId)
    {
      const string query = @"DELETE FROM calendar_refresh_tokens                           
                           WHERE UserId = @UserId
                           AND ExpiresAt < @Date";
      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@UserId", userId);
        command.Parameters.AddWithValue("@Date", DateTime.UtcNow.AddDays(-2 * this.jwtConfigurationFacade.RefreshTokenDurationInDays));
        await connection.OpenAsync();
        var affected = await command.ExecuteNonQueryAsync();
        if (affected == 0)
          logger.LogWarning("No token found to delete for user: {Token}", userId);
        else
          logger.LogInformation("{nb} Tokens delete: {Token}", affected, userId);
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during token deleting for user {userId}.", userId);
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Error during token deleting.");
      }
    }

    private static RefreshToken ReadToken(MySqlDataReader reader)
    {
      return new RefreshToken
      {
        UserId = reader.GetString(reader.GetOrdinal("UserId")),
        Token = reader.GetString(reader.GetOrdinal("Token")),
        ExpiresAt = reader.GetDateTime(reader.GetOrdinal("ExpiresAt")),
        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
        RevokedAt = reader.GetDateTimeOrNull("RevokedAt")
      };
    }

  }
}
