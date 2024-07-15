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

  @addTrackChangesText @local
  Scenario: Basic tests for add track changes text in an article in Legal Act
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    When enable track changes
    When mouseover and click on article 1
    Then ck editor window is displayed
    When append "A" at offset 4 in numbered paragraph 1 of article in edition mode
    When append "AB" at offset 4 of child 2 of numbered paragraph 1 of article in edition mode
    When append "A" at offset 4 in numbered paragraph 2 of article in edition mode
    When append "B" at offset 4 in numbered paragraph 2 of article in edition mode
    When append "A" at offset 4 of child 2 of numbered paragraph 2 of article in edition mode
    When append "B" at offset 0 of child 4 of numbered paragraph 2 of article in edition mode
    And  click save and close button of ck editor
    When mouseover and click on article 1
    Then ck editor window is displayed
    When append "B" at offset 0 of child 4 of numbered paragraph 2 of article in edition mode
    And  click save and close button of ck editor
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

  @trackChangesFromRules @local
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
    When click on collaborators tab in proposal view page
    And  click on add button in collaborators tab
    Then user is on "Add users" window
    When provide input "demo" in name field of add users window
    And  click on row 1 from the user list in name field of add users window
    And  click on add users button
    Then "DEMO Demo" is displayed in row 2 of column name of collaborators tab
    And  "Author" is displayed in row 2 of column role of collaborators tab
    When click on drafts tab in proposal view page
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
    Given navigate to edit drafting application with "User3"
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
      | html     | <ins leos:title="DOE Jane : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="jane" id=".*"> qu<del leos:title="DEMO Demo : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="demo" id=".*">ery<\/del>ing<\/ins>   |
      | text     | " numbered "  |
      | html     | <ins leos:title="DOE Jane : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="jane" id=".*">reg<del leos:title="DEMO Demo : \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}" leos:uid="demo" id=".*">ist</del>ered </ins> |
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

  @moveLabelWithTrackChanges @local @focus
  Scenario: Basic test to move element inside legal act when track changes is on
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-clymts48h00018g73xyrc19ma-en.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  toc editing button is displayed and enabled
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When click on toc edit button
    And  click on "Article 1 - Scope 1. Text..." link in navigation pane
    And  drag node label "Article 1 - Scope 1. Text..." to node label "Article 3 - Entry into force This Regulation shall enter into force on the [...] day following that of its publication in the Official Journal of the European Union." in navigation pane

    And  " Article  1" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  1" in navigation pane
    And  " Article  #" is showing as soft move title in selected node in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  #" in selected node in navigation pane

    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled

    And  " Article  1" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  1" in navigation pane
    And  " Article  3" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  3" in navigation pane
    And "Article 1" is showing as moved num in article 1 of bill
    And "MOVED to Article 3" is showing as soft move label in article 1 of bill
    And heading tag is not present for article 1 of bill
    And paragraph tag is not present for article 1 of bill
    And "Article 2" is showing as deleted track changes in article 2 of bill
    And "Article 1" is showing as inserted track changes in article 2 of bill
    And "Article 3" is showing as deleted track changes in article 3 of bill
    And "Article 2" is showing as inserted track changes in article 3 of bill
    And num of article 4 of bill contains "Article 3" with action "insert"
    And "MOVED from Article 1" is showing as soft move label in article 4 of bill
    And heading tag is present for article 4 of bill
    And paragraph tag is present for article 4 of bill