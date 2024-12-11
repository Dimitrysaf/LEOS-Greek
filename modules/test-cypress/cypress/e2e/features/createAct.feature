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
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 2
        When click on legal act link present in act viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is maximized
        When mouseover and click on citation 2
        Then ck editor window is displayed
        When click at offset 59 of child 0 of citation in edition mode
        And  click on internal reference icon present in ck editor panel
        Then cke dialog window is displayed with title "Internal reference"
        When click on "Article 1 - Scope 1. Text..." link in enacting terms on the left side of internal reference window
        And  click on ok button in cke dialog window
        And  click save and close button of ck editor
        Then "Article 1" is added as internal reference 1 of citation 2
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
        When click on internal reference icon present in ck editor panel
        Then cke dialog window is displayed with title "Internal reference"
        When click on "Having regard to the proposal from the European..." link in citations on the left side of internal reference window
        And  click on ok button in cke dialog window
        And  click save and close button of ck editor
        Then "second citation" is added as internal reference 1 of paragraph 1 of article 1
        When click on import from oj button in ribbon toolbar
        Then "Import from the Official Journal of the European Union" dialog box window is displayed
        When select option "DIRECTIVE" for type field
        And  select option "2016" for year field
        And  provide value "2102" in Nr. field
        And  click on search button in import office journal window
        Then bill content is appeared in import office journal window
        When click on checkbox of recital 1
        When click on checkbox of recital 2
        When click on checkbox of recital 3
        When click on checkbox of article 1
        When click on checkbox of article 2
        When click on checkbox of article 3
        When click on import button
        Then 3 recitals are added in legal act by import oj
        Then 3 articles are added in legal act by import oj
        When click on close button present in legal act page
        Then user is on act viewer page
        When click on milestones tab in act view page
        And  click on add button in milestones tab
        Then add milestone window is displayed
        When click on milestone type dropdown
        When click on option "Other" from milestone type dropdown
        And  type "Commission act" in milestone title textBox
        When click on create milestone button
        Then successful message contains "Milestone created"
        And  "Commission act" is showing under title column of row 1 of milestones table
        And  "File ready" is showing under status column of row 1 of milestones table
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
        And  total number of annexes present in act viewer page is 2
        When click on legal act link present in act viewer page
        Then user is on legal act page
        And  "Article 1" is added as internal reference 1 of citation 2
        And  "second citation" is added as internal reference 1 of paragraph 1 of article 1
        When click on close button present in legal act page
        Then user is on act viewer page
        When click on close button on act viewer page
        Then user is on repository browser page
        Examples:
            | templateProposal | oldProposalName              | NewProposalName              |
            | SJ-023           | Automation Testing SJ-023 v1 | Automation Testing SJ-023 v2 |
#            | SJ-024           | Automation Testing SJ-024 v1 | Automation Testing SJ-024 v2 |
#            | SJ-025           | Automation Testing SJ-025 v1 | Automation Testing SJ-025 v2 |
#            | SJ-026           | Automation Testing SJ-026 v1 | Automation Testing SJ-026 v2 |
#            | SJ-019           | Automation Testing SJ-019 v1 | Automation Testing SJ-019 v2 |
