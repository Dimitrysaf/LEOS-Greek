package europa.edit.util;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.PageLoadStrategy;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/* 	Author: Satyabrata Das
 * 	Functionality: Webdriver class to create the webdriver object
 */

public class WebDriverFactory {

    private static final Logger logger = LoggerFactory.getLogger(WebDriverFactory.class);
    public WebDriver driver;
    public static ThreadLocal<WebDriver> tlDriver = new ThreadLocal<>();
    public ConfigReader configReader;

    public WebDriverFactory() {
        configReader = new ConfigReader();
    }

    public WebDriver setUp_driver() {
        String browser = TestParameters.getInstance().getBrowser();
        logger.info("browser value is : " + browser);
        String mode = TestParameters.getInstance().getMode();
        switch (mode) {
            case "local":
                tlDriver.set(localDriver(browser));
            case "remote":
                String gridUrl = configReader.getProperty("grid.url");
                tlDriver.set(remoteDriver(browser, gridUrl));
        }
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(Constants.TIMEOUT_DELAY));
        driver.manage().deleteAllCookies();
        driver.manage().window().maximize();
        return getDriver();
    }

    public static WebDriver getDriver() {
        return tlDriver.get();
    }

    public WebDriver remoteDriver(String browser, String gridUrl) {
        DesiredCapabilities capability = new DesiredCapabilities();
        capability.setPlatform(Platform.ANY);
        capability.setCapability("ignoreZoomSetting", true);
        switch (browser) {
            case Constants.FIREFOX:
                try {
                    FirefoxOptions options = new FirefoxOptions();
                    options.addArguments("--incognito");
                    options.addArguments("--disable-gpu");
                    options.addArguments("--no-sandbox");
                    options.addArguments("--disable-browser-side-navigation");
                    options.setAcceptInsecureCerts(true);
                    options.setPageLoadStrategy(PageLoadStrategy.EAGER);
                    capability.setCapability(FirefoxOptions.FIREFOX_OPTIONS, options);
                    capability.setBrowserName(Constants.FIREFOX);
                    options.merge(capability);
                    driver = new RemoteWebDriver(new URL(gridUrl), options);
                } catch (MalformedURLException e) {
                    logger.error(e.getMessage(), e);
                }
                break;

            case Constants.EDGE:
                try {
                    EdgeOptions options = new EdgeOptions();
                    capability.setBrowserName(Constants.EDGE);
                    options.merge(capability);
                    driver = new RemoteWebDriver(new URL(gridUrl), options);
                } catch (MalformedURLException e) {
                    logger.error(e.getMessage(), e);
                }
                break;

            default:
                try {
                    ChromeOptions options = new ChromeOptions();
                    options.addArguments("--disable-gpu");
                    options.addArguments("--no-sandbox");
                    options.addArguments("--disable-browser-side-navigation");
                    options.setAcceptInsecureCerts(true);
                    options.setPageLoadStrategy(PageLoadStrategy.EAGER);
                    Map<String, Object> prefs = new HashMap<>();
                    prefs.put("profile.default_content_settings.popups", 0);
                    prefs.put("credentials_enable_service", false);
                    prefs.put("profile.password_manager_enabled", false);
                    prefs.put("download.prompt_for_download", false);
                    prefs.put("download.default_directory", configReader.getProperty("path.remote.download"));
                    options.setExperimentalOption("prefs", prefs);
                    options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
                    capability.setCapability(ChromeOptions.CAPABILITY, options);
                    capability.setBrowserName(Constants.CHROME);
                    options.merge(capability);
                    driver = new RemoteWebDriver(new URL(gridUrl), options);
/*                    Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("proxy-t2-lu.welcome.ec.europa.eu", 8012));
                    ClientConfig config = ClientConfig.defaultConfig()
                            .baseUrl(new URL(gridUrl))
                            .authenticateAs(new UsernameAndPassword("userName", "pwd"))
                            .proxy(proxy);
                    driver = RemoteWebDriver.builder()
                            .oneOf(options)
                            .config(config)
                            .build();*/
                } catch (Exception e) {
                    logger.error(e.getMessage(), e);
                }
                break;
        }
        return driver;
    }

    public WebDriver localDriver(String browser) {
        DesiredCapabilities capability;
        switch (browser) {
            case Constants.FIREFOX: // If user choose Firefox driver has been changed to Firefox
                driver = new FirefoxDriver();
                break;
            case Constants.EDGE: // If user choose edge driver has been changed to EDGE
                driver = new EdgeDriver();
                break;
            default:// If user choose Chrome driver has been changed to Chrome
                ChromeOptions options = new ChromeOptions();
                options.addArguments("--disable-gpu");
                options.addArguments("--no-sandbox");
                options.addArguments("--disable-browser-side-navigation");
                //options.addArguments("--incognito");
                options.setAcceptInsecureCerts(true);
                options.setPageLoadStrategy(PageLoadStrategy.EAGER);
                Map<String, Object> prefs = new HashMap<>();
                prefs.put("credentials_enable_service", false);
                prefs.put("profile.password_manager_enabled", false);
                prefs.put("download.default_directory", System.getProperty("user.dir") + configReader.getProperty("relative.download.path.local"));
                options.setExperimentalOption("prefs", prefs);
                options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
                capability = new DesiredCapabilities();
                capability.setCapability(ChromeOptions.CAPABILITY, options);
                capability.setBrowserName(Constants.CHROME);
                capability.setPlatform(Platform.ANY);
                capability.setCapability("ignoreZoomSetting", true);
                capability.setCapability(ChromeOptions.CAPABILITY, options);
                driver = new ChromeDriver();
        }
        return driver;
    }
}