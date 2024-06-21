#Author: Felipe Machado
#Keywords Summary : Testing different scenarios for track changes

@TrackChangesScenarios
Feature: Track Changes Feature

  @trackChanges_on_num_text @local
  Scenario: Basic test to check num's track changes on newly added element
    # Login
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    # Upload file for test
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on proposal viewer page
    # Enter in Legal Act+
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    # Enable track changes
    When enable track changes
    # Open ckeditor
    When mouseover and click on article 1
    Then ck editor window is displayed
    # Do changes in text
    When move the cursor position to offset 38 in paragraph 1 of article in edition mode
    And  click enter from keyboard in edition mode
    When append "New paragraph" at offset 3 in numbered paragraph 2 of article when ck editor is open
    # Check result
    Then paragraph 2 of article has attribute "new"
    # Indent
    When move the cursor position to offset 3 in paragraph 2 of article in edition mode
    And  click on increase indent icon present in ck editor panel
    # Save and close
    And  click save and close button of ck editor
    # Check results
    Then num of point 1 of list 1 of paragraph 1 of article 1 has below content
      | ins  | "(a)"                              |
    Then point 1 of list 1 of paragraph 1 of article 1 has below content
      | ins  | "New paragraph"                    |

  @add_trackChanges_text @local
  Scenario: Basic tests for add track changes text in an article in Legal Act
    # Login
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    # Upload file for test
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on proposal viewer page
    # Enter in Legal Act
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    # Enable track changes
    When enable track changes
    # Open ckeditor
    When mouseover and click on article 1
    Then ck editor window is displayed
    # Do changes in text
    When append "A" at offset 4 in numbered paragraph 1 of article in edition mode
    When append "AB" at offset 4 of child 2 of numbered paragraph 1 of article in edition mode
    When append "A" at offset 4 in numbered paragraph 2 of article in edition mode
    When append "B" at offset 4 in numbered paragraph 2 of article in edition mode
    When append "A" at offset 4 of child 2 of numbered paragraph 2 of article in edition mode
    When append "B" at offset 0 of child 4 of numbered paragraph 2 of article in edition mode
    And  click save and close button of ck editor
    # Open ckeditor
    When mouseover and click on article 1
    Then ck editor window is displayed
    # Do changes in text
    When append "B" at offset 0 of child 4 of numbered paragraph 2 of article in edition mode
    And  click save and close button of ck editor
    # Check results
    Then paragraph 1 of article 1 has below content
      | text | "Numb"                           |
      | ins  | "A"                              |
      | text | "ered"                           |
      | ins  | "AB"                             |
      | text | " paragraphs with 2 paragraphs." |
    Then paragraph 2 of article 1 has below content
      | text | "Seco"               |
      | ins  | "BA"                 |
      | text | "nd n"               |
      | ins  | "AB"                 |
      | ins  | "B"                  |
      | text | "umbered paragraph." |

  @trackchanges_from_rules @local
  # Page with information: https://citnet.tech.ec.europa.eu/CITnet/confluence/pages/viewpage.action?spaceKey=LEOS&title=Leos+-+Track+changes
  # This test will cover: track changes scenarios 1 to 10
  Scenario: Track changes for rules in confluence
    # Login
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    # Upload file for test
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on proposal viewer page
    # Enter in Legal Act
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    # Enable track changes
    When enable track changes
    # Open ckeditor
    When mouseover and click on article 1
    Then ck editor window is displayed
    # Do changes in text
    When append " querying" at offset 8 in numbered paragraph 1 of article in edition mode
    When append "registered " at offset 12 of child 2 of numbered paragraph 1 of article in edition mode
    When append " querying" at offset 6 in numbered paragraph 2 of article in edition mode
    When append "registered " at offset 10 of child 2 of numbered paragraph 2 of article in edition mode
    When append " querying" at offset 5 in numbered paragraph 3 of article in edition mode
    When append "registered " at offset 10 of child 2 of numbered paragraph 3 of article in edition mode
    When append " querying" at offset 6 in numbered paragraph 4 of article in edition mode
    When append "registered " at offset 10 of child 2 of numbered paragraph 4 of article in edition mode
    When append " querying" at offset 5 in numbered paragraph 5 of article in edition mode
    When append "registered " at offset 10 of child 2 of numbered paragraph 5 of article in edition mode
    When append " querying" at offset 5 in numbered paragraph 6 of article in edition mode
    When append "registered " at offset 10 of child 2 of numbered paragraph 6 of article in edition mode
    When append " querying" at offset 7 in numbered paragraph 7 of article in edition mode
    When append "registered " at offset 10 of child 2 of numbered paragraph 7 of article in edition mode
    And  click save and close button of ck editor
    # Check results
    Then paragraph 1 of article 1 has below content
      | text | "Numbered"           |
      | ins  | " querying"          |
      | text | " paragraphs "       |
      | ins  | "registered "        |
      | text | "with 2 paragraphs." |
    Then paragraph 2 of article 1 has below content
      | text | "Second"      |
      | ins  | " querying"   |
      | text | " numbered "  |
      | ins  | "registered " |
      | text | "paragraph."  |
    Then paragraph 3 of article 1 has below content
      | text | "Third"       |
      | ins  | " querying"   |
      | text | " numbered "  |
      | ins  | "registered " |
      | text | "paragraph."  |
    Then paragraph 4 of article 1 has below content
      | text | "Fourth"      |
      | ins  | " querying"   |
      | text | " numbered "  |
      | ins  | "registered " |
      | text | "paragraph."  |
    Then paragraph 5 of article 1 has below content
      | text | "Fifth"       |
      | ins  | " querying"   |
      | text | " numbered "  |
      | ins  | "registered " |
      | text | "paragraph."  |
    Then paragraph 6 of article 1 has below content
      | text | "Sixth"       |
      | ins  | " querying"   |
      | text | " numbered "  |
      | ins  | "registered " |
      | text | "paragraph."  |
    # Open ckeditor
    When mouseover and click on article 1
    Then ck editor window is displayed
    # Do changes in text
    When press 11 times "del" at offset 0 of child 3 of numbered paragraph 1 of article in edition mode
    When press 9 times "backspace" at offset 0 of child 2 of numbered paragraph 1 of article in edition mode
    When press 9 times "del" at offset 0 of child 1 of numbered paragraph 2 of article in edition mode
    When press 11 times "backspace" at offset 0 of child 3 of numbered paragraph 2 of article in edition mode
    When press 3 times "backspace" at offset 6 of child 1 of numbered paragraph 3 of article in edition mode
    When press 3 times "del" at offset 6 of child 3 of numbered paragraph 3 of article in edition mode
    When press 3 times "backspace" at offset 3 of child 1 of numbered paragraph 4 of article in edition mode
    When press 3 times "del" at offset 8 of child 3 of numbered paragraph 4 of article in edition mode
    When press 8 times "backspace" at offset 15 of numbered paragraph 8 of article in edition mode
    When press 4 times "del" at offset 21 of child 2 of numbered paragraph 8 of article in edition mode
    When press 5 times "backspace" at offset 5 of child 2 of numbered paragraph 8 of article in edition mode
    When press 6 times "del" at offset 10 of child 2 of numbered paragraph 8 of article in edition mode
    When press 4 times "del" at offset 3 of child 0 of numbered paragraph 8 of article in edition mode
    When press 4 times "backspace" at offset 4 of child 5 of numbered paragraph 8 of article in edition mode
    When press 8 times "backspace" at offset 14 of numbered paragraph 9 of article in edition mode
    When press 4 times "del" at offset 21 of child 2 of numbered paragraph 9 of article in edition mode
    When press 8 times "backspace" at offset 14 of numbered paragraph 10 of article in edition mode
    When press 4 times "del" at offset 21 of child 2 of numbered paragraph 10 of article in edition mode
    And  click save and close button of ck editor
    # Check results
    # Ticket created to fix this issue:
    # https://code.europa.eu/leos/core/-/issues/1722
    # After this issue is fixed, uncomment next 2 lines
    # Then paragraph 1 of article 1 has below content
    #   | text | "Numbered paragraphs with 2 paragraphs." |
    Then paragraph 2 of article 1 has below content
      | text | "Second numbered paragraph." |
    Then paragraph 3 of article 1 has below content
      | text | "Third"      |
      | ins  | " quing"     |
      | text | " numbered " |
      | ins  | "registd "   |
      | text | "paragraph." |
    Then paragraph 4 of article 1 has below content
      | text | "Fourth"     |
      | ins  | "erying"     |
      | text | " numbered " |
      | ins  | "register"   |
      | text | "paragraph." |
    # Ticket created to fix this issue:
    # https://code.europa.eu/leos/core/-/issues/1725
    # After this issue is fixed, uncomment next 6 lines
    # Then paragraph 8 of article 1 has below content
    #   | text | "Eig"               |
    #   | del  | "hth numbered para" |
    #   | text | "graph with"        |
    #   | del  | " some more tex"    |
    #   | text | "t to test."        |
    Given navigate to edit drafting application with "User2"
    Then user is on home page
    When click on view all acts button
    Then user is on repository browser page
    # Open first proposal
    When open first proposal
    Then user is on proposal viewer page
    # Enter in Legal Act
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    # Open ckeditor
    When mouseover and click on article 1
    Then ck editor window is displayed
    # Do changes in text
    When press 9 times "backspace" at offset 0 of child 2 of numbered paragraph 5 of article in edition mode
    When press 11 times "del" at offset 0 of child 3 of numbered paragraph 5 of article in edition mode
    When press 15 times "backspace" at offset 3 of child 2 of numbered paragraph 6 of article in edition mode
    When press 18 times "del" at offset 3 of child 4 of numbered paragraph 6 of article in edition mode
    When press 3 times "backspace" at offset 6 of child 1 of numbered paragraph 7 of article in edition mode
    When press 3 times "del" at offset 3 of child 3 of numbered paragraph 7 of article in edition mode
    When press 5 times "backspace" at offset 5 of child 2 of numbered paragraph 9 of article in edition mode
    When press 5 times "del" at offset 11 of child 3 of numbered paragraph 9 of article in edition mode
    When press 3 times "del" at offset 3 of child 0 of numbered paragraph 9 of article in edition mode
    When press 4 times "backspace" at offset 4 of child 7 of numbered paragraph 9 of article in edition mode
    # Ticket created to fix one issue:
    # https://code.europa.eu/leos/core/-/issues/1725
    # After this issue is fixed, change next 2 lines to appropiate values of offset and child, and create the checks for it:
    # When press 16 times "backspace" at offset 4 of child 2 of numbered paragraph 10 of article in edition mode
    # When press 10 times "del" at offset 14 of child 5 of numbered paragraph 10 of article in edition mode
    And click save and close button of ck editor
    # Check results
    Then paragraph 5 of article 1 has below content
      | text     | "Fifth"      |
      | ins,del  | " querying"  |
      | text     | " numbered " |
      | ins,del  | "registered "|
      | text     | "paragraph." |
    Then paragraph 6 of article 1 has below content
      | text     | "Si"         |
      | del      | "xth"        |
      | ins,del  | " querying"  |
      | del      | " nu"        |
      | text     | "mbe"        |
      | del      | "red "       |
      | ins,del  | "registered "|
      | del      | "par"        |
      | text     | "agraph."    |
    Then paragraph 7 of article 1 has below content
      | text     | "Seventh"     |
      | html     | <ins leos:title="Das Satyabrata : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="dasatya" id=".*"> qu<del leos:title="DOE Jane : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="jane" id=".*">ery<\/del>ing<\/ins>   |
      | text     | " numbered "  |
      | html     | <ins leos:title="Das Satyabrata : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="dasatya" id=".*">reg<del leos:title="DOE Jane : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="jane" id=".*">ist</del>ered </ins> |
      | text     | "paragraph."  |
    # Ticket created to fix this issue:
    # https://code.europa.eu/leos/core/-/issues/1725
    # After this issue is fixed, uncomment next test
    # Then paragraph 9 of article 1 has below content
    #   | text  | "Nin"               |
    #   | html  | <del leos:title="DOE Jane : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="jane" id=".*">th </del> |
    #   | html  | <del leos:title="Das Satyabrata : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="dasatya" id=".*">numbered</del> |
    #   | html  | <del leos:title="DOE Jane : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="jane" id=".*"> para</del> |
    #   | text  | "graph with "        |
    #   | html  | <del leos:title="DOE Jane : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="jane" id=".*">some </del> |
    #   | html  | <del leos:title="Das Satyabrata : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="dasatya" id=".*">more</del> |
    #   | html  | <del leos:title="DOE Jane : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="jane" id=".*"> tex</del> |
    #   | text  | "t to test."        |
