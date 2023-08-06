namespace CalendarWebApi.Repository
{
    public class CustomLabelsRepository
    {
        private readonly string dataPath;
        public CustomLabelsRepository(IWebHostEnvironment environment)
        {
            this.dataPath = Path.Combine(environment.WebRootPath, "data");
        }

        private void EnsureDataDirectory()
        {
            if (!Directory.Exists(this.dataPath))
                Directory.CreateDirectory(this.dataPath);
        }

        private void EnsureUserDataDirectory(string key)
        {

            if (!Directory.Exists(this.GetUserDataPath(key)))
                Directory.CreateDirectory(this.GetUserDataPath(key));
        }

        private string GetUserDataPath(string key) => Path.Combine(this.dataPath, key);
    }
}
