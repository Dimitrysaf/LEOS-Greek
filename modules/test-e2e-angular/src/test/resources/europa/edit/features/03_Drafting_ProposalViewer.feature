#Author: Satyabrata Das
#Keywords Summary : Testing for different functionalities in Proposal Viewer Page
@ProposalViewerRegressionScenariosEditCommission
Feature: Proposal Viewer Regression Features in Edit Commission

  Background:
    Given navigate to "Commission" edit application
    When enter username "user.support.1.name" and password "user.support.1.pwd"
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page

  @changeTitleAndCreateMilestoneAndDeleteProposal
  Scenario: LEOS-4587 [EC] Verify User is able to do download, title change, create milestone and delete proposal
    When click on create proposal button
    And  wait for disappearance of the loading progress bar
    Then "Create new legislative document - Template selection (1/2)" window is displayed
    When click on template "SJ-023 - Proposal for a Regulation of the European Parliament and of the Council" under tree item "Interinstitutional procedures - Law Initiative (COM/JOIN)"
    Then next button is enabled
    When click on next button
    And  wait for disappearance of the loading progress bar
    Then "Create new legislative document - Document metadata (2/2)" window is displayed
    When provide document title "Automation Testing" in document metadata page
    And  click on create button
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page
    When click on the open button of first proposal/mandate
    Then Proposal Viewer screen is displayed
    When click on title of the mandate
    Then title save button is displayed and enabled
    And  title cancel button is displayed and enabled
    When append " Title change" keyword in the title of the proposal/mandate
    And  click on title save button
    And  wait for disappearance of the loading progress bar
    Then "Metadata saved" message is displayed
    And  click on message "Metadata saved"
    Then title of the proposal/mandate contains "Automation Testing Title change" keyword
    When click on add button in milestones section
    And  wait for disappearance of the loading progress bar
    Then Add a milestone window is displayed
    When click on milestone dropdown icon
    Then "For Interservice Consultation" option is selected by default
    Then milestone title textbox is disabled
    Then these are below options displayed for milestone dropdown
      | For Interservice Consultation |
      | For Decision |
      | Revision after Interservice Consultation |
      | Other |
    When click on milestone option as Other
    And  type "Commission proposal" in title box
    When click on create milestone button
    And  wait for disappearance of the loading progress bar
    Then "Milestone creation has been requested" message is displayed
    And  click on message "Milestone creation has been requested"
    And  "Commission proposal" is showing under title column of row 1 of milestones table
    And  today's date is showing in date column of milestones table
    And  "In preparation" is showing in status column of milestones table
    And  wait for disappearance of the loading progress bar
    And  "Commission proposal has been updated." message is displayed
    And  click on message "Commission proposal has been updated."
    And  "File ready" is showing in status column of milestones table
    When click on delete button
    Then proposal deletion confirmation page should be displayed
    And  cancel button is displayed and enabled in proposal deletion confirmation pop up
    And  delete button is displayed and enabled in proposal deletion confirmation pop up
    When click on delete button present in confirmation pop up
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page
    And  close the browser

  @WarningOnClickingBackOrCloseOrHomeButtonWhenEditorIsOpen
  Scenario: ANOT-358,359,404,407 Create a warning/confirmation when going back in the browser or closing the document when the text block is open for editing results
    When click on create proposal button
    And  wait for disappearance of the loading progress bar
    Then "Create new legislative document - Template selection (1/2)" window is displayed
    When click on template "SJ-023 - Proposal for a Regulation of the European Parliament and of the Council" under tree item "Interinstitutional procedures - Law Initiative (COM/JOIN)"
    Then next button is enabled
    When click on next button
    And  wait for disappearance of the loading progress bar
    Then "Create new legislative document - Document metadata (2/2)" window is displayed
    When provide document title "Automation Testing" in document metadata page
    And  click on create button
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page
    When click on the open button of first proposal/mandate
    Then Proposal Viewer screen is displayed
    When click on add a new annex button
    And  wait for disappearance of the loading progress bar
    Then "Annex " is added to Annexes
    When click on open button of cover page
    Then cover page is displayed
    And  annotation side bar is present
    When click on "Title" link in navigation pane
    Then cover page long title is "Automation Testing"
    When double click on long title of doc purpose
    And  wait for disappearance of the loading progress bar
    Then ck editor window is displayed
    When click on home button
    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
    When click on cancel button present in pop up window
    And  click on back button of the browser
    Then the message "Changes you made may not be saved. Would you like to proceed?" is displayed in alert pop up
    When click on cancel button present in browser alert pop up
    And  click on close button present in cover page
    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
    When click on confirm button present in pop up window
    And  wait for disappearance of the loading progress bar
    Then Proposal Viewer screen is displayed
#    When click on open button for explanatory memorandum
#    Then explanatory memorandum page is displayed
#    And  annotation side bar is present
#    When double click on blockcontainer 1 of tblock where refersto attribute is "~_rationale"
#    When mouse hover and click on show all action button and click on edit button of blockcontainer 1 of tblock where refersto attribute is "~_rationale"
#    And  wait for disappearance of the loading progress bar
#    Then ck editor window is displayed
#    When click on close button in explanatory memorandum page
#    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
#    When click on cancel button present in pop up window
#    And  click on home button
#    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
#    When click on cancel button present in pop up window
#    And  click on back button of the browser
#    Then the message "Changes you made may not be saved. Would you like to proceed?" is displayed in alert pop up
#    When click on ok button present in windows alert pop up
#    And  wait for disappearance of the loading progress bar
#    Then Proposal Viewer screen is displayed
    When click on open button of legal act
    Then legal act page is displayed
    And  annotation side bar is present
    When double click on citation 2
    And  wait for disappearance of the loading progress bar
    Then ck editor window is displayed
    When click on back button of the browser
    Then the message "Changes you made may not be saved. Would you like to proceed?" is displayed in alert pop up
    When click on cancel button present in browser alert pop up
    And  click on home button
    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
    When click on cancel button present in pop up window
    And  click on close button present in legal act page
    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
    When click on confirm button present in pop up window
    And  wait for disappearance of the loading progress bar
    Then Proposal Viewer screen is displayed
    When click on open button of Annex 1
    And  wait for disappearance of the loading progress bar
    Then Annex page is displayed
    And  annotation side bar is present
    When double click on level 1
    And  wait for disappearance of the loading progress bar
    Then ck editor window is displayed
    When click on close button present in annex page
    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
    When click on cancel button present in pop up window
    When click on back button of the browser
    Then the message "Changes you made may not be saved. Would you like to proceed?" is displayed in alert pop up
    When click on cancel button present in browser alert pop up
    And  click on home button
    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
    When click on confirm button present in pop up window
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page
    And  close the browser

  @verifyXmlInsideDownloadedLegFile
  Scenario: verify name of xmls present inside downloaded leg file
    When click on create proposal button
    And  wait for disappearance of the loading progress bar
    Then "Create new legislative document - Template selection (1/2)" window is displayed
    When click on template "SJ-023 - Proposal for a Regulation of the European Parliament and of the Council" under tree item "Interinstitutional procedures - Law Initiative (COM/JOIN)"
    Then next button is enabled
    When click on next button
    And  wait for disappearance of the loading progress bar
    Then "Create new legislative document - Document metadata (2/2)" window is displayed
    When provide document title "Automation Testing" in document metadata page
    And  click on create button
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page
    When click on the open button of first proposal/mandate
    Then Proposal Viewer screen is displayed
    When click on add a new annex button
    And  wait for disappearance of the loading progress bar
    Then "Annex " is added to Annexes
    When click on add a new annex button
    And  wait for disappearance of the loading progress bar
    Then "Annex II" is added to Annexes
    Then "Annex" is changed to "Annex I"
    When click on download button
    And  wait for disappearance of the loading progress bar
    Then Proposal Viewer screen is displayed
    And  "Proposal downloaded" message is displayed
    And  click on message "Proposal downloaded"
    And  sleep for 10000 milliseconds
    When find the recent "zip" file from download path and unzip it in path "legFiles\generated" and get the latest "leg" file
    And  find the recent "leg" file from path "legFiles\generated" and unzip it in path "exportedProposal"
    Then find the recent folder from path "exportedProposal" and check "xml" files contain below names
      | main            |
      | REG             |
      | EXPL_MEMORANDUM |
      | ANNEX           |
      | ANNEX           |
    And  close the browser