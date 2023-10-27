#Author: Satyabrata Das
#Keywords Summary : Cleaning up Features
@cleanUpCommission
Feature: Clean Up Features

  @cleanUpProposalCommission
  Scenario Outline: LEOS-4904 [EC] Delete all proposal created by Automation
    Given navigate to "Commission" edit application
    When  enter username "<username>" and password "<password>"
    And   wait for disappearance of the loading progress bar
    Then  navigate to Repository Browser page
    And   delete all the proposal containing keyword
      | Automation Eea Relevance |
      | Automation               |
    And   close the browser
    Examples:
      | username               | password              |
      | user.support.1.name    | user.support.1.pwd    |
      | user.nonsupport.1.name | user.nonsupport.1.pwd |

  @cleanUpFileFolderInRemoteMachine
  Scenario: delete files and folders in given path generated through automation suite in remote machine
    When delete files from below path in remote machine
      | leos-test\download |
    And  delete files and folders from below path in remote machine
      | leos-test\download\pdf\EC             |
      | leos-test\download\upload             |
      | leos-test\download\legFiles\generated |
      | leos-test\download\exportedProposal   |