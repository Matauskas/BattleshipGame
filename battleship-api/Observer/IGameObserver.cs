public interface IGameObserver
{
    Task Update(Game game, string messageType, object data);
}