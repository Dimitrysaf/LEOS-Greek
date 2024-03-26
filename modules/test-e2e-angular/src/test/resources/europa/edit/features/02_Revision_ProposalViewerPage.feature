#Author: Satyabrata Das
#Keywords Summary : Testing for different functionalities in Proposal Browser Page in CN instance of Edit Application
@ProposalBrowserPageRegressionScenariosEditCouncil
Feature: Proposal Browser Page Regression Features in Edit Council

  @closeButtonNotVisibleNonSupportUser @remote
  Scenario: LEOS-5025 [CN] download button is not available for non support user in proposal browser page
    Given navigate to "Revision" application
    Then user is on EU login page
    When user enters username "user.nonsupport.1.name"
    And  user clicks next button
    Then user is on login page
    When user enters password "user.nonsupport.1.pwd"
    And  user clicks on sign in button
#    Then  user is on home page
#    When  user clicks on view all acts button
    Then user is on repository browser page
    When click on proposal 1
    Then user is on proposal viewer page
#    And close button is not displayed
    When click on actions button present in proposal viewer screen
    Then share button is displayed and enabled
    And  export as pdf button is not displayed
    And  delete button is not displayed
    And  download button is not displayed

  @deleteMandate @remote
  Scenario: LEOS-4584,4145 [CN] Verify User is able to do create mandate, create milestone, title change of mandate and delete mandate
    Given navigate to "Revision" application
    Then user is on EU login page
    When user enters username "user.support.1.name"
    And  user clicks next button
    Then user is on login page
    When user enters password "user.support.1.pwd"
    And  user clicks on sign in button
#    Then user is on home page
#    When user clicks on view all acts button
    Then user is on repository browser page
    And  create mandate button is displayed and enabled
    And  create draft button is displayed and enabled
    When click on create mandate button
    Then user is on create new mandate window
    And  please select a leg file to be uploaded label is displayed in create mandate window
    When upload a leg file from relative location "/target/test-classes/upload/legFiles/PROP_ACT-4294241678941651921-EN.leg" in create mandate window
    Then enter draft metadata label is displayed in create mandate window
    And  "Automation Testing" is showing as draft title in create mandate window
    And  "English" is showing as draft language in create mandate window
    And  "Standard treatment" is showing as confidentiality level in create mandate window
    When click on create button in create mandate window
    Then user is on proposal viewer page
    When click on actions button present in proposal viewer screen
    And  click on delete button present in overview screen
    Then delete proposal confirmation windows pop up is displayed
    And  "Are you sure you want to delete this proposal" message is displayed
    When click on delete button in delete proposal confirmation windows pop up
    Then user is on repository browser page

  @closeButtonNotVisibleNonSupportUser @local
  Scenario: LEOS-5025 [CN] download button is not available for non support user in proposal browser page
    Given login to "Revision" instance with username "user.nonsupport.1.name"
    Then user is on repository browser page
    When click on proposal 1
    Then user is on proposal viewer page
#    And close button is not displayed
    When click on actions button present in proposal viewer screen
    Then share button is displayed and enabled
    And  export as pdf button is not displayed
    And  delete button is not displayed
    And  download button is not displayed

  @deleteMandate @local
  Scenario: LEOS-4584,4145 [CN] Verify User is able to do create mandate, create milestone, title change of mandate and delete mandate
    Given login to "Revision" instance with username "user.support.1.name"
    Then user is on repository browser page
    And  create mandate button is displayed and enabled
    And  create draft button is displayed and enabled
    When click on create mandate button
    Then user is on create new mandate window
    And  please select a leg file to be uploaded label is displayed in create mandate window
    When upload a leg file from relative location "/target/test-classes/upload/legFiles/PROP_ACT-4294241678941651921-EN.leg" in create mandate window
    Then enter draft metadata label is displayed in create mandate window
    And  "Automation Testing" is showing as draft title in create mandate window
    And  "English" is showing as draft language in create mandate window
    And  "Standard treatment" is showing as confidentiality level in create mandate window
    When click on create button in create mandate window
    Then user is on proposal viewer page
    When click on actions button present in proposal viewer screen
    And  click on delete button present in overview screen
    Then delete proposal confirmation windows pop up is displayed
    And  "Are you sure you want to delete this proposal" message is displayed
    When click on delete button in delete proposal confirmation windows pop up
    Then user is on repository browser page