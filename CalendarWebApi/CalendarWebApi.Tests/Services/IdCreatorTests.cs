using CalendarWebApi.Services;
using System.Text.RegularExpressions;

namespace CalendarWebApi.Tests.Services
{
  [TestClass]
  public class IdCreatorTests
  {
    // Mirrors the private `characters` field in IdCreator.
    // Used to assert every generated character is from the allowed set.
    private const string AllowedCharacters =
        "azertyuiopqsdfghjklmwxcvbnAZERTYUIPQSDFGHJKLMWXCVBN123456789";

    [TestMethod]
    [DataRow(IdType.User, "u")]
    public void Create_KnownType_StartsWithExpectedPrefix(IdType type, string expectedPrefix)
    {
      var id = IdCreator.Create(type);

      Assert.IsTrue(id.StartsWith(expectedPrefix));
    }

    [TestMethod]
    public void Create_UnknownType_StartsWithUnderscore()
    {
      // Cast an out-of-range int to IdType to hit the `default` branch
      // of FirstChar, assuming IdType is an enum without a member
      // mapped to this value.
      var unknownType = (IdType)(-1);

      var id = IdCreator.Create(unknownType);

      Assert.IsTrue(id.StartsWith("_"));
    }

    [TestMethod]
    [DataRow(IdType.User)]
    public void Create_ReturnsExpectedFormat(IdType type)
    {
      var id = IdCreator.Create(type);

      // Expected shape: <prefix>-XXXXX-XXXXX-XXXXX
      // prefix: single char, then 3 groups of 5 chars separated by '-'
      var pattern = @"^.-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}$";
      Assert.IsTrue(Regex.IsMatch(id, pattern), $"Id '{id}' did not match expected format.");
    }

    [TestMethod]
    [DataRow(IdType.User)]
    public void Create_ReturnsExpectedLength(IdType type)
    {
      var id = IdCreator.Create(type);

      // 1 (prefix) + 3 * (1 separator + 5 chars) = 1 + 18 = 19
      Assert.AreEqual(19, id.Length);
    }

    [TestMethod]
    [DataRow(IdType.User)]
    public void Create_AllGeneratedCharacters_AreFromAllowedSet(IdType type)
    {
      var id = IdCreator.Create(type);

      // Strip prefix (first char) and separators ('-') before checking
      var generatedPart = id.Substring(2); // skip "X-"
      var charsOnly = generatedPart.Replace("-", "");

      foreach (var c in charsOnly)
      {
        Assert.IsTrue(AllowedCharacters.Contains(c), $"Character '{c}' is not in the allowed set.");
      }
    }

    [TestMethod]
    public void Create_CalledTwice_ProducesDifferentIds()
    {
      // Not a strict guarantee (randomness could theoretically collide),
      // but with 61^15 possible combinations per id, collision odds are
      // astronomically low — safe for a regression test.
      var id1 = IdCreator.Create(IdType.User);
      var id2 = IdCreator.Create(IdType.User);

      Assert.AreNotEqual(id1, id2);
    }

    [TestMethod]
    public void Create_ManyCalls_AllMatchExpectedFormatAndAreUnique()
    {
      const int iterations = 1000;
      var pattern = new Regex(@"^u-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}$");

      var ids = Enumerable.Range(0, iterations)
          .Select(_ => IdCreator.Create(IdType.User))
          .ToList();

      foreach (var id in ids)
      {
        Assert.IsTrue(pattern.IsMatch(id), $"Id '{id}' did not match expected format.");
      }

      Assert.AreEqual(ids.Count, ids.Distinct().Count());
    }

    [TestMethod]
    public void Create_DoesNotThrow()
    {
      try
      {
        IdCreator.Create(IdType.User);
      }
      catch (Exception ex)
      {
        Assert.Fail($"Expected no exception, but got: {ex}");
      }
    }
  }
}
