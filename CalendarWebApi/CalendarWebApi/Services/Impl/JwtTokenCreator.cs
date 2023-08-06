using CalendarWebApi.Models;
using CalendarWebApi.Services.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace CalendarWebApi.Services.Impl
{
  internal class JwtTokenCreator : IJwtTokenCreator
  {
    private readonly IJwtConfigurationFacade configuration;
    private readonly ICalendarRepository calendarRepository;
    private readonly ILogger<JwtTokenCreator> logger;

    public JwtTokenCreator(
      IJwtConfigurationFacade configuration,
      ICalendarRepository calendarRepository,
      ILogger<JwtTokenCreator> logger)
    {
      this.configuration = configuration;
      this.calendarRepository = calendarRepository;
      this.logger = logger;
    }

    public string CreateJwtToken(User user)
    {
      var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.Key));
      var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

      var claims = new[] {
             new Claim(ClaimTypes.NameIdentifier, user.UserId),
             new Claim(ClaimTypes.Name, user.Name),
             new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
             new Claim(JwtRegisteredClaimNames.Iat,
                       DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                       ClaimValueTypes.Integer64),
             new Claim(ClaimTypes.Role, user.Role ?? Roles.Default)
         };

      var token = new JwtSecurityToken(
          configuration.Issuer,
          configuration.Issuer,
          claims,
          notBefore: DateTime.UtcNow,
          expires: DateTime.UtcNow.AddMinutes(this.configuration.TokenDurationInMinutes),
          signingCredentials: credentials);

      return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<RefreshToken> CreateRefreshTokenAsync(User user)
    {
      await this.calendarRepository.PurgeRefreshTokenByUserIdAsync(user.UserId);

      var refreshToken = new RefreshToken(
        user.UserId,
        GenerateRefreshToken(),
        DateTime.UtcNow.AddDays(this.configuration.RefreshTokenDurationInDays),
        DateTime.UtcNow);

      await this.calendarRepository.InsertRefreshTokenAsync(refreshToken);

      return refreshToken;
    }

    public async Task RevokeRefreshTokenAsync(string token)
    {
      try
      {
        this.logger.LogWarning("Revoke token {token}", token);
        await this.calendarRepository.RevokeRefreshTokenAsync(token);
        this.logger.LogWarning("Token {token} rovoked", token);
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error during revoke refresh token");
        throw;
      }
    }

    public async Task<RefreshToken?> RenewRefreshTokenAsync(string token)
    {
      try
      {
        this.logger.LogWarning("Refesh token {token}", token);
        var actualRefreshToken = await this.calendarRepository.GetRefreshTokentAsync(token);

        // Token inconnu
        if (actualRefreshToken == null)
        {
          this.logger.LogWarning("Refesh token not found {token}", token);
          return null;
        }

        // token expiré
        if (DateTime.UtcNow > actualRefreshToken.ExpiresAt)
        {
          this.logger.LogWarning("Refesh token [{token}] for user [{userid}] expired at {date}", token, actualRefreshToken.UserId, actualRefreshToken.ExpiresAt);
          return null;
        }

        // token revoqué
        if (actualRefreshToken.RevokedAt.HasValue)
        {
          await this.calendarRepository.RevokeAllRefreshTokensByUserIdAsync(actualRefreshToken.UserId);
          return null;
        }

        var user = await this.calendarRepository.GetUserByIdAsync(actualRefreshToken.UserId);
        var newRefreshToken = await this.CreateRefreshTokenAsync(user);

        await this.calendarRepository.RevokeRefreshTokenAsync(token, newRefreshToken.Token);

        return newRefreshToken;

      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error during renew refresh token");
        throw;
      }
    }

    private string GenerateRefreshToken()
    {
      var randomBytes = new byte[64];
      using var rng = RandomNumberGenerator.Create();
      rng.GetBytes(randomBytes);
      return Convert.ToBase64String(randomBytes);
    }
  }
}
