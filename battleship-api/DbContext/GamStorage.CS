using System.Collections.Concurrent;

public static class GameStorage
{
    public static ConcurrentDictionary<string, Game> Games = new();
}
