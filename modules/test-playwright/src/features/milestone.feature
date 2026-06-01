#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in milestone section in drafting instance

@milestoneSectionScenarios
Feature: milestone section regression features

  @validateMilestoneExplorer
  Scenario: validate milestone explorer
    Given navigate to leos application with "username1"
    Then user is on home page
#    When click on Create act button
#    Then user is on create new legislative document window
#    When click on template "SJ-023" in create new legislative document window
#    When click on next button in create document page
#    And  provide document title "Automation Testing Validate PDF in MileStone Explorer" in create document page
#    And  click on create button
#    Then user is on act viewer page
#    When click on add button in annexes section
#    Then total number of annexes present in act viewer page is 1
#    When click on add button in annexes section
#    Then total number of annexes present in act viewer page is 2
#    When click on milestones tab in act view page
#    And  click on add button in milestones tab
#    Then add milestone window is displayed
#    When click on milestone type dropdown
#    Then "For Interservice Consultation" option is selected by default
#    Then milestone title textBox is disabled
#    When click on option "For Decision" from milestone type dropdown
#    Then milestone title textBox is disabled
#    And  content of milestone title textbox is "For Decision"
#    When click on milestone type dropdown
#    When click on option "Revision after Interservice Consultation" from milestone type dropdown
#    Then milestone title textBox is disabled
#    And  content of milestone title textbox is "Revision after Interservice Consultation"
#    When click on milestone type dropdown
#    When click on option "Other" from milestone type dropdown
#    And  type "Commission act" in milestone title textBox
#    When click on create milestone button
#    Then successful message contains "Milestone created"
#    And  "Commission act" is showing under title column of row 1 of milestones table
#    And  "File ready" is showing under status column of row 1 of milestones table
#    When click on three dots under actions column of row 1 of milestones table
#    Then below options are displayed under milestone actions
#      | MilestoneActions             |
#      | View                         |
#      | Send a copy for contribution |
#      | Download                     |