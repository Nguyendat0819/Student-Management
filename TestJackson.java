import com.fasterxml.jackson.databind.ObjectMapper;
public class TestJackson {
    public static class Subject {
        private int Id;
        public int getId() { return Id; }
        public void setId(int id) { this.Id = id; }
    }
    public static void main(String[] args) throws Exception {
        Subject s = new Subject();
        s.setId(5);
        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writeValueAsString(s));
    }
}
