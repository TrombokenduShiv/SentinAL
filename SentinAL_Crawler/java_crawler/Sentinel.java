import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.json.JSONObject;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest; // Added for Hashing
import java.nio.charset.StandardCharsets;

public class Sentinel {
    public static void main(String[] args) {
        // 1. SETUP
        System.setProperty("webdriver.chrome.driver", "chromedriver.exe"); // Ensure this path is correct!

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); 
        options.addArguments("--disable-gpu");
        // Fix for some environments:
        options.addArguments("--remote-allow-origins=*"); 
        
        WebDriver driver = new ChromeDriver(options);

        try {
            // 2. INGEST
            // NOTE: We will serve this using python -m http.server 8080
            String targetUrl = "http://localhost:8080/pirate-site.html"; 
            System.out.println("[*] Sentinel Crawler Activated. Target: " + targetUrl);

            driver.get(targetUrl);

            String pageSource = driver.getPageSource();
            Document doc = Jsoup.parse(pageSource);

            // 3. EXTRACT (Mapping to Backend Terminology)
            String title = doc.title();
            String uploader = doc.select("meta[name=uploader]").attr("content");
            String location = doc.select("meta[name=server_location]").attr("content");
            String timestamp = doc.select("meta[name=upload_date]").attr("content");
            
            // Generate SHA-256 Hash of the HTML source (The "Fingerprint")
            String htmlHash = calculateSHA256(pageSource);

            System.out.println("[+] TARGET ACQUIRED: " + title);
            System.out.println("[+] LOCATION: " + location);
            System.out.println("[+] EVIDENCE HASH: " + htmlHash.substring(0, 10) + "...");

            // 4. REPORT (Constructing Nested JSON)
            JSONObject innerData = new JSONObject();
            innerData.put("page_title", title); // Matches Backend 'page_title'
            innerData.put("url", targetUrl);
            innerData.put("uploader_name", uploader);
            innerData.put("server_location_code", location); // Matches Backend 'server_location_code'
            innerData.put("upload_date", timestamp);
            innerData.put("html_hash", htmlHash); // Critical for Verification

            JSONObject payload = new JSONObject();
            payload.put("scraped_data", innerData); // WRAPPER REQUIRED BY SERIALIZER

            sendReport(payload);

            Thread.sleep(2000);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit();
        }
    }

    // Helper function for Hashing
    public static String calculateSHA256(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            return "HASH_ERROR";
        }
    }

    public static void sendReport(JSONObject json) {
        try {
            URL url = new URL("http://localhost:8000/api/report/");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = json.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = conn.getResponseCode();
            System.out.println("[+] Evidence Package Uploaded (HTTP " + responseCode + ")");
            
            if (responseCode != 201) {
                System.out.println("[-] Warning: Backend rejected the report. Check Server Logs.");
            }

        } catch (Exception e) {
            System.out.println("[-] CORE OFFLINE: " + e.getMessage());
        }
    }
}