#Author: Felipe Machado
#Keywords Summary : Testing different scenarios for track changes

@TrackChangesScenarios
Feature: Track Changes Feature

  @adding_new_character @local @nonlocal
  Scenario: Add new character in an Article in Legal Act
    Given navigate to edit drafting application with "User1"
    Then user is on repository browser page
    When click on create proposal button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation testing article ck editor scenario" in create document page
    And  click on create button
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    When enable track changes
    When mousehover and click on article 1
    Then ck editor window is displayed
    When append "A" at offset 4 in numbered paragraph 1 of article when ck editor is open
    And  click save and close button of ck editor
    Then document has 1 trackchange ins tags

  @adding_more_than_1_character @local @nonlocal
  Scenario: Add more than one character in an Article in Legal Act
    Given navigate to edit drafting application with "User1"
    Then user is on repository browser page
    When click on create proposal button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation testing article ck editor scenario" in create document page
    And  click on create button
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    When enable track changes
    When mousehover and click on article 1
    Then ck editor window is displayed
    When append "AB" at offset 4 in numbered paragraph 1 of article when ck editor is open
    And  click save and close button of ck editor
    Then document has 1 trackchange ins tags

@adding_trackchange_before_trackchange_notsaved @local @nonlocal
  Scenario: Add ins trackchange before ins trackchange before save character in an Article in Legal Act
    Given navigate to edit drafting application with "User1"
    Then user is on repository browser page
    When click on create proposal button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation testing article ck editor scenario" in create document page
    And  click on create button
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    When enable track changes
    When mousehover and click on article 1
    Then ck editor window is displayed
    When append "A" at offset 4 in numbered paragraph 1 of article when ck editor is open
    When append "B" at offset 4 in numbered paragraph 1 of article when ck editor is open
    And  click save and close button of ck editor
    Then document has 1 trackchange ins tags

@adding_trackchange_after_trackchange_notsaved @local @nonlocal
  Scenario: Add ins trackchange after ins trackchange before save character in an Article in Legal Act
    Given navigate to edit drafting application with "User1"
    Then user is on repository browser page
    When click on create proposal button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation testing article ck editor scenario" in create document page
    And  click on create button
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    When enable track changes
    When mousehover and click on article 1
    Then ck editor window is displayed
    When append "A" at offset 4 in numbered paragraph 1 of article when ck editor is open
    When append "B" at offset 0 of child 2 of numbered paragraph 1 of article when ck editor is open
    And  click save and close button of ck editor
    Then document has 1 trackchange ins tags

@adding_trackchange_after_trackchange_aftersave @local @nonlocal
  Scenario: Add ins trackchange after ins trackchange before save character in an Article in Legal Act
    Given navigate to edit drafting application with "User1"
    Then user is on repository browser page
    When click on create proposal button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation testing article ck editor scenario" in create document page
    And  click on create button
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    When enable track changes
    When mousehover and click on article 1
    Then ck editor window is displayed
    When append "A" at offset 4 in numbered paragraph 1 of article when ck editor is open
    And  click save and close button of ck editor
    When mousehover and click on article 1
    Then ck editor window is displayed
    When append "B" at offset 0 of child 2 of numbered paragraph 1 of article when ck editor is open
    And  click save and close button of ck editor
    Then document has 2 trackchange ins tags
