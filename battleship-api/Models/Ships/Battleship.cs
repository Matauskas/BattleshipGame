public class Battleship : Ship
{
    public Battleship()
    {
        Name = "Battleship";
        Length = 4;
        Orientation = "horizontal";
        isPlaced = false;
        HitCount = 0;
        IsSunk = false;
    }
}