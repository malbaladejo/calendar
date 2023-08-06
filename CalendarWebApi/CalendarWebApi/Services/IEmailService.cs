namespace CalendarWebApi.Services
{
  internal interface IEmailService
  {
    Task SendEmailAsync(string recipient, string subject, string htmlBody);
  }
}
