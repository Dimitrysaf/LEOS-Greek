PROJECT: LEOS
Joinup Release: 5.X.X
Date: 2024-XX-XX

INTRODUCTION
============

This is a joinup release of Project LEOS (pilot) which enables users to edit legal texts in AkomaNtoso XML format.


IMPORTANT NOTES
===============

This release is intended to provide an experience with the software and is stripped of several important components to enable ease of use.
    * This software is adapted to run on a local server for demo purposes and without proper security mechanisms.
    * This software is still under active development so some features may be added, removed or changed over course of time.


DEPENDENCIES
============

To compile the supplied source files and run the generated WAR the following software should be configured:
    * Java SDK version 8.0 (⚠️ do not upgrade to newer versions of Java SDK yet. It won't work)
    * Maven version 3.3.9+
      (Maven runtime memory might need to be set: MAVEN_OPTS=-Xms256m -Xmx512m)
      (Maven settings, proxy and mirrors, might need to be adjusted to your environment and internet access requirements)
    * Supported browser is Google Chrome version 45+
      (Mozilla Firefox ESR version 38.3 and Microsoft Internet Explorer version 11 are known to work with minor issues)


DEMO
====

Please revert to GETTING_STARTED.pdf for running instructions.