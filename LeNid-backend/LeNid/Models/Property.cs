namespace LeNid.Models
{
    public class Property
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; 
        public int Bedrooms { get; set; }
        public decimal Price { get; set; }
    }
}
