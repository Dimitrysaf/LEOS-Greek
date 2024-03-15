#Author: Satyabrata Das
#Keywords Summary : Testing for different functionalities in Proposal Viewer Page
@ProposalViewerRegressionScenariosEditCommission
Feature: Proposal Viewer Regression Features in Edit Commission

  Background:
    Given navigate to "Drafting" application
    Then  user is on EU login page
    When  user enters username "user.support.1.name"
    And   user clicks next button
    Then  user is on login page
    When  user enters password "user.support.1.pwd"
    And   user clicks on sign in button
#    Then  user is on home page
#    When  user clicks on view all acts button
    Then  user is on repository browser page

  @createMilestoneAndDeleteProposal
  Scenario: LEOS-4587 [EC] Verify User is able to do download, title change, create milestone and delete proposal
    When click on create proposal button
    Then user is on create new legislative document window
    Then "Select the document type and language" label is displayed in create document page
    When click on template "SJ-023 - Proposal for a Regulation of the European Parliament and of the Council" under tree item
    When click on next button in create document page
    Then "Enter document metadata" label is displayed in create document page
    When provide document title "Automation Testing" in create document page
    And  click on create button
    Then user is on proposal viewer page
    And  title of the proposal contains "Automation Testing" keyword
    When click on milestones tab
    Then milestones tab is displayed
    And  no row is present in milestone table
    When click on add button in milestones tab
    Then add milestone window pop up is displayed
    Then "For Interservice Consultation" option is selected by default in milestone dropdown
    Then milestone title text box is disabled
    When click on milestone dropdown icon
    Then these are below options displayed for milestone dropdown
      | For Interservice Consultation |
      | For Decision |
      | Revision after Interservice Consultation |
      | Other |
    When click on milestone option "other"
    And  type "Commission proposal" in title box
    When click on create milestone button
    Then "Milestone created" message is displayed
    And  "Commission proposal" is showing under title column of row 1 of milestones table
    And  today's date is showing under date column of row 1 of milestones table
    And  "In Preparation" is showing under status column of row 1 of milestones table
    And  "Milestones: Contribution from Legal Service has been updated" message is displayed
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on actions button present in proposal viewer screen
    When click on delete button present in proposal viewer screen
    Then delete proposal confirmation windows pop up is displayed
    And  cancel button is displayed and enabled in delete proposal confirmation windows pop up
    And  delete button is displayed and enabled in delete proposal confirmation windows pop up
    When click on delete button in delete proposal confirmation windows pop up
    Then user is on repository browser page

  @verifyXmlInsideDownloadedLegFile
  Scenario: verify name of xmls present inside downloaded leg file
    When click on create proposal button
    Then user is on create new legislative document window
    Then "Select the document type and language" label is displayed in create document page
    When click on template "SJ-023 - Proposal for a Regulation of the European Parliament and of the Council" under tree item
    When click on next button in create document page
    Then "Enter document metadata" label is displayed in create document page
    When provide document title "Automation Testing" in create document page
    And  click on create button
    Then user is on proposal viewer page
    And  title of the proposal contains "Automation Testing" keyword
    When click on add button present under annexes section
    Then numbers of annex present in annexes section are 1
    And  title of Annex 1 is "Annex"
    When click on add button present under annexes section
    Then numbers of annex present in annexes section are 2
    And  title of Annex 2 is "Annex"
    When click on actions button present in proposal viewer screen
    When click on download button
    And  sleep for 10000 milliseconds
    And  move the downloaded file to relative location "/target/download"
    And  unzip recent "zip" file from relative location "/target/download" and put the unzipped files in relative location "/target/download/legFiles/generated"
    And  unzip recent "leg" file from relative location "/target/download/legFiles/generated" and put the unzipped files in relative location "/target/download/legFiles/generated"
    Then find the recent folder from relative path "/target/download/legFiles/generated" and check "xml" files contain below names
      | main            |
      | REG             |
      | EXPL_MEMORANDUM |
      | ANNEX           |
      | ANNEX           |