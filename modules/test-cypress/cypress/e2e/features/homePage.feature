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
        When click on notification icon
        Then notification container is displayed
        And  upload notification button is not displayed
        When click on hide button in notification container
        Then notification container is not displayed
        When click on view all acts button
        Then user is on repository browser page
        And  upload act button is not present
        
    @uploadNotificationAndLanguageIconSupportUser @local
    Scenario: upload notification button is present for support user
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on notification icon
        Then notification container is displayed
        And  notification card list is displayed
        And  upload notification button is displayed
        When click on upload notification button
        Then "Upload notifications" dialog box window is displayed
        And  upload notification button is disabled in upload notifications window
        When click on cancel button in dialog box window
        Then notification container is not displayed
        When click on notification icon
        Then notification container is displayed
        When click on hide button in notification container
        Then notification container is not displayed
        When click on language icon
        Then below buttons are displayed under language icon
            | ButtonName    |
            | English (en)  |
            | français (fr) |