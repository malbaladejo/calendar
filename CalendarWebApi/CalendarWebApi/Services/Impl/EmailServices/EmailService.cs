using CalendarWebApi.Services.Configuration;
using Mailjet.Client;
using Mailjet.Client.Exceptions;
using Mailjet.Client.Resources.SMS;
using Mailjet.Client.TransactionalEmails;
using Mailjet.Client.TransactionalEmails.Response;

namespace CalendarWebApi.Services.Impl
{
  internal class EmailService : IEmailService
  {
    private readonly ILogger<EmailService> logger;
    private readonly MailjetClient client;
    private readonly string sender;

    public EmailService(IMailJetConfigurationFacade configurationService,
                        ILogger<EmailService> logger)
    {
      var config = configurationService;

      if (string.IsNullOrEmpty(config.ApiKey))
        throw new Exception("You must provide Api key");

      if (string.IsNullOrEmpty(config.SecretKey))
        throw new Exception("You must provide Secret key");

      if (string.IsNullOrEmpty(config.Sender))
        throw new Exception("You must provide Sender");

      this.sender = config.Sender;

      this.client = new MailjetClient(config.ApiKey, config.SecretKey);

      this.logger = logger;
    }

    public async Task SendEmailAsync(string recipient, string subject, string htmlBody)
    {
      try
      {
        this.logger.LogInformation($"Sending email to {recipient}");


        MailjetRequest request = new MailjetRequest
        {
          Resource = Send.Resource
        };

        // construct your email with builder
        var email = new TransactionalEmailBuilder()
               .WithFrom(new SendContact(this.sender))
               .WithSubject(subject)
               .WithHtmlPart(htmlBody)
               .WithTo(new SendContact(recipient))
               .WithTrackOpens(TrackOpens.disabled)
               .Build();

        var response = await client.SendTransactionalEmailAsync(email);
        this.LogErrors(response);

        this.logger.LogInformation($"Email sent to {recipient}");
      }
      /// <exception cref="MailjetClientConfigurationException">Thrown when email count exceeds the max allowed number</exception>
      /// <exception cref="MailjetServerException">Thrown when generic error returned from the server</exception>
      /// 
      catch (MailjetClientConfigurationException e)
      {
        this.logger.LogError(e, $"Email count exceeds the max allowed number.");
        throw;
      }
      catch (MailjetServerException e)
      {
        this.logger.LogError(e, $"Generic error returned from the server");
        throw;
      }
      catch (Exception e)
      {
        this.logger.LogError(e, $"Cannot send email to {recipient}");
        throw;
      }
    }

    private void LogErrors(TransactionalEmailResponse response)
    {
      var hasError = false;
      if (response.Messages == null || response.Messages.Length == 0)
        return;

      foreach (var message in response.Messages)
      {
        this.logger.LogInformation($"Sending email to {string.Join(", ", message.To.Select(m => m.Email))}: {message.Status}");

        if (message.Errors == null)
          continue;

        hasError = true;
        foreach (var error in message.Errors)
        {
          this.logger.LogError($"Error  {error.StatusCode} - {error.ErrorMessage}");
          if (error.ErrorRelatedTo != null)
            foreach (var item in error.ErrorRelatedTo)
            {
              this.logger.LogError($"RelatedTo:  {item}");
            }
        }
      }

      if (hasError)
        throw new Exception("Error during email sending.");
    }
  }
}
