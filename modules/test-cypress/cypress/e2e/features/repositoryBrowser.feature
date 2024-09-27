#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in repository browser page in drafting instance

@RepositoryBrowserScenarios
Feature: repository browser page Regression Features

    @uploadFileNotVisibleNonSupportUser @local
    Scenario: upload button is not present for non support user
        Given navigate to edit drafting application with "User3"
        Then user is on home page
        And  upload act button is not present
        When click on support button
        Then below options are displayed in support menu
            | optionList       |
            | Contact us       |
            | Learn about EdiT |
            | Go to GoPro      |
            | Go to Decide     |
        When click on view all acts button
        Then user is on repository browser page
        And  upload act button is not present