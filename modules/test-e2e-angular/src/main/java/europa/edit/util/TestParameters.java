package europa.edit.util;

public class TestParameters {

	private static TestParameters instance;
//	private static ScenarioContext scenarioContext;
	private String screenshotPath;
	private String environment;
	private String browser;
	private String mode;

	public static TestParameters getInstance(){
		if(instance == null) {
			instance = new TestParameters();
//			scenarioContext = new ScenarioContext();
		}
		return instance;
	}

	public String getScreenshotPath() {
		return screenshotPath;
	}

	public void setScreenshotPath(String screenshotPath) {
		this.screenshotPath = screenshotPath;
	}

	public String getEnvironment() {
		return environment;
	}

	public void setEnvironment(String environment) {
		this.environment = environment;
	}

	public String getBrowser() {
		return browser;
	}

	public void setBrowser(String browser) {
		this.browser = browser;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

/*	public ScenarioContext getScenarioContext() {
		return scenarioContext;
	}

	public void setScenarioContext(ScenarioContext scenario) {
		this.scenarioContext = scenarioContext;
	}*/

	public void reset() {
		screenshotPath = null;
	}
}