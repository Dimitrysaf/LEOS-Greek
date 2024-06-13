#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in repository browser page in drafting instance

@RepositoryBrowserScenarios
Feature: repository browser page Regression Features

    @uploadFileNotVisibleNonSupportUser @local
    Scenario: upload button is not present for non support user
        Given navigate to edit drafting application with "User3"
        Then user is on home page
        And upload button is not present