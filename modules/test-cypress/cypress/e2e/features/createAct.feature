#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities related to create act in drafting instance

@createProposalScenarios
Feature: create act regression features

    @createProposalByUploadingAndDownloadingLegFile @local
    Scenario Outline: user is able to create the act using different templates successfully
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on Create act button
        Then user is on create new legislative document window
        When click on template "<templateProposal>" in create new legislative document window
        When click on next button in create document page
        And  provide document title "<oldProposalName>" in create document page
        And  click on create button
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        When click on actions button
        And  click on download button
        And  extract recent "zip" file present in download folder
        When click on home button
        Then user is on home page
        When click on upload button
        Then active upload window label contains "Upload a legislative document"
        When upload recent leg file from downloads folder
        Then active upload window label contains "Document metadata"
        And  document title input field is displayed
        When provide document title "<NewProposalName>" in upload document page
        When click on create button in upload document page
        Then user is on act viewer page
        And  title of the act contains "<NewProposalName>" keyword
        And  total number of annexes present in act viewer page is 1
        When click on close button on act viewer page
        Then user is on repository browser page
        Examples:
            | templateProposal | oldProposalName              | NewProposalName              |
            | SJ-023           | Automation Testing SJ-023 v1 | Automation Testing SJ-023 v2 |
            | SJ-024           | Automation Testing SJ-024 v1 | Automation Testing SJ-024 v2 |
#            | SJ-025           | Automation Testing SJ-025 v1 | Automation Testing SJ-025 v2 |
#            | SJ-026           | Automation Testing SJ-026 v1 | Automation Testing SJ-026 v2 |
            | SJ-019           | Automation Testing SJ-019 v1 | Automation Testing SJ-019 v2 |
