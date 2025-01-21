package com.inqwise.opinion.services;

import org.apache.logging.log4j.core.LifeCycle;
import org.apache.logging.log4j.web.Log4jWebSupport;

interface Log4jWebLifeCycle extends Log4jWebSupport, LifeCycle {

    /**
     * Starts up Log4j in the web application. Calls {@link #setLoggerContext()} after initialization is complete.
     *
     * @throws IllegalStateException if a JNDI config location is specified but no name is specified.
     */
    @Override
    void start();

    /**
     * Shuts down Log4j in the web application. Calls {@link #clearLoggerContext()} immediately before deinitialization
     * begins.
     */
    @Override
    void stop();
}
