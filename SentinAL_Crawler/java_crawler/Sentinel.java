import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.json.JSONObject; // Requires org.json dependency
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Sentinel {
    public static void main(String[] args) {
        // 1. SETUP: Headless Chrome (The "Ghost" Browser)
        // UPDATE THIS PATH to where your actual chromedriver.exe is located
        System.setProperty("webdriver.chrome.driver", "chromedriver.exe");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); // Runs in background
        options.addArguments("--disable-gpu");
        WebDriver driver = new ChromeDriver(options);

        try {
            // 2. INGEST: Hunt the Target
            String targetUrl = "http://localhost:8000/pirate-site.html";
            System.out.println("[*] Sentinel Crawler Activated. Target: " + targetUrl);

            driver.get(targetUrl);

            // Handover to Jsoup for fast metadata extraction
            String pageSource = driver.getPageSource();
            Document doc = Jsoup.parse(pageSource);

            // 3. EXTRACT: Contextual NLP Data (Who, Where, When)
            String title = doc.title();
            // These selector names match the <meta> tags in your pirate-site.html
            String uploader = doc.select("meta[name=uploader]").attr("content");
            String location = doc.select("meta[name=server_location]").attr("content");
            String timestamp = doc.select("meta[name=upload_date]").attr("content");

            System.out.println("[+] TARGET ACQUIRED: " + title);
            System.out.println("[+] DETECTED REGION: " + location);

            // 4. REPORT: Send Evidence to Django Core
            JSONObject payload = new JSONObject();
            payload.put("title", title);
            payload.put("url", targetUrl);
            payload.put("uploader", uploader);
            payload.put("detected_location", location);
            payload.put("timestamp", timestamp);
            payload.put("status", "DETECTED");

            sendReport(payload);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit(); // Always clean up
        }
    }

    public static void sendReport(JSONObject json) {
        try {
            // This endpoint must exist in Trombokendu's Django Backend
            URL url = new URL("http://localhost:8000/api/report/");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = json.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            System.out.println("[+] Evidence Package Uploaded (HTTP 200)");
        } catch (Exception e) {
            System.out.println("[-] CORE OFFLINE: " + e.getMessage());
        }
    }
}