package europa.edit.util;

import com.google.common.io.Files;
import com.hierynomus.msdtyp.AccessMask;
import com.hierynomus.mssmb2.SMB2CreateDisposition;
import com.hierynomus.mssmb2.SMB2ShareAccess;
import com.hierynomus.smbj.SMBClient;
import com.hierynomus.smbj.SmbConfig;
import com.hierynomus.smbj.auth.AuthenticationContext;
import com.hierynomus.smbj.connection.Connection;
import com.hierynomus.smbj.session.Session;
import com.hierynomus.smbj.share.DiskShare;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static europa.edit.util.Constants.*;
import static org.testng.Assert.*;

/* 	Author: Satyabrata Das
 * 	Functionality: Utility functions needed for the script execution
 */
public class E2eUtil {
    static Cryptor td = new Cryptor();
    static ConfigReader config = new ConfigReader();
    private static final Logger logger = LoggerFactory.getLogger(E2eUtil.class);

    public static void scrollToElement(WebDriver driver, WebElement ele) {
        try {
            ((JavascriptExecutor) driver).executeScript(SCROLL_ELEMENT, ele);
            logger.info("Page is scrolled to the element {}", ele);
        } catch (Exception e) {
            exceptionReport(driver, e);
        }
    }

/*    public void scrollToSpecificOffset(WebDriver driver, int x, int y) {
        try {
            ((JavascriptExecutor) driver).executeScript("window.scrollBy(arguments[0], arguments[1]);", x, y);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }*/

    public static void waitForPageLoad(WebDriver driver, int timeout) {
        ExpectedCondition<Boolean> pageLoadCondition = driver1 -> {
            return "complete".equals(((JavascriptExecutor) driver).executeScript("return document.readyState"));
        };
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeout));
        wait.until(pageLoadCondition);
    }

    public static void waitForLoadingProgressBarToDisappear(WebDriver driver) {
        try {
            wait(1000);
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(EXPLICIT_TIMEOUT_DELAY));
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("eui-block-document.eui-block-document--blocked")));
            waitForPageLoad(driver,TIMEOUT_DELAY);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

    public static void waitForElementClickable(WebDriver driver, WebElement element) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT_DELAY));
            wait.until(ExpectedConditions.elementToBeClickable(element));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }


    public static void elementClick(WebDriver driver, WebElement element) {
        element.click();
        waitForPageLoad(driver, Constants.TIMEOUT_DELAY);
    }

    public static void elementClickJS(WebDriver driver, WebElement element) {
        ((JavascriptExecutor) driver).executeScript(CLICK_ELEMENT, element);
    }

    public static void elementSendKeys(WebDriver driver, WebElement element, String data) {
        element.sendKeys(data);
        waitForPageLoad(driver, TIMEOUT_DELAY);
    }

    public static void clearElementUsingKeysChord(WebElement element) {
        String ctrlA = Keys.chord(Keys.CONTROL, "a");
        element.sendKeys(ctrlA);
        element.sendKeys(Keys.DELETE);
    }

    public static void elementActionSendkeys(WebDriver driver, String data) {
        try {
            Actions action = new Actions(driver);
            action.sendKeys(data).build().perform();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String getElementText(WebElement element) {
        return element.getText();
    }

    //Get Element Attribute Value
    public static String getElementAttributeValue(WebElement element) {
        return element.getAttribute("value");
    }

    //Get Element Attribute InnerText
    public static String getElementAttributeInnerText(WebElement element) {
        return element.getAttribute("innerText");
    }

    public static String getElementAttributeTextContent(WebElement ele) {
        return ele.getAttribute("textContent");
    }

/*    public static void setTextContentToElementAttribute(WebDriver driver, WebElement ele, String val) {
        try {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("arguments[0].textContent=arguments[1];", ele, val);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }*/

    // Take screenshot if scenario fails and stop execution
    private static void exceptionReport(WebDriver driver, Exception e) {
        E2eUtil.takeSnapShot(driver, "FAIL");
        logger.info(EXCEPTION_MESSGAE_ON_FAILURE);
        logger.error(e.getMessage(), e);
        throw new AssertionError(EXCEPTION_MESSGAE_ON_FAILURE, e);
    }

    public static boolean isElementDisplayedAndEnabled(WebElement element) {
        return element.isDisplayed() && element.isEnabled();
    }

    public static boolean isElementSelected(WebElement element) {
        return element.isSelected();
    }

    public static boolean isElementEnabled(WebElement element) {
        return element.isEnabled();
    }

    public static void elementClickThroughAction(WebDriver driver, WebElement element) {
        Actions act = new Actions(driver);
        act.moveToElement(element).click().release().perform();
    }

    public static boolean elementDoubleClickThroughAction(WebDriver driver, WebElement element) {
        Actions act = new Actions(driver);
        act.doubleClick(element).build().perform();
        return true;
    }

    public static void selectText(WebDriver driver, WebElement element) {
        try {
            Dimension size = element.getSize();
            int width = size.getWidth();
            Actions action = new Actions(driver);
            action.clickAndHold(element)
                    .moveToElement(element, -width / 2, 0)
                    .release()
                    .build().perform();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public static void selectTextFromElement(WebDriver driver, WebElement element, String partialText) {
        String fullText = element.getText();
        int start = fullText.indexOf(partialText);
        int end = fullText.lastIndexOf(partialText) + partialText.length();
        ((JavascriptExecutor) driver).executeScript(selectJsScript, element, start, end);
        Actions actions = new Actions(driver);
        actions.release().build().perform();
    }

    public static WebElement waitForElementTobePresent(WebDriver driver, By by) {
        Wait<WebDriver> wait = new FluentWait<>(driver)
                .withTimeout(Duration.ofSeconds(EXPLICIT_TIMEOUT_DELAY))
                .pollingEvery(Duration.ofSeconds(POLLING_TIME))
                .ignoring(Exception.class);
        return wait.until(ExpectedConditions.presenceOfElementLocated(by));
    }

    public static boolean isSpecificValueExistsInElementAttribute(WebElement element, String attribute, String value) {
        return element.getAttribute(attribute).contains(value);
    }

    public static boolean waitForElementTobeDisPlayed(WebDriver driver, WebElement element) {
        Wait<WebDriver> wait = new FluentWait<>(driver)
                .withTimeout(Duration.ofSeconds(EXPLICIT_TIMEOUT_DELAY))
                .pollingEvery(Duration.ofSeconds(POLLING_TIME))
                .ignoring(Exception.class);
        return wait.until(ExpectedConditions.visibilityOf(element)).isDisplayed();
    }

    public static boolean waitForElementTobeDisPlayed(WebDriver driver, By by) {
        Wait<WebDriver> wait = new FluentWait<>(driver)
                .withTimeout(Duration.ofSeconds(EXPLICIT_TIMEOUT_DELAY))
                .pollingEvery(Duration.ofSeconds(POLLING_TIME))
                .ignoring(Exception.class);
        return wait.until(ExpectedConditions.visibilityOfElementLocated(by)).isDisplayed();
    }

    public static WebElement waitForElementTobeClickable(WebDriver driver, WebElement element) {
        Wait<WebDriver> wait = new FluentWait<>(driver)
                .withTimeout(Duration.ofSeconds(EXPLICIT_TIMEOUT_DELAY))
                .pollingEvery(Duration.ofSeconds(POLLING_TIME))
                .ignoring(Exception.class);
        return wait.until(ExpectedConditions.elementToBeClickable(element));
    }

    public static boolean waitUnTillElementIsNotPresent(WebDriver driver, By by) {
        try {
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(POLLING_TIME));
            Wait<WebDriver> wait = new FluentWait<>(driver)
                    .withTimeout(Duration.ofSeconds(EXPLICIT_TIMEOUT_DELAY))
                    .pollingEvery(Duration.ofSeconds(POLLING_TIME));
            Boolean found = false;
            long totalTime = 0;
            long startTime;
            long endTime;
            while (!found && (totalTime / 1000) < EXPLICIT_TIMEOUT_DELAY) {
                startTime = System.currentTimeMillis();
                found = wait.until(ExpectedConditions.invisibilityOfElementLocated(by));
                endTime = System.currentTimeMillis();
                totalTime = totalTime + (endTime - startTime);
            }
            return found;
        } catch (Exception e) {
            return false;
        } finally {
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(TIMEOUT_DELAY));
        }
    }

    public static void setValueToElementAttribute(WebDriver driver, WebElement element, String val) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].value=arguments[1];", element, val);
    }

    public static void setInnerTextToElementAttribute(WebDriver driver, WebElement element, String val) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].innerText=arguments[1];", element, val);
    }

/*    public static void setInnerHTMLToElementAttribute(WebDriver driver, WebElement element, String val) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].innerHTML=arguments[1];", element, val);
    }*/

    public static boolean removeElementThroughJS(WebDriver driver, WebElement ele) {
        boolean bool = false;
        try {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("arguments[0].remove();", ele);
            bool = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bool;
    }

    public static String getElementAttributeInnerHTML(WebElement element) {
        return element.getAttribute("innerHTML");
    }

    public static String getAttributeValueFromElement(WebElement element, String attribute) {
        return element.getAttribute(attribute);
    }

    public static String getCssValueFromElement(WebElement element, String attribute) {
        return element.getCssValue(attribute);
    }

    public static String getNodeTextFromElement(WebDriver driver, WebElement element) {
        try {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            return (String) js.executeScript("return arguments[0].childNodes[0].textContent;", element);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public static void clickBackSpaceFromKeyboard(WebDriver driver) {
        Actions action = new Actions(driver);
        action.sendKeys(Keys.BACK_SPACE).perform();
    }

    public static boolean isAttributePresent(WebElement element, String attribute) {
        boolean result = false;
        try {
            String value = element.getAttribute(attribute);
            if (value != null) {
                result = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    public static String getDateAndTime() {
        DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        Date date = new Date();
        return dateFormat.format(date);
    }

    public static void scrollAndClick(WebDriver driver, WebElement webElement) {
        JavascriptExecutor executor = (JavascriptExecutor) driver;
        executor.executeScript("arguments[0].scrollIntoView(true);", webElement);
        executor.executeScript("arguments[0].click();", webElement);
        logger.info("Element {} clicked", webElement);
    }

    public static void takeSnapShot(WebDriver driver, String status) {
        if (config.getProperty("takeScreenshots.pass").contains("TRUE") && status.contains("PASS")) {
            copyScreenshot(driver);
        }
        if (config.getProperty("takeScreenshots.fail").contains("TRUE") && status.contains("FAIL")) {
            copyScreenshot(driver);
        }
    }

    // support function to take screenshot
    private static void copyScreenshot(WebDriver driver) {
        TakesScreenshot scrShot = ((TakesScreenshot) driver);
        File srcFile = scrShot.getScreenshotAs(OutputType.FILE);
        String fileName = Constants.RESULTS_LOCATION + File.separator + "Screenshots" + File.separator + "Screenshot_" + getDateAndTime() + ".PNG";
        File destFile = new File(fileName);
        boolean copyScreenshots = Boolean.parseBoolean(System.getProperty("copyScreenshots"));
        if (copyScreenshots) {
            TestParameters.getInstance().setScreenshotPath(fileName);
        } else {
            TestParameters.getInstance().setScreenshotPath(destFile.getAbsolutePath());
        }
        try {
            FileUtils.copyFile(srcFile, destFile);
            logger.info("Screenshot captured at " + destFile);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }
    }

    // Definite wait needed at multiple place, used a function instead Thread.sleep method
    public static void wait(int milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

    public static void scrollAndDoubleClick(WebDriver driver, WebElement element) {
        JavascriptExecutor executor = (JavascriptExecutor) driver;
        executor.executeScript("arguments[0].scrollIntoView(true);", element);
        executor.executeScript("arguments[0].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));", element);
        logger.info("Element {} double clicked", element);
    }

    public static DiskShare smbConnect() {
        try {
            DiskShare share;
            SmbConfig sconfig = SmbConfig.builder()
                    .withTimeout(120, TimeUnit.SECONDS) // Timeout sets Read, Write, and Transact timeouts (default is 60 seconds)
                    .withSoTimeout(180, TimeUnit.SECONDS) // Socket Timeout (default is 0 seconds, blocks forever)
                    .build();
            @SuppressWarnings("resource")
            SMBClient client = new SMBClient(sconfig);
            Connection connection = client.connect(config.getProperty("remote.machine.name"));
            AuthenticationContext ac = new AuthenticationContext(config.getProperty("user.remote.1.name"), td.decrypt(config.getProperty("user.remote.1.pwd")).toCharArray(), config.getProperty("domain"));
            Session session = connection.authenticate(ac);
            share = (DiskShare) session.connectShare(config.getProperty("remote.drive.name"));
            return share;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    public static boolean unzip(String zipFilePath, String destDirectory, DiskShare share) {
        try {
            ZipInputStream zipIn = null;
            logger.info("before share.folderExists(destDirectory)");
            if (TestParameters.getInstance().getMode().equalsIgnoreCase("remote")) {
                if (!share.folderExists(destDirectory)) {
                    share.mkdir(destDirectory);
                    logger.info("destDir is created");
                }
                com.hierynomus.smbj.share.File file = share.openFile(zipFilePath,
                        EnumSet.of(AccessMask.FILE_READ_DATA),
                        null,
                        SMB2ShareAccess.ALL,
                        SMB2CreateDisposition.FILE_OPEN,
                        null);
                InputStream inputStream = file.getInputStream();
                zipIn = new ZipInputStream(inputStream);
                logger.info("zipIn is assigned");
            }
            if (TestParameters.getInstance().getMode().equalsIgnoreCase("local")) {
                zipIn = new ZipInputStream(new FileInputStream(zipFilePath));
                logger.info("zipIn is assigned");
            }
            assertNotNull(zipIn);
            ZipEntry entry = zipIn.getNextEntry();
            logger.info("entry is assigned");
            String filePath;
            String entryName;
            File dir;
//            SmbFiles smbFiles;
            while (entry != null) {
                logger.info("entry is not null");
                entryName = entry.getName();
                logger.info("entry get name :" + entryName);
                filePath = destDirectory + File.separator + entryName;
                if (TestParameters.getInstance().getMode().equalsIgnoreCase("remote")) {
                    if (!entry.isDirectory()) {
                        logger.info("entry is not Directory()");
                        createDirectoryInRemote(destDirectory, entryName, share, entry.isDirectory());
                        /*smbFiles = new SmbFiles();
                        smbFiles.mkdirs(share,filePath);*/
                        extractFile(zipIn, filePath, share);
                    } else {
                        logger.info("entry is a Directory()");
                        createDirectoryInRemote(destDirectory, entryName, share, entry.isDirectory());
                        /*smbFiles = new SmbFiles();
                        smbFiles.mkdirs(share,filePath);*/
                    }
                }
                if (TestParameters.getInstance().getMode().equalsIgnoreCase("local")) {
                    if (!entry.isDirectory()) {
                        logger.info("entry.isDirectory()");
                        extractFile(zipIn, filePath, share);
                    } else {
                        dir = new File(filePath);
                        boolean bool = dir.mkdirs();
                        logger.info(String.valueOf(bool));
                    }
                }
                logger.info("filePath " + filePath);
                zipIn.closeEntry();
                logger.info("zipIn closeEntry");
                entry = zipIn.getNextEntry();
                logger.info("zipIn getNextEntry");
            }
            zipIn.close();
            logger.info("zipIn close");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    private static void createDirectoryInRemote(String destDirectory, String entryName, DiskShare share, boolean bool) {
        int size;
        String remoteRelativeDownloadPath = destDirectory;
        ArrayList<String> strList = new ArrayList<>(Arrays.asList(entryName.split("/")));
        if (!strList.isEmpty()) {
            if (bool) {
                size = strList.size();
            } else {
                size = strList.size() - 1;
            }
            for (int i = 0; i < size; i++) {
                remoteRelativeDownloadPath = remoteRelativeDownloadPath + File.separator + strList.get(i);
                System.out.println("remoteRelativeDownloadPath " + remoteRelativeDownloadPath);
                makeDirectoryInRemote(share, remoteRelativeDownloadPath);
            }
        } else {
            if (bool) {
                makeDirectoryInRemote(share, remoteRelativeDownloadPath + File.separator + entryName);
            }
        }
    }

    private static void makeDirectoryInRemote(DiskShare share, String folderPath) {
        try {
            System.out.println("folderPath " + folderPath);
            if (!share.folderExists(folderPath)) {
                share.mkdir(folderPath);
                System.out.println("folder created success");
            }
        } catch (Exception e) {
            System.out.println("folder created failed");
            e.printStackTrace();
        }
    }

    private static void extractFile(ZipInputStream zipIn, String filePath, DiskShare share) throws IOException {
        logger.info("entry extractFile");
        BufferedOutputStream bos = null;
        if (TestParameters.getInstance().getMode().equalsIgnoreCase("remote")) {
            com.hierynomus.smbj.share.File file = share.openFile(filePath
                    , EnumSet.of(AccessMask.GENERIC_ALL)
                    , null, SMB2ShareAccess.ALL
                    , SMB2CreateDisposition.FILE_OVERWRITE_IF
                    , null);
            OutputStream outStream = file.getOutputStream();
            bos = new BufferedOutputStream(outStream);
        }
        if (TestParameters.getInstance().getMode().equalsIgnoreCase("local")) {
            validatePath(filePath.getAbsolutePath());
            bos = new BufferedOutputStream(new FileOutputStream(filePath));
        }
        if (null != bos) {
            logger.info("bos BufferedOutputStream");
            byte[] bytesIn = new byte[Constants.BUFFER_SIZE];
            logger.info("bytesIn BufferedOutputStream");
            int read;
            while ((read = zipIn.read(bytesIn)) != -1) {
                logger.info("zipIn.read");
                bos.write(bytesIn, 0, read);
                logger.info("bos bytesIn");
            }
            logger.info("while completed");
            bos.close();
            logger.info("bos.close()");
        }
    }

    public static File findRecentFile(String fileType, String relativePathLocation) {
        try {
            File directory = new File(System.getProperty("user.dir") + relativePathLocation);
            File file = getRecentFileFromLocal(fileType, directory);
            if (null != file) {
                return file;
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
        return null;
    }

    private static File getRecentFileFromLocal(String fileType, File directory) {
        long lastModifiedTime = Long.MIN_VALUE;
        File[] files = directory.listFiles();
        File newFile = null;
        if (files != null) {
            for (File file : files) {
                String extension = Files.getFileExtension(file.getName());
                if (extension.equalsIgnoreCase(fileType)) {
                    if (file.lastModified() > lastModifiedTime) {
                        newFile = file;
                    }
                }
            }
        }
        return newFile;
    }

    public static void unZipFile(String zipFilePath, String destDirectory) throws IOException {
        File destDir = new File(destDirectory);

        byte[] buffer = new byte[1024];
        ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFilePath));
        ZipEntry zipEntry = zis.getNextEntry();
        while (zipEntry != null) {
            File newFile = newFile(destDir, zipEntry);
            if (zipEntry.isDirectory()) {
                if (!newFile.isDirectory() && !newFile.mkdirs()) {
                    throw new IOException("Failed to create directory " + newFile);
                }
            } else {
                // fix for Windows-created archives
                File parent = newFile.getParentFile();
                if (!parent.isDirectory() && !parent.mkdirs()) {
                    throw new IOException("Failed to create directory " + parent);
                }
                // write file content
                FileOutputStream fos = new FileOutputStream(newFile);
                int len;
                while ((len = zis.read(buffer)) > 0) {
                    fos.write(buffer, 0, len);
                }
                fos.close();
            }
            zipEntry = zis.getNextEntry();
        }
        zis.closeEntry();
        zis.close();
    }

    public static File newFile(File destinationDir, ZipEntry zipEntry) throws IOException {
        File destFile = new File(destinationDir, zipEntry.getName());
        String destDirPath = destinationDir.getCanonicalPath();
        String destFilePath = destFile.getCanonicalPath();
        if (!destFilePath.startsWith(destDirPath + File.separator)) {
            throw new IOException("Entry is outside of the target dir: " + zipEntry.getName());
        }
        return destFile;
    }

    public static String findRecentFolderFromLocal(String relativePath) {
        String folderName = null;
        long lastModifiedTime = Long.MIN_VALUE;
        try {
            File parentFolder = new File(System.getProperty("user.dir") + relativePath);
            for (File fileEntry : Objects.requireNonNull(parentFolder.listFiles())) {
                if (fileEntry.isDirectory()) {
                    if (fileEntry.lastModified() > lastModifiedTime) {
                        folderName = fileEntry.getName();
                        lastModifiedTime = fileEntry.lastModified();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return folderName;
    }

    public static List<String> findFilesFromGivenPath(String relativePath, String fileType) {
        List<String> fileNames = new ArrayList<>();
        try {
            File parentFolder = new File(System.getProperty("user.dir") + relativePath);
            for (File file : Objects.requireNonNull(parentFolder.listFiles())) {
                if (!file.isDirectory()) {
                    if (file.getName().contains(fileType)) {
                        fileNames.add(file.getName());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileNames;
    }
}