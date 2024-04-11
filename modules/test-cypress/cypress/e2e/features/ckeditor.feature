#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in CK Editor in Drafting Instance

@CKEditorTestingScenarios
Feature: CK 
#Editor features in Drafting Instance

  @ArticleEditing @local
  Scenario: append
  #append text in existing paragraph and make same paragraph into two inside article
    Given navigate to edit drafting application
    Then user is on repository browser page
    When click on create proposal button
    Then user is on create new legislative document window
    When click on template " SJ-023 - Proposal for a Regulation of the European Parliament and of the Council " under tree item
    When click on next button in create document page
    And  provide document title "Automation ck editor testing scenario" in create document page
    And  click on create button
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    When mousehover article 1
    When open ck editor for article 1
    When append " adding new data " at offset 8 in paragraph 1 of article 1 when ck editor is open
#    Then "Text...adding new data" is present in paragraph 1 of article 1 when ck editor is open
   # When click enter at offset 8 in paragraph 1 of article 1 when ck editor is open
#    Then "Text..." is present in paragraph 1 of article 1 when ck editor is open
#    And  "adding new data" is present in paragraph 1 of article 1 when ck editor is open
   When click save and close button of ck editor
   Then ck editor window is not displayed
   And  2 paragraphs are present in article 1
   # And  "Text..." is present in content of paragraph 1 of article 1
   # And  "adding new data" is present in content of paragraph 2 of article 1

#    When click on close button present in legal act page
#    Then user is on proposal viewer page


#   @paragraphEditing
#   Scenario: append text in existing paragraph and make same paragraph into two inside article
#     Given navigate to edit drafting application
#     Then  user is on EU login page
#     When  user enters username "n00015oj"
#     And   user clicks next button
#     Then  user is on login page
#     When  user enters password "Sweden1234"
#     And   user clicks on sign in button
#     Then  user is on repository browser page