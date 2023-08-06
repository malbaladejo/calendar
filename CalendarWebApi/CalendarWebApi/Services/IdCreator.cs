namespace CalendarWebApi.Services
{
  public static class IdCreator
  {
    private static readonly string characters = "azertyuiopqsdfghjklmwxcvbnAZERTYUIPQSDFGHJKLMWXCVBN123456789";

    public static string Create(IdType type)
    {
      var id = FirstChar(type);
      const int numberOfWordLength = 3;
      const int wordLength = 5;
      var rnd = new Random();

      for (int i = 0; i < numberOfWordLength; i++)
      {
        id = id + "-";
        for (int j = 0; j < wordLength; j++)
        {
          var index = rnd.Next(0, characters.Length);
          id = id + characters[index];
        }
      }

      id = AppendChecksum(id);
      return id;
    }

    private static string AppendChecksum(string id)
    {
      if (string.IsNullOrEmpty(id))
      {
        throw new ArgumentException("Id cannot be null or empty.", nameof(id));
      }

      int sum = 0;
      foreach (char c in id)
      {
        sum += c;
      }

      var checksumChar = characters[sum % characters.Length];
      return id + "-" + checksumChar;
    }

    private static string FirstChar(IdType type)
    {
      switch (type)
      {
        case IdType.User:
          return "u";
        default:
          return "_";
      }
    }
  }
}
