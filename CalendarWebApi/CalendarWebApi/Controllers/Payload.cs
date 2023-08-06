namespace CalendarWebApi.Controllers
{
    public class Payload<T>
    {
        public string Key { get; set; }

        public T Data { get; set; }
    }
}
