namespace backend.ShipFactory
{
    public class ShipFactory : Factory
    {
        public override Ship CreateShip(string type)
        {
            switch(type)
            {
                case "Destroyer":
                    return new Destroyer();
                case "Submarine":
                    return new Submarine();
                case "Cruiser":
                    return new Cruiser();
                case "Battleship":
                    return new Battleship();
                case "Carrier":
                    return new Carrier();
                default:
                    throw new ArgumentException($"Unknown ship type: {type}");
            }
        }
        
    }
}