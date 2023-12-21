#Author: Satyabrata Das
#Keywords Summary : Testing for different functionalities in Proposal Browser Page in CN instance of Edit Application
@ProposalBrowserPageRegressionScenariosEditCouncil
Feature: Proposal Browser Page Regression Features in Edit Council

  Background:
    Given navigate to "Council" edit application

  @closeButtonNotVisibleNonSupportUser
  Scenario: LEOS-5025 [CN] Close button is not available for non support user in proposal browser page
    When enter username "user.nonsupport.1.name" and password "user.nonsupport.1.pwd"
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page
    When click on the open button of first proposal/mandate
    And  wait for disappearance of the loading progress bar
    Then OverView screen is displayed
    And  close button is not displayed
    And  delete button is not displayed
    And  download button is not displayed
    And  close the browser

  @deleteMandate
  Scenario: LEOS-4584,4145 [CN] Verify User is able to do create mandate, create milestone, title change of mandate and delete mandate
    When enter username "user.support.1.name" and password "user.support.1.pwd"
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page
    When click on "Create mandate" button
    Then upload screen is showing with "Create new mandate - Upload a leg file (1/2)" page
    When upload a leg file for creating mandate from location "legFiles\PROP_ACT-4294241678941651921-EN.leg"
    Then file name should be displayed in upload window
    And  valid icon should be displayed in upload window
    When click on "Next" button
    Then upload screen is showing with Create new mandate - Draft metadata page
    When click on "Create" button
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page
    When click on the open button of first proposal/mandate
    Then OverView screen is displayed
    When click on delete button
    Then mandate deletion confirmation page should be displayed
    And  "Are you sure you want to delete the mandate and contained documents?" message is displayed
    And  cancel button is displayed and enabled in proposal deletion confirmation pop up
    And  delete button is displayed and enabled in proposal deletion confirmation pop up
    When click on delete button present in confirmation pop up
    And  wait for disappearance of the loading progress bar
    Then navigate to Repository Browser page
    And  close the browser

#  @WarningOnClickingBackOrCloseOrHomeButtonWhenEditorIsOpen
#  Scenario: ANOT-358,359,404,407 Create a warning/confirmation when going back in the browser or closing the document when the text block is open for editing results
#    When enter username "user.support.1.name" and password "user.support.1.pwd"
#    And  wait for disappearance of the loading progress bar
#    Then navigate to Repository Browser page
#    When click on "Create mandate" button
#    Then upload screen is showing with "Create new mandate - Upload a leg file (1/2)" page
#    When upload a leg file for creating mandate from location "legFiles\PROP_ACT-4294241678941651921-EN.leg"
#    Then file name should be displayed in upload window
#    And  valid icon should be displayed in upload window
#    When click on "Next" button
#    Then upload screen is showing with Create new mandate - Draft metadata page
#    When click on "Create" button
#    And  wait for disappearance of the loading progress bar
#    Then navigate to Repository Browser page
#    When click on the open button of first proposal/mandate
#    Then OverView screen is displayed
#    When click on add new explanatory button
#    And  wait for disappearance of the loading progress bar
#    Then "Create new draft - Template selection (1/1)" window is displayed
#    When click on "Explanatory" template under council explanatories section in council explanatory template selection window
#    And  click on create button in council explanatory template selection window
#    And  wait for disappearance of the loading progress bar
#    Then number of council explanatory is 1
#    And  title of council explanatory 1 is "Council Explanatory"
#    When click on open button of Annex 1
#    And  wait for disappearance of the loading progress bar
#    Then Annex page is displayed
#    And  annotation side bar is present
#    When double click on the content of subparagraph 1 of paragraph 1 in annex page
#    And  wait for disappearance of the loading progress bar
#    Then ck editor window is displayed
#    When click on home button
#    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
#    When click on cancel button present in pop up window
#    And  click on back button of the browser
#    Then the message "Changes you made may not be saved. Would you like to proceed?" is displayed in alert pop up
#    When click on cancel button present in browser alert pop up
#    And  click on close button present in annex page
#    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
#    When click on confirm button present in pop up window
#    And  wait for disappearance of the loading progress bar
#    Then OverView screen is displayed
#    When click on open button of "Council Explanatory" explanatory
#    Then "Council Explanatory" council explanatory page is displayed
#    And  annotation side bar is present
#    When double click on heading of division 1
#    And  wait for disappearance of the loading progress bar
#    Then ck editor window is displayed
#    When click on back button of the browser
#    Then the message "Changes you made may not be saved. Would you like to proceed?" is displayed in alert pop up
#    When click on cancel button present in browser alert pop up
#    And  click on home button
#    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
#    When click on cancel button present in pop up window
#    And  click on close button in Council Explanatory page
#    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
#    When click on confirm button present in pop up window
#    And  wait for disappearance of the loading progress bar
#    Then OverView screen is displayed
#    When click on open button of legal act
#    Then legal act page is displayed
#    And  annotation side bar is present
#    When double click on citation 2
#    And  wait for disappearance of the loading progress bar
#    Then ck editor window is displayed
#    When click on close button present in legal act page
#    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
#    When click on cancel button present in pop up window
#    When click on back button of the browser
#    Then the message "Changes you made may not be saved. Would you like to proceed?" is displayed in alert pop up
#    When click on cancel button present in browser alert pop up
#    And  click on home button
#    Then message "Unsaved changes will be lost. If you want to continue, press Confirm." is displayed in the "Open editor detected" pop up window
#    When click on confirm button present in pop up window
#    And  wait for disappearance of the loading progress bar
#    Then navigate to Repository Browser page
#    And  close the browser
