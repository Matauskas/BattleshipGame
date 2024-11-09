public class Destroyer : Ship
{
    public Destroyer()
    {
        Name = "Destroyer";
        Length = 2;
        Orientation = "horizontal";
        isPlaced = false;
        HitCount = 0;
        IsSunk = false;
    }
}
