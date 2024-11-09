public class Cruiser : Ship
{
    public Cruiser()
    {
        Name = "Cruiser";
        Length = 3;
        Orientation = "horizontal";
        isPlaced = false;
        HitCount = 0;
        IsSunk = false;
    }
}