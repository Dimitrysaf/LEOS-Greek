#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in repository browser page in drafting instance

@RepositoryBrowserScenarios
Feature: repository browser page Regression Features

  @uploadFileNotVisibleNonSupportUser
  Scenario: upload button is not present for non support user
    Given navigate to leos application with "username1"
    Then user is on home page
#    Then upload act button is not present
#    When click on view all acts button
#    Then user is on repository browser page
#    Then upload act button is not present