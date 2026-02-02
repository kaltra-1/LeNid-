namespace LeNid.Models
{
    public class Visit
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public int AgentId { get; set; }
        public string VisitorName { get; set; } = string.Empty;
        public DateTime VisitDate { get; set; }
        public Property? Property { get; set; }
        public Agent? Agent { get; set; }
    }
}
