#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in milestone section in drafting instance

@milestoneSectionScenarios
Feature: milestone section regression features

    Background:
        Given navigate to edit drafting application with "User1"
        Then user is on home page

    @validateMilestoneExplorer @local
    Scenario: validate milestone explorer
        When click on create proposal button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation Testing Validate PDF in MileStone Explorer" in create document page
        And  click on create button
        Then user is on proposal viewer page
        When click on add button in annexes section
        Then total number of annexes present in proposal viewer page is 1
        When click on add button in annexes section
        Then total number of annexes present in proposal viewer page is 2
        When click on milestones tab in proposal view page
        And  click on add button in milestones tab
        Then add milestone window is displayed
        When click on milestone type dropdown
        Then "For Interservice Consultation" option is selected by default
        Then milestone title textbox is disabled
        When click on option "Other" from milestone type dropdown
        And  type "Commission proposal" in milestone title textbox
        When click on create milestone button
        Then successful message contains "Milestone created"
        And  "Commission proposal" is showing under title column of row 1 of milestones table
        And  "File ready" is showing under status column of row 1 of milestones table
        When click on three dots under actions column of row 1 of milestones table
        Then below options are displayed under milestone actions
            | MilestoneActions             |
            | View                         |
            | Send a copy for contribution |
            | Download                     |
        When click on option "View" under milestone actions
        Then user is on milestone explorer window
        And  milestone explorer window contains below tabs
            | TabName                |
            | Explanatory Memorandum |
            | Legal Act              |
            | Annex 1                |
            | Annex 2                |
#         When click on export button present in milestone explorer window
#         And  recent pdf file present in downloads folder contains below words
#             | EXPLANATORY MEMORANDUM                                                                  |
#             | THE EUROPEAN PARLIAMENT AND THE COUNCIL OF THE EUROPEAN UNION,                          |
#             | Having regard to the Treaty on the Functioning of the European Union, and in particular |
#             | Having regard to the proposal from the European Commission,                             |
#             | After transmission of the draft legislative act to the national Parliaments,            |
#             | (1) Recital...                                                                          |
#             | (2) Recital...                                                                          |
#             | Article 1                                                                               |
#             | Scope                                                                                   |
#             | Article 2                                                                               |
#             | For the European Parliament                                                             |
#             | For the Council                                                                         |
#             | The President                                                                           |
#             | ANNEX I                                                                                 |
#             | ANNEX II                                                                                |
        When click on close button in milestone explorer view
        Then user is on proposal viewer page