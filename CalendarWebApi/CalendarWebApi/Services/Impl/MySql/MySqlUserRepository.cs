using CalendarWebApi.Extensions;
using CalendarWebApi.Models;
using CalendarWebApi.Services.Configuration;
using MySqlConnector;

namespace CalendarWebApi.Services.Impl.MySql
{
  internal class MySqlUserRepository
  {
    private readonly string connectionString;
    private readonly ILogger<MySqlUserRepository> logger;
    private const string querySelect = "SELECT UserId, Name, Email, Password, PasswordCreationDate, Role FROM calendar_user WHERE";

    public MySqlUserRepository(
      IDbConfigurationFacade dbConfigurationFacade,
      ILogger<MySqlUserRepository> logger)
    {
      connectionString = dbConfigurationFacade.ConnectionString;
      this.logger = logger;
    }

    public async Task InsertUserAsync(User user)
    {
      logger.LogInformation($"Inserting user {user.UserId}, {user.Name}");

      try
      {
        const string query = @"
            INSERT INTO `calendar_user`
            (`UserId`, `Name`, `Email`, `Password`)
            VALUES
            (@UserId, @Name, @Email, @Password);";

        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);

        command.Parameters.AddWithValue("@UserId", user.UserId);
        command.Parameters.AddWithValue("@Name", user.Name);
        command.Parameters.AddWithValue("@Email", user.Email);
        command.Parameters.AddWithValue("@Password", user.Password);

        connection.Open();
        int rowsAffected = await command.ExecuteNonQueryAsync();

        logger.LogInformation($"{rowsAffected} ligne(s) insérée(s).");
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during inserting user {UserId}, {UserName}.", user.UserId, user.Name);
        throw; // ou return null selon le comportement souhaité
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Error during user insertion.");
        throw;
      }
    }

    public async Task<User?> GetUserByNameAsync(string name)
    {
      const string query = querySelect + " Name = @name";
      logger.LogInformation($"Getting user {name}");

      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);

        command.Parameters.AddWithValue("@name", name);

        connection.Open();
        using var reader = await command.ExecuteReaderAsync();

        if (reader.Read())
        {
          var user = ReadUser(reader);

          logger.LogInformation("Get {name} ok. UserId:{userId}", name, user.UserId);

          return user;
        }

        logger.LogWarning("No user found {UserId}.", name);
        return null;
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during getting user {UserId}.", name);
        throw; // ou return null selon le comportement souhaité
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Unexpected error during getting user {UserId}.", name);
        throw;
      }
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
      const string query = querySelect + " Email = @name";
      logger.LogInformation($"Getting user {email}");

      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);

        command.Parameters.AddWithValue("@name", email);

        connection.Open();
        using var reader = await command.ExecuteReaderAsync();

        if (reader.Read())
        {
          var user = ReadUser(reader);

          logger.LogInformation("Get {name} ok. UserId:{userId}", email, user.UserId);

          return user;
        }

        logger.LogWarning("No user found {UserId}.", email);
        return null;
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during getting user {UserId}.", email);
        throw; // ou return null selon le comportement souhaité
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Unexpected error during getting user {UserId}.", email);
        throw;
      }
    }

    public async Task<User?> GetUserByIdAsync(string userId)
    {
      const string query = querySelect + " UserId = @UserId";
      logger.LogInformation($"Getting user {userId}");

      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);

        command.Parameters.AddWithValue("@UserId", userId);

        connection.Open();
        using var reader = await command.ExecuteReaderAsync();

        if (reader.Read())
        {
          var user = ReadUser(reader);

          logger.LogInformation("Get {UserId} ok.", userId);
          return user;
        }

        logger.LogWarning("No user found {UserId}.", userId);
        return null;
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during getting user {UserId}.", userId);
        throw; // ou return null selon le comportement souhaité
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Unexpected error during getting user {UserId}.", userId);
        throw;
      }
    }

    /// <summary>
    /// Si l'utilisateur n'a plus ni Token ni Refresh Token valide, il peut demander l'envoie d'un email contenant un
    /// lien de connection. Ce lien contient un mot de passe aléatoire et temporaire.
    /// </summary>
    public async Task<User?> GetUserByPasswordAsync(string password)
    {
      const string query = querySelect + " Password = @Password";
      logger.LogInformation($"Getting user by temp password {password}");

      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);

        command.Parameters.AddWithValue("@Password", password);

        connection.Open();
        using var reader = await command.ExecuteReaderAsync();

        if (reader.Read())
        {
          var user = ReadUser(reader);

          logger.LogInformation("Get user {UserId} with password {password} ok.", user.UserId, password);
          return user;
        }

        logger.LogWarning("No user found by password {password}.", password);
        return null;
      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during getting user by password {password}.", password);
        throw; // ou return null selon le comportement souhaité
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Unexpected error during getting user by password {password}.", password);
        throw;
      }
    }

    public async Task<User?> UpdateTempPasswordAsync(string userId, string? password, DateTime? dateTime)
    {
      const string query = @"UPDATE `calendar_user`
SET `Password` = @Password,
`PasswordCreationDate` = @PasswordCreationDate
WHERE `UserId` = @UserId;";
      logger.LogInformation($"Getting user by temp password {password}");

      try
      {
        await using var connection = new MySqlConnection(connectionString);
        await using var command = new MySqlCommand(query, connection);

        command.Parameters.AddWithValue("@Password", password);
        command.Parameters.AddWithValue("@PasswordCreationDate", dateTime);
        command.Parameters.AddWithValue("@UserId", userId);

        connection.Open();
        await command.ExecuteReaderAsync();
        logger.LogInformation("user {UserId}, password updated.", userId);

        return await this.GetUserByIdAsync(userId);

      }
      catch (MySqlException ex)
      {
        logger.LogError(ex, "SQL error during updating user password {userId}.", userId);
        throw; // ou return null selon le comportement souhaité
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Unexpected error during updating user password {userId}.", userId);
        throw;
      }
    }

    private static User ReadUser(MySqlDataReader reader)
    {
      return new User
      {
        UserId = reader.GetString(reader.GetOrdinal("UserId")),
        Name = reader.GetString(reader.GetOrdinal("Name")),
        Email = reader.GetString(reader.GetOrdinal("Email")),
        Password = reader.GetStringOrNull("Password"),
        PasswordCreationDate = reader.GetDateTimeOrNull("PasswordCreationDate"),
        Role = reader.GetStringOrNull("Role") ?? Roles.Default
      };
    }
  }
}
