using Microsoft.OpenApi.Models;

internal static class SwaggerExtensions
{
  public static WebApplicationBuilder AddSwaggerGen(this WebApplicationBuilder builder)
  {
    builder.Services.AddSwaggerGen(options =>
    {
      //options.AddSecurityDefinition("Bearer",
      //    new OpenApiSecurityScheme
      //    {
      //      In = ParameterLocation.Header,
      //      Description = "Please enter token",
      //      Name = "Authorization",
      //      Type = SecuritySchemeType.Http,
      //      BearerFormat = "JWT",
      //      Scheme = "bearer"
      //    });

      options.AddSecurityRequirement(
          new OpenApiSecurityRequirement
          {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{ }
                    }
          });
    });

    return builder;
  }
}
