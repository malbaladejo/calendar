using CalendarWebApi.Extensions;
using CalendarWebApi.Models;
using CalendarWebApi.Services;
using CalendarWebApi.Services.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalendarWebApi.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class AuthenticateController : ControllerBase
  {
    private readonly IJwtTokenCreator jwtTokenCreator;
    private readonly IUserService userService;
    private readonly IJwtConfigurationFacade configuration;
    private readonly ILogger<AuthenticateController> logger;

    public AuthenticateController(
      IJwtTokenCreator jwtTokenCreator,
      IUserService userService,
       IJwtConfigurationFacade configuration,
      ILogger<AuthenticateController> logger)
    {
      this.jwtTokenCreator = jwtTokenCreator;
      this.userService = userService;
      this.configuration = configuration;
      this.logger = logger;
    }

    [AllowAnonymous]
    [HttpPost("login-request")]
    public async Task<ActionResult> LoginRequestAsync(string name)
    {
      try
      {
        this.logger.LogInformation("Request Login for {user}", name);

        var user = await this.userService.GetUserAsync(name);

        await this.userService.SendConnexionEmailAsync(user.UserId);

        return Ok();
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error");
        return Ok();
      }
    }

    [AllowAnonymous]
    [HttpGet("login")]
    public async Task<ActionResult> LoginAsync(string token)
    {
      try
      {
        this.logger.LogInformation("Login for {user}", token);

        var user = await this.userService.GetUserByPasswordAsync(token);

        if (user == null)
          return Unauthorized();

        await this.ManageTokensAsync(user);

        return this.Redirect("/");
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error");
        return BadRequest();
      }
    }

#if DEBUG
    [AllowAnonymous]
    [HttpPost("login-debug")]
    public async Task<ActionResult<LoginResponse>> LoginByNameAsync(string name)
    {
      try
      {
        this.logger.LogInformation("Login for {user}", name);

        var user = await this.userService.GetUserAsync(name);

        if (user == null)
          return Unauthorized();

        await this.ManageTokensAsync(user);
        return CreateLoginResponse(user);
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error");
        return BadRequest();
      }
    }
#endif

    //[AllowAnonymous]
    //[HttpPost("login")]
    //public async Task<ActionResult<LoginResponse>> LoginAsync([FromBody] LoginRequest request)
    //{
    //  try
    //  {
    //    this.logger.LogInformation("Login for {user}", request.UserName);

    //    var user = await this.userService.GetUserAsync(request.UserName, request.Password);

    //    if (user == null)
    //      return Unauthorized();

    //    await this.ManageTokensAsync(user);
    //    return CreateLoginResponse(user);
    //  }
    //  catch (Exception ex)
    //  {
    //    this.logger.LogError(ex, "Error");
    //    return BadRequest();
    //  }
    //}

    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAsync()
    {
      var userId = User.GetUserId();
      var refreshToken = Request.Cookies[JwtCookies.RefreshToken];
      this.logger.LogInformation("Login for {user}", userId);

      if (string.IsNullOrEmpty(refreshToken))
        return Ok();

      Response.Cookies.Append(JwtCookies.AccessToken, "", new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddDays(-1) // Date dans le passé
      });

      Response.Cookies.Append(JwtCookies.RefreshToken, "", new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddDays(-1) // Date dans le passé
      });

      try
      {
        await this.jwtTokenCreator.RevokeRefreshTokenAsync(refreshToken);
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error during logout");
      }

      return Ok();
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<ActionResult<LoginResponse>> RefreshAsync()
    {
      try
      {
        string? refreshToken = Request.Cookies[JwtCookies.RefreshToken];

        if (string.IsNullOrEmpty(refreshToken))
          return Unauthorized();

        var newRefreshToken = await this.jwtTokenCreator.RenewRefreshTokenAsync(refreshToken);
        if (newRefreshToken == null)
          return Unauthorized();

        var user = await this.userService.GetUserByIdAsync(newRefreshToken.UserId);

        this.logger.LogInformation("Refresh token for {userid}-{user}.", user.UserId, user.Name);
        await this.ManageTokensAsync(user);
        return CreateLoginResponse(user);
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error");
        return BadRequest();
      }
    }

    [HttpPost("register")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<LoginResponse>> CreateUserAsync([FromBody] RegisterRequest request)
    {
      this.logger.LogInformation("Creating user.");
      try
      {
        var user = await this.userService.CreateUserAsync(request.UserName, request.Email);

        if (user == null)
          return Unauthorized();

        await this.ManageTokensAsync(user);
        return CreateLoginResponse(user);
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error");
        return BadRequest();
      }
    }

    [Authorize]
    [HttpGet("user")]
    public ActionResult<User> GetUserInfo()
    {
      try
      {
        this.logger.LogInformation("Get user.");
        var userId = User.GetUserId();
        var name = User.GetUserName();
        var email = User.GetEmail();

        var user = new User
        {
          UserId = userId,
          Name = name,
          Email = email
        };

        this.logger.LogInformation("Get user => {user}.", user);
        return user;
      }
      catch (Exception ex)
      {
        this.logger.LogError(ex, "Error");
        return BadRequest();
      }
    }

    private ActionResult<LoginResponse> CreateLoginResponse(User? user)
    {
      if (user != null)
        user.Password = null;

      return new LoginResponse
      {
        RefreshTokenDurationInDays = this.configuration.RefreshTokenDurationInDays,
        TokenDurationInMinutes = this.configuration.TokenDurationInMinutes,
        User = user
      };
    }

    private async Task ManageTokensAsync(User user)
    {
      var refreshToken = await this.jwtTokenCreator.CreateRefreshTokenAsync(user);
      await this.ManageTokensAsync(user, refreshToken);
    }

    private async Task ManageTokensAsync(User user, RefreshToken refreshToken)
    {
      var jwtToken = this.jwtTokenCreator.CreateJwtToken(user);

      var cookieOptions = new CookieOptions
      {
        HttpOnly = true,
        Secure = true,          // HTTPS uniquement
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddMinutes(this.configuration.TokenDurationInMinutes)
      };

      var refreshCookieOptions = new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddDays(this.configuration.RefreshTokenDurationInDays)
      };

      Response.Cookies.Append(JwtCookies.AccessToken, jwtToken, cookieOptions);
      Response.Cookies.Append(JwtCookies.RefreshToken, refreshToken.Token, refreshCookieOptions);
    }
  }
}
