public class Submarine : Ship
{
    public Submarine()
    {
        Name = "Submarine";
        Length = 3;
        Orientation = "horizontal";
        isPlaced = false;
        HitCount = 0;
        IsSunk = false;
    }
}