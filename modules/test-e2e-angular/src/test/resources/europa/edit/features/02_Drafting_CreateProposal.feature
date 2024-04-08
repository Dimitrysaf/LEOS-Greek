#Author: Satyabrata Das
#Keywords Summary : Testing for different functionalities in Create Proposal Page
@CreateProposalEditDrafting
Feature: Create Proposal Regression Features in Edit Commission

  @createProposalByDownloadingAndUploadingLegFile @remote
  Scenario Outline: Verify user is able to create the proposal successfully
    Given navigate to "Drafting" application
    Then  user is on EU login page
    When  user enters username "user.support.1.name"
    And   user clicks next button
    Then  user is on login page
    When  user enters password "user.support.1.pwd"
    And   user clicks on sign in button
#    Then  user is on home page
#    When  user clicks on view all acts button
    Then  user is on repository browser page
    And  create proposal button is displayed and enabled
    When click on create proposal button
    Then user is on create new legislative document window
    Then "Select the document type and language" label is displayed in create document page
    When click on template "<templateProposal>" under tree item
    When click on next button in create document page
    Then "Enter document metadata" label is displayed in create document page
    When click on previous button in create document page
    Then "Select the document type and language" label is displayed in create document page
    When click on cancel button in create document page
    Then user is on repository browser page
    When click on create proposal button
    Then user is on create new legislative document window
    Then "Select the document type and language" label is displayed in create document page
    And  previous button is disabled
    When click on template "<templateProposal>" under tree item
    Then next button is enabled
    When click on next button in create document page
    Then "Enter document metadata" label is displayed in create document page
    And  previous button is enabled
    When provide document title "<oldProposalName>" in create document page
    And  click on create button
    Then user is on proposal viewer page
    And  title of the proposal contains "<oldProposalName>" keyword
    And  close button is displayed and enabled in proposal viewer page
    And  "Drafts" is showing in tab 1
    And  "Milestones" is showing in tab 2
    And  "Collaborators" is showing in tab 3
    And  active tab name is "Drafts" in proposal viewer page
    And  cover page section is present
    And  explanatory memorandum section is present
    And  legal act section is present
    And  financial statement section is present
    And  " There is no financial statement in this document " content is displayed under financial statement section
    And  annexes section is present
    And  " There is no annex to this document " content is displayed under annexes section
    When click on add button present under annexes section
    Then 1 annexes found under annexes section
    And  numbers of annex present in annexes section are 1
    And  title of Annex 1 is "Annex"
    When click on actions button present in proposal viewer screen
    When click on download button
    And  sleep for 10000 milliseconds
    Then user is on proposal viewer page
    When move the downloaded zip file to relative location "/target/download"
    And  unzip recent "zip" file from relative location "/target/download" and put the unzipped files in relative location "/target/download/legFiles/generated"
    When click on home link
    Then user is on repository browser page
    When click on upload button
    Then user is on upload new legislative document window
    And  please select a leg file to be uploaded label is displayed in upload document page
    When upload a recent "leg" file from relative location "/target/download/legFiles/generated"
    Then enter document metadata label is displayed in upload document page
    And  "English" is showing as document language
    And  "Standard treatment" is showing as confidentiality level
    When provide document title "<NewProposalName>" in upload document page
    And  click on create button in upload document page
    Then user is on proposal viewer page
    Then title of the proposal contains "<NewProposalName>" keyword
    And  "Drafts" is showing in tab 1
    And  numbers of annex present in annexes section are 1
    And  title of Annex 1 is "Annex"
    When click on close button present in proposal viewer page
    Then user is on repository browser page
    Examples:
      | templateProposal                                                                                    | oldProposalName              | NewProposalName              |
      | SJ-023 - Proposal for a Regulation of the European Parliament and of the Council                    | Automation Testing SJ-023 v1 | Automation Testing SJ-023 v2 |
      | SJ-024 - Proposal for a Directive of the European Parliament and of the Council                     | Automation Testing SJ-024 v1 | Automation Testing SJ-024 v2 |
      | SJ-025 - Proposal for a Decision of the European Parliament and of the Council                      | Automation Testing SJ-025 v1 | Automation Testing SJ-025 v2 |
      | SJ-026 - Proposal for a Decision of the European Parliament and of the Council (without addressees) | Automation Testing SJ-026 v1 | Automation Testing SJ-026 v2 |
      | SJ-019 - Proposal for a Council Decision                                                            | Automation Testing SJ-019 v1 | Automation Testing SJ-019 v2 |

  @createProposalByDownloadingAndUploadingLegFile @local
  Scenario Outline: Verify user is able to create the proposal successfully
    Given login to "Drafting" instance with username "user.support.1.name"
    Then  user is on repository browser page
    And  create proposal button is displayed and enabled
    When click on create proposal button
    Then user is on create new legislative document window
    Then "Select the document type and language" label is displayed in create document page
    When click on template "<templateProposal>" under tree item
    When click on next button in create document page
    Then "Enter document metadata" label is displayed in create document page
    When click on previous button in create document page
    Then "Select the document type and language" label is displayed in create document page
    When click on cancel button in create document page
    Then user is on repository browser page
    When click on create proposal button
    Then user is on create new legislative document window
    Then "Select the document type and language" label is displayed in create document page
    And  previous button is disabled
    When click on template "<templateProposal>" under tree item
    Then next button is enabled
    When click on next button in create document page
    Then "Enter document metadata" label is displayed in create document page
    And  previous button is enabled
    When provide document title "<oldProposalName>" in create document page
    And  click on create button
    Then user is on proposal viewer page
    And  title of the proposal contains "<oldProposalName>" keyword
    And  close button is displayed and enabled in proposal viewer page
    And  "Drafts" is showing in tab 1
    And  "Milestones" is showing in tab 2
    And  "Collaborators" is showing in tab 3
    And  active tab name is "Drafts" in proposal viewer page
    And  cover page section is present
    And  explanatory memorandum section is present
    And  legal act section is present
    And  financial statement section is present
    And  " There is no financial statement in this document " content is displayed under financial statement section
    And  annexes section is present
    And  " There is no annex to this document " content is displayed under annexes section
    When click on add button present under annexes section
    Then 1 annexes found under annexes section
    And  numbers of annex present in annexes section are 1
    And  title of Annex 1 is "Annex"
    When click on actions button present in proposal viewer screen
    When click on download button
    And  sleep for 20000 milliseconds
    Then user is on proposal viewer page
    And  unzip recent "zip" file from relative location "/target/download" and put the unzipped files in relative location "/target/download/legFiles/generated"
    When click on home link
    Then user is on repository browser page
    When click on upload button
    Then user is on upload new legislative document window
    And  please select a leg file to be uploaded label is displayed in upload document page
    When upload a recent "leg" file from relative location "/target/download/legFiles/generated"
    Then enter document metadata label is displayed in upload document page
    And  "English" is showing as document language
    And  "Standard treatment" is showing as confidentiality level
    When provide document title "<NewProposalName>" in upload document page
    And  click on create button in upload document page
    Then user is on proposal viewer page
    Then title of the proposal contains "<NewProposalName>" keyword
    And  "Drafts" is showing in tab 1
    And  numbers of annex present in annexes section are 1
    And  title of Annex 1 is "Annex"
    When click on close button present in proposal viewer page
    Then user is on repository browser page
    Examples:
      | templateProposal                                                                                    | oldProposalName              | NewProposalName              |
      | SJ-023 - Proposal for a Regulation of the European Parliament and of the Council                    | Automation Testing SJ-023 v1 | Automation Testing SJ-023 v2 |
      | SJ-024 - Proposal for a Directive of the European Parliament and of the Council                     | Automation Testing SJ-024 v1 | Automation Testing SJ-024 v2 |
      | SJ-025 - Proposal for a Decision of the European Parliament and of the Council                      | Automation Testing SJ-025 v1 | Automation Testing SJ-025 v2 |
      | SJ-026 - Proposal for a Decision of the European Parliament and of the Council (without addressees) | Automation Testing SJ-026 v1 | Automation Testing SJ-026 v2 |
      | SJ-019 - Proposal for a Council Decision                                                            | Automation Testing SJ-019 v1 | Automation Testing SJ-019 v2 |