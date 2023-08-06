using System.Security.Cryptography;

namespace CalendarWebApi.Services
{
  public static class PasswordHasher
  {
    private const int SaltSize = 16;       // 128 bits
    private const int KeySize = 32;        // 256 bits
    private const int Iterations = 100_000; // augmente avec la puissance CPU dispo
    private static readonly HashAlgorithmName Algo = HashAlgorithmName.SHA256;

    public static string Hash(string password)
    {
      byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
      byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
          password, salt, Iterations, Algo, KeySize);

      // On stocke iterations + salt + hash dans une seule chaîne
      return $"{Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public static bool Verify(string password, string hashedPassword)
    {
      var parts = hashedPassword.Split('.');
      int iterations = int.Parse(parts[0]);
      byte[] salt = Convert.FromBase64String(parts[1]);
      byte[] hash = Convert.FromBase64String(parts[2]);

      byte[] inputHash = Rfc2898DeriveBytes.Pbkdf2(
          password, salt, iterations, Algo, hash.Length);

      return CryptographicOperations.FixedTimeEquals(hash, inputHash);
    }
  }
}
