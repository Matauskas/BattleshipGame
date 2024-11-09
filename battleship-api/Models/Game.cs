public class Game
{
    public string GameId { get; set; }
    public List<Team> Teams { get; set; }
    public Dictionary<string, Player> Players { get; set; }
    public string State { get; set; } = "Waiting";
    public string CurrentTurn { get; set; } // Track which team is playing
    public int CurrentPlayerIndex { get; set; } // Track the player index within the team

    public Game()
    {
        Teams = new List<Team>();
        Players = new Dictionary<string, Player>();
    }
    private readonly List<IGameObserver> _observers = new List<IGameObserver>();

    public void AddObserver(IGameObserver observer)
    {
        _observers.Add(observer);
    }

    public void RemoveObserver(IGameObserver observer)
    {
        _observers.Remove(observer);
    }

    public void NotifyObservers(string messageType, object data)
    {
        foreach (var observer in _observers)
        {
            observer.Update(this, messageType, data);
        }
    }
    
    public void PlayerJoined(Player player)
    {
        NotifyObservers("PlayerJoined", player);
        NotifyObservers("UpdateTeams", Teams);
    }
}
