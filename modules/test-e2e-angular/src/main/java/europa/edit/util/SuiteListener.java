package europa.edit.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.ISuite;
import org.testng.ISuiteListener;

public class SuiteListener implements ISuiteListener {
	
	private static final Logger logger = LoggerFactory.getLogger(SuiteListener.class);

    @Override
    public void onStart(ISuite suite) {
        logger.debug("onStart");
        TestParameters.getInstance().setEnvironment(suite.getParameter("environment")); //Set environment
        TestParameters.getInstance().setBrowser(suite.getParameter("browser")); //Set browser
        TestParameters.getInstance().setMode(suite.getParameter("mode")); //Set mode
    }

    @Override
    public void onFinish(ISuite suite) {
        logger.debug("onFinish");
    }
}