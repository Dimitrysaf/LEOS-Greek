package europa.edit.util;


import io.cucumber.core.logging.Logger;
import io.cucumber.core.logging.LoggerFactory;
import org.testng.ISuite;
import org.testng.ISuiteListener;

public class SuiteListener implements ISuiteListener {
	
	private static final Logger logger = LoggerFactory.getLogger(SuiteListener.class);

    @Override
    public void onStart(ISuite suite) {
        TestParameters.getInstance().setEnvironment(suite.getParameter("environment")); //Set environment
        TestParameters.getInstance().setBrowser(suite.getParameter("browser")); //Set browser
        TestParameters.getInstance().setMode(suite.getParameter("mode")); //Set mode
    }

    @Override
    public void onFinish(ISuite suite){
    }
}
