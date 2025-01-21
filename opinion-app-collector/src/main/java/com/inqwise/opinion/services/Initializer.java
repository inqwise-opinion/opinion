package com.inqwise.opinion.services;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.inqwise.opinion.infrastructure.systemFramework.ApplicationLog;

public class Initializer implements ServletContextListener {
	private static ApplicationLog LOGGER = ApplicationLog.getLogger(Initializer.class);
//	static final String START_COUNT_ATTR = Log4jServletContextListener.class.getName() + ".START_COUNT";
//
//    private static final int DEFAULT_STOP_TIMEOUT = 30;
//    private static final TimeUnit DEFAULT_STOP_TIMEOUT_TIMEUNIT = TimeUnit.SECONDS;
//
//    private static final String KEY_STOP_TIMEOUT = "log4j.stop.timeout";
//    private static final String KEY_STOP_TIMEOUT_TIMEUNIT = "log4j.stop.timeout.timeunit";
//
//    private static ApplicationLog LOGGER = ApplicationLog.getLogger(Initializer.class);
//
//    private ServletContext servletContext;
//    private Log4jWebLifeCycle initializer;
//    
//    private int getAndIncrementCount() {
//        Integer count = (Integer) servletContext.getAttribute(START_COUNT_ATTR);
//        if (count == null) {
//            count = 0;
//        }
//        servletContext.setAttribute(START_COUNT_ATTR, count + 1);
//        return count;
//    }
//
//    private int decrementAndGetCount() {
//        Integer count = (Integer) servletContext.getAttribute(START_COUNT_ATTR);
//        if (count == null) {
//            LOGGER.warn(
//                    "{} received a 'contextDestroyed' message without a corresponding 'contextInitialized' message.",
//                    getClass().getName());
//            count = 1;
//        }
//        servletContext.setAttribute(START_COUNT_ATTR, --count);
//        return count;
//    }
//
//    @Override
//    public void contextInitialized(final ServletContextEvent event) {
//        this.servletContext = event.getServletContext();
//        if ("true".equalsIgnoreCase(servletContext.getInitParameter(Log4jWebSupport.IS_LOG4J_AUTO_SHUTDOWN_DISABLED))) {
//            throw new IllegalStateException("Do not use " + getClass().getSimpleName() + " when "
//                    + Log4jWebSupport.IS_LOG4J_AUTO_SHUTDOWN_DISABLED + " is true. Please use "
//                    + Log4jShutdownOnContextDestroyedListener.class.getSimpleName() + " instead of "
//                    + getClass().getSimpleName() + ".");
//        }
//
//        this.initializer = WebLoggerContextUtils.getWebLifeCycle(this.servletContext);
//        if (getAndIncrementCount() != 0) {
//            LOGGER.debug(
//                    "Skipping Log4j context initialization, since {} is registered multiple times.",
//                    getClass().getSimpleName());
//            return;
//        }
//        LOGGER.info("{} triggered a Log4j context initialization.", getClass().getSimpleName());
//        try {
//            this.initializer.start();
//            this.initializer.setLoggerContext(); // the application is just now starting to start up
//        } catch (final IllegalStateException e) {
//            throw new IllegalStateException("Failed to initialize Log4j properly.", e);
//        }
//    }
//
//    @Override
//    public void contextDestroyed(final ServletContextEvent event) {
//        if (this.servletContext == null || this.initializer == null) {
//            LOGGER.warn("Servlet context destroyed before it was initialized.");
//            return;
//        }
//
//        if (decrementAndGetCount() != 0) {
//            LOGGER.debug(
//                    "Skipping Log4j context shutdown, since {} is registered multiple times.",
//                    getClass().getSimpleName());
//            return;
//        }
//        LOGGER.info("{} triggered a Log4j context shutdown.", getClass().getSimpleName());
//        try {
//            this.initializer.clearLoggerContext(); // the application is finished
//            // shutting down now
//            if (initializer instanceof LifeCycle2) {
//                final String stopTimeoutStr = servletContext.getInitParameter(KEY_STOP_TIMEOUT);
//                final long stopTimeout =
//                        Strings.isEmpty(stopTimeoutStr) ? DEFAULT_STOP_TIMEOUT : Long.parseLong(stopTimeoutStr);
//                final String timeoutTimeUnitStr = servletContext.getInitParameter(KEY_STOP_TIMEOUT_TIMEUNIT);
//                final TimeUnit timeoutTimeUnit = Strings.isEmpty(timeoutTimeUnitStr)
//                        ? DEFAULT_STOP_TIMEOUT_TIMEUNIT
//                        : TimeUnit.valueOf(toRootUpperCase(timeoutTimeUnitStr));
//                ((LifeCycle2) this.initializer).stop(stopTimeout, timeoutTimeUnit);
//            } else {
//                this.initializer.stop();
//            }
//        } catch (final IllegalStateException e) {
//            throw new IllegalStateException("Failed to shutdown Log4j properly.", e);
//        }
//    }

	@Override
	public void contextInitialized(ServletContextEvent event) {
		LOGGER.info("collector started");
		event.getServletContext().log("my log");
		
		//throw new Error("My Error");
	}
}
