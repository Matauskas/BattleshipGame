using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;

namespace backend.GameManager
{
    public class GameManager
    {
        private static GameManager _instance;
        private static readonly object _lock = new object();
        public Dictionary<string, Game> ActiveGames { get; private set; }
        public Dictionary<string, int> PlayerScores { get; private set; }

        private GameManager()
        {
            ActiveGames = new Dictionary<string, Game>(); // Track active games by an ID or key
            PlayerScores = new Dictionary<string, int>(); // Track player scores by player ID or name
        }


        public static GameManager Instance
        {
            get
            {
                lock(_lock)
                {
                    if(_instance == null)
                    {
                        _instance = new GameManager();
                    }
                    return _instance;
                }
            }
            
        }

        public void UpdatePlayerScore(string playerId, int score)
        {
            if (PlayerScores.ContainsKey(playerId))
            {
                PlayerScores[playerId] += score;
            }
            else
            {
                PlayerScores[playerId] = score;
            }
        }

        public int GetPlayerScore(string playerId)
        {
            return PlayerScores.ContainsKey(playerId) ? PlayerScores[playerId] : 0;
        }
    }
}
