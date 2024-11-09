public class Carrier : Ship
{
    public Carrier()
    {
        Name = "Carrier";
        Length = 5;
        Orientation = "horizontal";
        isPlaced = false;
        HitCount = 0;
        IsSunk = false;
    }
}