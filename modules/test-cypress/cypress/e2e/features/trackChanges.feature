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
    Then user is on act viewer page
    # Enter in Legal Act+
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    # Enable track changes
    When enable track changes
    # Open ckeditor
    When mouseover and click on article 1
    Then ck editor window is displayed
    # Do changes in text
    When move the cursor position to offset 38 in paragraph 1 of article in edition mode
    And  click enter from keyboard in edition mode
    When append "New paragraph" at offset 3 in numbered paragraph 2 of article in edition mode
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
    When disable track changes
    Then enable track changes toggle bar is off in ribbon toolbar
    When click on insert after icon of article 1
    And  mouseover and click on article 2
    Then ck editor window is displayed
    When append "one" at offset 7 in numbered paragraph 1 of article in edition mode
    And  append "two" at offset 7 in numbered paragraph 2 of article in edition mode
    And  click enter from keyboard in edition mode
    And  append "Text...Third" at offset 0 in numbered paragraph 3 of article in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When mouseover and click on article 2
    Then ck editor window is displayed
    When click at offset 12 of li 3 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  append "new paragraph" at offset 0 in numbered paragraph 4 of article in edition mode
    And  click on paragraph mode icon present in ck editor panel
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    When mouseover and click on article 2
    Then ck editor window is displayed
    When click at offset 7 of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    Then li 3 with data-akn-element "paragraph" of article contains attribute "new" in edition mode
    And  li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "NEW" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  paragraph 3 of article 2 contains attribute "leos:tc-original-number" with value "NEW"
    And  content of paragraph 3 of article 2 contains "two"

  # Ticket LEOS#2073
  @toggleTrackChangesAndAddText @local
  Scenario: Toggle track changes and add text in an article in Legal Act
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Testing TC" in create document page
    And  click on create button
    Then user is on act viewer page
    And  title of the act contains "Automation Testing TC" keyword
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When mouseover and click on article 1
    Then ck editor window is displayed
    When append "Text" at offset 7 in numbered paragraph 1 of article in edition mode
    And  click save and close button of ck editor
    Then paragraph 1 of article 1 has below content
      | text | "Text..."                       |
      | ins  | "Text"                          |
    When disable track changes
    Then enable track changes toggle bar is off in ribbon toolbar
    When mouseover and click on article 1
    Then ck editor window is displayed
    When append "updated" at offset 4 of child 1 of numbered paragraph 1 of article in edition mode
    And  click save and close button of ck editor
    Then paragraph 1 of article 1 has below content
      | text | "Text..."                    |
      | ins  | "Text"                       |
      | text | "updated"                    |


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
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
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
    Then user is on act viewer page
    When click on collaborators tab in act view page
    And  click on add button in collaborators tab
    Then "Add users" dialog box window is displayed
    When provide input "demo" in name field of add users window
    And  click on row 1 from the user list in name field of add users window
    And  click on add users button
    Then "DEMO Demo" is displayed in row 2 of column name of collaborators tab
    And  "Author" is displayed in row 2 of column role of collaborators tab
    When click on drafts tab in act view page
    # Enter in Legal Act
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
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
    # Open first act
    When click on act 1
    Then user is on act viewer page
    # Enter in Legal Act
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
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

  @renumberingRecitalTrackChanges @local
  Scenario: test renumbering of recital when added and edited
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation testing recital track changes scenario" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When click on right angle icon of preamble link
    When drag element "Recital" from element tree list and drop before node label "(1) Recital..." in navigation pane
    Then preamble contains node label "# Recital..." and showing as bold
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  recital 1 contains attribute "leos:action" with value "insert"
    And  recital 1 contains attribute "leos:softaction" with value "add"
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of recital 2 contains value "(1)"
    And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of recital 2 contains value "(2)"
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of recital 3 contains value "(2)"
    And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of recital 3 contains value "(3)"
    When mouseover and click on recital 2
    Then ck editor window is displayed
    And  recital with "(2)" contains attribute "data-akn-num" with value "(2)" in edition mode
    And  recital with "(2)" contains attribute "data-akn-tc-original-number" with value "(1)" in edition mode
    When add "New Text " at offset 0 in recital in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    And  ins tag of aknp tag of recital 2 contains value "New Text "
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of recital 2 contains value "(1)"
    And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of recital 2 contains value "(2)"

  @renumberingTrackChanges @local
  Scenario: test renumbering of paragraphs when we add or delete paragraph
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When click on "Article 1 - Scope 1.Numbered paragraphs with 2 paragraphs." link in navigation pane
    Then article 1 is displayed
    When mouseover and click on article 1
    Then ck editor window is displayed
    And  15 paragraphs are present in article in edition mode
    When click at offset 25 of li 3 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    Then li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "4." in edition mode
    And  li 4 with data-akn-element "paragraph" of article contains attribute "new" in edition mode
    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "NEW" in edition mode
    And  li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "5." in edition mode
    And  li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "4." in edition mode
    And  li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "6." in edition mode
    And  li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "5." in edition mode
    And  li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "7." in edition mode
    And  li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "6." in edition mode
    And  li 8 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 8 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "8." in edition mode
    And  li 8 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "7." in edition mode
    And  li 9 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 9 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "9." in edition mode
    And  li 9 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "8." in edition mode
    And  li 10 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 10 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "10." in edition mode
    And  li 10 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "9." in edition mode
    And  li 11 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 11 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "11." in edition mode
    And  li 11 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "10." in edition mode
    And  li 12 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 12 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "12." in edition mode
    And  li 12 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "11." in edition mode
    And  li 13 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 13 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "13." in edition mode
    And  li 13 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "12." in edition mode
    And  li 14 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 14 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "14." in edition mode
    And  li 14 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "13." in edition mode
    And  li 15 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 15 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "15." in edition mode
    And  li 15 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "14." in edition mode
    And  li 16 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 16 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "16." in edition mode
    And  li 16 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "15." in edition mode
    When add content "New paragraph" to li 4 with data-akn-element "paragraph" of article in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When drag element "Article" from element tree list and drop before node label "Article 2 - Article heading... Unnumbered paragraphs with 2 paragraphs." in navigation pane
    Then enacting terms contains node label "Article # - Article heading... Text..." and showing as bold
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  enacting terms contains node label "Article 2 - Article heading... 1.Text..."
    When click on "Article 1 - Scope 1.Numbered paragraphs with 2 paragraphs." link in navigation pane
    Then article 1 is displayed
    And  inserted paragraph number of paragraph 4 of article 1 is "4."
    And  ins tag of num tag of paragraph 4 of article 1 contains attribute "leos:tc-original-number" with value "NEW"
    And  paragraph 4 of article 1 contains attribute "leos:tc-original-number" with value "NEW"
    And  content of paragraph 4 of article 1 contains "New paragraph"
    And  content of paragraph 4 of article 1 contains tag "ins"
    And  deleted paragraph number of paragraph 5 of article 1 is "4."
    And  inserted paragraph number of paragraph 5 of article 1 is "5."
    And  paragraph 5 of article 1 contains attribute "leos:tc-original-number" with value "4."
    And  deleted paragraph number of paragraph 6 of article 1 is "5."
    And  inserted paragraph number of paragraph 6 of article 1 is "6."
    And  paragraph 6 of article 1 contains attribute "leos:tc-original-number" with value "5."
    And  deleted paragraph number of paragraph 7 of article 1 is "6."
    And  inserted paragraph number of paragraph 7 of article 1 is "7."
    And  paragraph 7 of article 1 contains attribute "leos:tc-original-number" with value "6."
    And  deleted paragraph number of paragraph 8 of article 1 is "7."
    And  inserted paragraph number of paragraph 8 of article 1 is "8."
    And  paragraph 8 of article 1 contains attribute "leos:tc-original-number" with value "7."
    And  deleted paragraph number of paragraph 9 of article 1 is "8."
    And  inserted paragraph number of paragraph 9 of article 1 is "9."
    And  paragraph 9 of article 1 contains attribute "leos:tc-original-number" with value "8."
    And  deleted paragraph number of paragraph 10 of article 1 is "9."
    And  inserted paragraph number of paragraph 10 of article 1 is "10."
    And  paragraph 10 of article 1 contains attribute "leos:tc-original-number" with value "9."
    And  deleted paragraph number of paragraph 11 of article 1 is "10."
    And  inserted paragraph number of paragraph 11 of article 1 is "11."
    And  paragraph 11 of article 1 contains attribute "leos:tc-original-number" with value "10."
    And  deleted paragraph number of paragraph 12 of article 1 is "11."
    And  inserted paragraph number of paragraph 12 of article 1 is "12."
    And  paragraph 12 of article 1 contains attribute "leos:tc-original-number" with value "11."
    And  deleted paragraph number of paragraph 13 of article 1 is "12."
    And  inserted paragraph number of paragraph 13 of article 1 is "13."
    And  paragraph 13 of article 1 contains attribute "leos:tc-original-number" with value "12."
    And  deleted paragraph number of paragraph 14 of article 1 is "13."
    And  inserted paragraph number of paragraph 14 of article 1 is "14."
    And  paragraph 14 of article 1 contains attribute "leos:tc-original-number" with value "13."
    And  deleted paragraph number of paragraph 15 of article 1 is "14."
    And  inserted paragraph number of paragraph 15 of article 1 is "15."
    And  paragraph 15 of article 1 contains attribute "leos:tc-original-number" with value "14."
    And  deleted paragraph number of paragraph 16 of article 1 is "15."
    And  inserted paragraph number of paragraph 16 of article 1 is "16."
    And  paragraph 16 of article 1 contains attribute "leos:tc-original-number" with value "15."
    And  16 paragraphs are present in article 1
    When click on versions pane accordion
    Then search button is displayed in versions pane section
    When click on three vertical dots of card header title "Version 0.1.0 - Document created" in version pane
    And  click on revert to this version
    And  click on revert button in dialog box
    And  click on navigation pane accordion
    When click on "Article 1 - Scope 1.Numbered paragraphs with 2 paragraphs." link in navigation pane
    Then article 1 is displayed
    And  mouseover and click on article 1
    Then ck editor window is displayed
    And  15 paragraphs are present in article in edition mode
    When select content from offset 0 till offset 25 in numbered paragraph 3 of article in edition mode
    And  click backspace from keyboard in edition mode
    And  click backspace from keyboard in edition mode
    Then li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "3." in edition mode
    And  li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "3." in edition mode
    And  li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And  li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-action-enter" with value "delete" in edition mode
    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "4." in edition mode
    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "3." in edition mode
    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "5." in edition mode
    And  li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "4." in edition mode
    And  li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "6." in edition mode
    And  li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "5." in edition mode
    And  li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "7." in edition mode
    And  li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "6." in edition mode
    And  li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 8 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "8." in edition mode
    And  li 8 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "7." in edition mode
    And  li 8 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 9 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "9." in edition mode
    And  li 9 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "8." in edition mode
    And  li 9 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 10 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "10." in edition mode
    And  li 10 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "9." in edition mode
    And  li 10 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 11 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "11." in edition mode
    And  li 11 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "10." in edition mode
    And  li 11 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 12 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "12." in edition mode
    And  li 12 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "11." in edition mode
    And  li 12 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 13 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "13." in edition mode
    And  li 13 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "12." in edition mode
    And  li 13 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 14 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "14." in edition mode
    And  li 14 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "13." in edition mode
    And  li 14 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 15 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "15." in edition mode
    And  li 15 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "14." in edition mode
    And  li 15 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When drag element "Article" from element tree list and drop before node label "Article 2 - Article heading... Unnumbered paragraphs with 2 paragraphs." in navigation pane
    Then enacting terms contains node label "Article # - Article heading... Text..." and showing as bold
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  enacting terms contains node label "Article 2 - Article heading... 1.Text..."
    When click on "Article 1 - Scope 1.Numbered paragraphs with 2 paragraphs." link in navigation pane
    Then article 1 is displayed
    And  deleted paragraph number of paragraph 3 of article 1 is "3."
    And  del tag with attribute "leos\:action-enter" and value "delete" of num tag of paragraph 3 of article 1 contains value "↰"
    And  paragraph 3 of article 1 contains attribute "leos:tc-original-number" with value "3."
    And  paragraph 3 of article 1 contains attribute "leos:action-enter" with value "delete"
    And  paragraph 3 of article 1 contains attribute "leos:action-number" with value "delete"
    And  content of paragraph 3 of article 1 contains tag "del"
    And  deleted paragraph number of paragraph 4 of article 1 is "4."
    And  inserted paragraph number of paragraph 4 of article 1 is "3."
    And  paragraph 4 of article 1 contains attribute "leos:tc-original-number" with value "4."
    And  deleted paragraph number of paragraph 5 of article 1 is "5."
    And  inserted paragraph number of paragraph 5 of article 1 is "4."
    And  paragraph 5 of article 1 contains attribute "leos:tc-original-number" with value "5."
    And  deleted paragraph number of paragraph 6 of article 1 is "6."
    And  inserted paragraph number of paragraph 6 of article 1 is "5."
    And  paragraph 6 of article 1 contains attribute "leos:tc-original-number" with value "6."
    And  deleted paragraph number of paragraph 7 of article 1 is "7."
    And  inserted paragraph number of paragraph 7 of article 1 is "6."
    And  paragraph 7 of article 1 contains attribute "leos:tc-original-number" with value "7."
    And  deleted paragraph number of paragraph 8 of article 1 is "8."
    And  inserted paragraph number of paragraph 8 of article 1 is "7."
    And  paragraph 8 of article 1 contains attribute "leos:tc-original-number" with value "8."
    And  deleted paragraph number of paragraph 9 of article 1 is "9."
    And  inserted paragraph number of paragraph 9 of article 1 is "8."
    And  paragraph 9 of article 1 contains attribute "leos:tc-original-number" with value "9."
    And  deleted paragraph number of paragraph 10 of article 1 is "10."
    And  inserted paragraph number of paragraph 10 of article 1 is "9."
    And  paragraph 10 of article 1 contains attribute "leos:tc-original-number" with value "10."
    And  deleted paragraph number of paragraph 11 of article 1 is "11."
    And  inserted paragraph number of paragraph 11 of article 1 is "10."
    And  paragraph 11 of article 1 contains attribute "leos:tc-original-number" with value "11."
    And  deleted paragraph number of paragraph 12 of article 1 is "12."
    And  inserted paragraph number of paragraph 12 of article 1 is "11."
    And  paragraph 12 of article 1 contains attribute "leos:tc-original-number" with value "12."
    And  deleted paragraph number of paragraph 13 of article 1 is "13."
    And  inserted paragraph number of paragraph 13 of article 1 is "12."
    And  paragraph 13 of article 1 contains attribute "leos:tc-original-number" with value "13."
    And  deleted paragraph number of paragraph 14 of article 1 is "14."
    And  inserted paragraph number of paragraph 14 of article 1 is "13."
    And  paragraph 14 of article 1 contains attribute "leos:tc-original-number" with value "14."
    And  deleted paragraph number of paragraph 15 of article 1 is "15."
    And  inserted paragraph number of paragraph 15 of article 1 is "14."
    And  paragraph 15 of article 1 contains attribute "leos:tc-original-number" with value "15."
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When click on three vertical dots for the element contains text "Article 3 - Article heading... Unnumbered paragraphs with 2 paragraphs." in toc
    And  click on move option from dropdown content
    And  click on three vertical dots for the element contains text "Article 7 - Article heading... Unnumbered without children." in toc
    And  click on place before option from dropdown content
    Then "Article  3" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  3" in navigation pane
    And  "Article  #" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  #" in navigation pane
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  "Article  2" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  2" in navigation pane
    And  "Article  6" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  6" in navigation pane
    And  "Article 2" is showing as strikethrough in num of article 3 of bill
    And  "MOVED to Article 6" is showing as soft move label in num of article 3 of bill
    And  heading tag is not present for article 3 of bill
    And  paragraph tag is not present for article 3 of bill
    When click on soft move label with title "MOVED to Article 6"
    And "Article 2" is showing as track changes deleted in num of article 7 of bill
    And "Article 6" is showing as track changes inserted in num of article 7 of bill
    And "MOVED from Article 2" is showing as soft move label in num of article 7 of bill
    And  soft move label with title "MOVED from Article 2" is displayed
    When click on soft move label with title "MOVED from Article 2"
    Then soft move label with title "MOVED to Article 6" is displayed

  @numberedToUnnumberedViceVersaTrackChanges @local
  Scenario: test paragraph mode plugin inside ck editor for numbered and unnumbered paragraph with track changes enabled (cases 1 to 7 of https://code.europa.eu/leos/core/-/issues/1319)
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode7.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  ribbon toolbar is maximized
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When mouseover and click on article 3
    Then ck editor window is displayed
    When click at offset 2 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click on paragraph mode icon two times present in ck editor panel
    Then li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "1." in edition mode
    And  li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "1." in edition mode
    And  li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "2." in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "2." in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And  li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "3." in edition mode
    And  li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "3." in edition mode
    And  li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "4." in edition mode
    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "4." in edition mode
    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And  li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "5." in edition mode
    And  li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "5." in edition mode
    And  li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And  li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "6." in edition mode
    And  li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "6." in edition mode
    And  li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And  li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "7." in edition mode
    And  li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "7." in edition mode
    And  li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  paragraph 1 of article 3 contains attribute "leos:action-number" with value "delete"
    And  paragraph 1 of article 3 contains attribute "leos:tc-original-number" with value "1."
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of paragraph 1 of article 3 contains value "1."
    And  paragraph 2 of article 3 contains attribute "leos:action-number" with value "delete"
    And  paragraph 2 of article 3 contains attribute "leos:tc-original-number" with value "2."
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of paragraph 2 of article 3 contains value "2."
    And  paragraph 3 of article 3 contains attribute "leos:action-number" with value "delete"
    And  paragraph 3 of article 3 contains attribute "leos:tc-original-number" with value "3."
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of paragraph 3 of article 3 contains value "3."
    And  paragraph 4 of article 3 contains attribute "leos:action-number" with value "delete"
    And  paragraph 4 of article 3 contains attribute "leos:tc-original-number" with value "4."
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of paragraph 4 of article 3 contains value "4."
    And  paragraph 5 of article 3 contains attribute "leos:action-number" with value "delete"
    And  paragraph 5 of article 3 contains attribute "leos:tc-original-number" with value "5."
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of paragraph 5 of article 3 contains value "5."
    And  paragraph 6 of article 3 contains attribute "leos:action-number" with value "delete"
    And  paragraph 6 of article 3 contains attribute "leos:tc-original-number" with value "6."
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of paragraph 6 of article 3 contains value "6."
    And  paragraph 7 of article 3 contains attribute "leos:action-number" with value "delete"
    And  paragraph 7 of article 3 contains attribute "leos:tc-original-number" with value "7."
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of paragraph 7 of article 3 contains value "7."
    When mouseover and click on article 3
    Then ck editor window is displayed
    When click at offset 2 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click on paragraph mode icon present in ck editor panel
    Then li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "1." in edition mode
    And  li 1 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-tc-original-number" in edition mode
    And  li 1 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    Then li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "2." in edition mode
    And  li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-tc-original-number" in edition mode
    And  li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    Then li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "3." in edition mode
    And  li 3 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-tc-original-number" in edition mode
    And  li 3 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    Then li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "4." in edition mode
    And  li 4 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-tc-original-number" in edition mode
    And  li 4 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    Then li 5 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "5." in edition mode
    And  li 5 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-tc-original-number" in edition mode
    And  li 5 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    Then li 6 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "6." in edition mode
    And  li 6 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-tc-original-number" in edition mode
    And  li 6 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    Then li 7 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "7." in edition mode
    And  li 7 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-tc-original-number" in edition mode
    And  li 7 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  paragraph 1 of article 3 doesn't contain attribute "leos:action-number"
    And  paragraph 1 of article 3 doesn't contain attribute "leos:tc-original-number"
    And  num tag of paragraph 1 of article 3 doesn't contain "del" tag
    And  paragraph 2 of article 3 doesn't contain attribute "leos:action-number"
    And  paragraph 2 of article 3 doesn't contain attribute "leos:tc-original-number"
    And  num tag of paragraph 2 of article 3 doesn't contain "del" tag
    And  paragraph 3 of article 3 doesn't contain attribute "leos:action-number"
    And  paragraph 3 of article 3 doesn't contain attribute "leos:tc-original-number"
    And  num tag of paragraph 3 of article 3 doesn't contain "del" tag
    And  paragraph 4 of article 3 doesn't contain attribute "leos:action-number"
    And  paragraph 4 of article 3 doesn't contain attribute "leos:tc-original-number"
    And  num tag of paragraph 4 of article 3 doesn't contain "del" tag
    And  paragraph 5 of article 3 doesn't contain attribute "leos:action-number"
    And  paragraph 5 of article 3 doesn't contain attribute "leos:tc-original-number"
    And  num tag of paragraph 5 of article 3 doesn't contain "del" tag
    And  paragraph 6 of article 3 doesn't contain attribute "leos:action-number"
    And  paragraph 6 of article 3 doesn't contain attribute "leos:tc-original-number"
    And  num tag of paragraph 6 of article 3 doesn't contain "del" tag
    And  paragraph 7 of article 3 doesn't contain attribute "leos:action-number"
    And  paragraph 7 of article 3 doesn't contain attribute "leos:tc-original-number"
    And  num tag of paragraph 7 of article 3 doesn't contain "del" tag
    When mouseover and click on article 4
    Then ck editor window is displayed
    When click at offset 2 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click on paragraph mode icon present in ck editor panel
    Then li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "1." in edition mode
    And  li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "UNNUMBERED" in edition mode
    And  li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "2." in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "UNNUMBERED" in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  paragraph 1 of article 4 contains attribute "leos:action-number" with value "insert"
    And  paragraph 1 of article 4 contains attribute "leos:tc-original-number" with value "UNNUMBERED"
    And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of paragraph 1 of article 4 contains value "1."
    And  ins tag of num tag of paragraph 1 of article 4 contains attribute "leos:tc-original-number" with value "UNNUMBERED"
    And  paragraph 2 of article 4 contains attribute "leos:action-number" with value "insert"
    And  paragraph 2 of article 4 contains attribute "leos:tc-original-number" with value "UNNUMBERED"
    And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of paragraph 2 of article 4 contains value "2."
    And  ins tag of num tag of paragraph 1 of article 4 contains attribute "leos:tc-original-number" with value "UNNUMBERED"
    When mouseover and click on article 4
    Then ck editor window is displayed
    When click at offset 2 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click on paragraph mode icon present in ck editor panel
    Then li 1 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-num" in edition mode
    And  li 1 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-tc-original-number" in edition mode
    And  li 1 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    Then li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-num" in edition mode
    And  li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-tc-original-number" in edition mode
    And  li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  paragraph 1 of article 4 doesn't contain attribute "leos:action-number"
    And  paragraph 1 of article 4 doesn't contain attribute "leos:tc-original-number"
    And  paragraph 1 of article 4 doesn't contain num tag
    And  paragraph 2 of article 4 doesn't contain attribute "leos:action-number"
    And  paragraph 2 of article 4 doesn't contain attribute "leos:tc-original-number"
    And  paragraph 2 of article 4 doesn't contain num tag
    When mouseover and click on article 7
    Then ck editor window is displayed
    And click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click end from keyboard in edition mode
    And click enter from keyboard in edition mode
    And click end from keyboard in edition mode
    And add "with" at current cursor position in edition mode
    And click end from keyboard in edition mode
    And click enter from keyboard in edition mode
    And add "children" at current cursor position in edition mode
    Then p tag 2 of li 1 with data-akn-element "paragraph" of article contains html '<span data-akn-action="insert" data-akn-uid="jane" title="DOE Jane">with</span>' in edition mode
    Then p tag 3 of li 1 with data-akn-element "paragraph" of article contains html '<span data-akn-action="insert" data-akn-uid="jane" title="DOE Jane">children</span>' in edition mode
    When click save and close button of ck editor
    Then  subparagraph 2 of paragraph 1 of article 7 doesn't contain attribute "leos:action-number"
    And  subparagraph 2 of paragraph 1 of article 7 doesn't contain attribute "leos:action"
    And  subparagraph 2 of paragraph 1 of article 7 contains attribute "leos:action-enter" with value "insert"
    And  subparagraph 1 of list 1 of paragraph 1 of article 7 doesn't contain attribute "leos:action-number"
    And  subparagraph 1 of list 1 of paragraph 1 of article 7 doesn't contain attribute "leos:action"
    And  subparagraph 1 of list 1 of paragraph 1 of article 7 contains attribute "leos:action-enter" with value "insert"
    When mouseover and click on article 8
    Then ck editor window is displayed
    And click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click right arrow from keyboard in edition mode
    And click right arrow from keyboard in edition mode
    And click right arrow from keyboard in edition mode
    And click enter from keyboard in edition mode
    Then p tag 2 of li 1 with data-akn-element "paragraph" of article should have "data-akn-action-enter" with value "insert" in edition mode
    And p tag 2 of li 1 with data-akn-element "paragraph" of article should have "data-akn-uid-enter" with value "jane" in edition mode
    And p tag 2 of li 1 with data-akn-element "paragraph" of article should not have "data-akn-action-number" in edition mode
    And p tag 2 of li 1 with data-akn-element "paragraph" of article should not have "data-akn-action" in edition mode
    When click save and close button of ck editor
    Then subparagraph 1 of list 1 of paragraph 2 of article 8 doesn't contain attribute "leos:action-number"
    And subparagraph 1 of list 1 of paragraph 2 of article 8 doesn't contain attribute "leos:action"
    And subparagraph 1 of list 1 of paragraph 2 of article 8 contains attribute "leos:action-enter" with value "insert"
    When mouseover and click on article 7
    And ck editor window is displayed
    And click at offset 0 in li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And click backspace from keyboard in edition mode
    And click at offset 0 in li 1 with data-akn-element "subparagraph" of li 2 with data-akn-element "paragraph" of article in edition mode
    And click backspace from keyboard in edition mode
    And click at offset 0 in li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And click backspace from keyboard in edition mode
    Then li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-action-enter" with value "delete" in edition mode
    And li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-enter" with value "jane" in edition mode
    And li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-number" with value "jane" in edition mode
    And li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(b)" in edition mode
    And li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-enter" with value "delete" in edition mode
    And li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-enter" with value "jane" in edition mode
    And li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-number" with value "jane" in edition mode
    And li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "2." in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-enter" with value "delete" in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-enter" with value "jane" in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-number" with value "jane" in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(a)" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-number" with value "jane" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "(b)" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(a)" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-enter" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-uid-enter" in edition mode
    When click save and close button of ck editor
    Then 'del' tag 1 of num tag of point 2 of list 1 of paragraph 1 of article 7 contains "↰"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 1 of article 7 has attribute "leos:action-enter" with value "delete"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action-number"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action"
    And 'del' tag 2 of num tag of point 2 of list 1 of paragraph 1 of article 7 contains "(b)"
    And 'del' tag 2 of num tag of point 2 of list 1 of paragraph 1 of article 7 has attribute "leos:action-number" with value "delete"
    And 'del' tag 2 of num tag of point 2 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action-delete"
    And 'del' tag 2 of num tag of point 2 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of paragraph 2 of article 7 has text "↰"
    And 'del' tag 1 of num tag of paragraph 2 of article 7 has attribute "leos:action-enter" with value "delete"
    And 'del' tag 1 of num tag of paragraph 2 of article 7 doesn't have attribute "leos:action-number"
    And 'del' tag 1 of num tag of paragraph 2 of article 7 doesn't have attribute "leos:action"
    And 'del' tag 2 of num tag of paragraph 2 of article 7 has text "2."
    And 'del' tag 2 of num tag of paragraph 2 of article 7 has attribute "leos:action-number" with value "delete"
    And 'del' tag 2 of num tag of paragraph 2 of article 7 doesn't have attribute "leos:action-enter"
    And 'del' tag 2 of num tag of paragraph 2 of article 7 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 contains "↰"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 has attribute "leos:action-enter" with value "delete"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-number"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action"
    And 'del' tag 2 of num tag of point 1 of list 1 of paragraph 2 of article 7 contains "(a)"
    And 'del' tag 2 of num tag of point 1 of list 1 of paragraph 2 of article 7 has attribute "leos:action-number" with value "delete"
    And 'del' tag 2 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-delete"
    And 'del' tag 2 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 contains "(b)"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 has attribute "leos:tc-original-number" with value "(b)"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-delete"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 contains "(a)"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 has attribute "leos:tc-original-number" with value "(b)"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-delete"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action"

  @Cases8To10FromStory1319 @local
  Scenario: Cases 8 to 10 of https://code.europa.eu/leos/core/-/issues/1319
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode7.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  ribbon toolbar is maximized
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When mouseover and click on article 8
    And ck editor window is displayed
    And click at offset 0 in li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And click backspace from keyboard in edition mode
    And click at offset 0 in li 1 with data-akn-element "subparagraph" of li 2 with data-akn-element "paragraph" of article in edition mode
    And click backspace from keyboard in edition mode
    And click at offset 0 in li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And click backspace from keyboard in edition mode
    Then li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-action-enter" with value "delete" in edition mode
    And li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-enter" with value "jane" in edition mode
    And li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-number" with value "jane" in edition mode
    And li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(b)" in edition mode
    And li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-enter" with value "delete" in edition mode
    And li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-number" in edition mode
    And li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-enter" with value "jane" in edition mode
    And li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-uid-number" in edition mode
    And li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-num" in edition mode
    And li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "UNNUMBERED" in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-enter" with value "delete" in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "delete" in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-enter" with value "jane" in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-number" with value "jane" in edition mode
    And li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(a)" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-uid-number" with value "jane" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "(b)" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(a)" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-action-enter" in edition mode
    And li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-uid-enter" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 1 of article 8 contains "↰"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 1 of article 8 has attribute "leos:action-enter" with value "delete"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action-number"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action"
    And 'del' tag 2 of num tag of point 2 of list 1 of paragraph 1 of article 8 contains "(b)"
    And 'del' tag 2 of num tag of point 2 of list 1 of paragraph 1 of article 8 has attribute "leos:action-number" with value "delete"
    And 'del' tag 2 of num tag of point 2 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action-delete"
    And 'del' tag 2 of num tag of point 2 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action"
    And paragraph 2 of article 8 contains attribute "leos:action-enter" with value "delete"
    And paragraph 2 of article 8 contains attribute "leos:tc-original-number" with value "UNNUMBERED"
    And paragraph 2 of article 8 doesn't contain attribute "leos:action-number"
    And paragraph 2 of article 8 doesn't contain attribute "leos:action"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 8 contains "↰"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 8 has attribute "leos:action-enter" with value "delete"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action-number"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action"
    And 'del' tag 2 of num tag of point 1 of list 1 of paragraph 2 of article 8 contains "(a)"
    And 'del' tag 2 of num tag of point 1 of list 1 of paragraph 2 of article 8 has attribute "leos:action-number" with value "delete"
    And 'del' tag 2 of num tag of point 1 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action-delete"
    And 'del' tag 2 of num tag of point 1 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 contains "(b)"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 has attribute "leos:tc-original-number" with value "(b)"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action-delete"
    And 'del' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 contains "(a)"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 has attribute "leos:tc-original-number" with value "(b)"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action-delete"
    And 'ins' tag 1 of num tag of point 2 of list 1 of paragraph 2 of article 8 doesn't have attribute "leos:action"
    When mouseover and click on article 3
    And ck editor window is displayed
    And click at offset 5 of li 3 with data-akn-element "paragraph" of article in edition mode
    And click enter from keyboard in edition mode
    And add "Test" at current cursor position in edition mode
    When click save and close button of ck editor
    Then num tag of paragraph 1 of article 3 has html "1."
    And num tag of paragraph 2 of article 3 has html "2."
    And num tag of paragraph 3 of article 3 has html "3."
    And 'ins' tag 1 of num tag of paragraph 4 of article 3 has text "4."
    And 'ins' tag 1 of num tag of paragraph 4 of article 3 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 4 of article 3 has attribute "leos:tc-original-number" with value "NEW"
    And 'ins' tag 1 of num tag of paragraph 4 of article 3 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 4 of article 3 doesn't have attribute "leos:action"
    And 'del' tag in num tag of paragraph 4 of article 3 should not exist
    And 'del' tag 1 of num tag of paragraph 5 of article 3 has text "4."
    And 'del' tag 1 of num tag of paragraph 5 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 5 of article 3 has attribute "leos:tc-original-number" with value "4."
    And 'del' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 has text "5."
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 has attribute "leos:tc-original-number" with value "4."
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of paragraph 6 of article 3 has text "5."
    And 'del' tag 1 of num tag of paragraph 6 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 6 of article 3 has attribute "leos:tc-original-number" with value "5."
    And 'del' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 has text "6."
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 has attribute "leos:tc-original-number" with value "5."
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of paragraph 7 of article 3 has text "6."
    And 'del' tag 1 of num tag of paragraph 7 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 7 of article 3 has attribute "leos:tc-original-number" with value "6."
    And 'del' tag 1 of num tag of paragraph 7 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 7 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of paragraph 7 of article 3 has text "7."
    And 'ins' tag 1 of num tag of paragraph 7 of article 3 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 7 of article 3 has attribute "leos:tc-original-number" with value "6."
    And 'ins' tag 1 of num tag of paragraph 7 of article 3 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 7 of article 3 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of paragraph 8 of article 3 has text "7."
    And 'del' tag 1 of num tag of paragraph 8 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 8 of article 3 has attribute "leos:tc-original-number" with value "7."
    And 'del' tag 1 of num tag of paragraph 8 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 8 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of paragraph 8 of article 3 has text "8."
    And 'ins' tag 1 of num tag of paragraph 8 of article 3 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 8 of article 3 has attribute "leos:tc-original-number" with value "7."
    And 'ins' tag 1 of num tag of paragraph 8 of article 3 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 8 of article 3 doesn't have attribute "leos:action"
    When mouseover and click on article 4
    And ck editor window is displayed
    And click at offset 19 of li 2 with data-akn-element "paragraph" of article in edition mode
    And click enter from keyboard in edition mode
    And add "Test" at current cursor position in edition mode
    When click save and close button of ck editor
    Then num tag of paragraph 1 of article 4 should not exist
    And num tag of paragraph 2 of article 4 should not exist
    And num tag of paragraph 3 of article 4 should not exist
    And paragraph 1 of article 4 contains attribute "leos:tc-original-number" with value "UNNUMBERED"
    And paragraph 1 of article 4 doesn't contain attribute "leos:action-number"
    And paragraph 1 of article 4 doesn't contain attribute "leos:action-enter"
    And paragraph 1 of article 4 doesn't contain attribute "leos:action"
    And paragraph 2 of article 4 contains attribute "leos:tc-original-number" with value "UNNUMBERED"
    And paragraph 2 of article 4 doesn't contain attribute "leos:action-number"
    And paragraph 2 of article 4 doesn't contain attribute "leos:action-enter"
    And paragraph 2 of article 4 doesn't contain attribute "leos:action"
    And paragraph 3 of article 4 contains attribute "leos:tc-original-number" with value "NEW"
    And paragraph 3 of article 4 contains attribute "leos:action-number" with value "insert"
    And paragraph 3 of article 4 doesn't contain attribute "leos:action-enter"
    And paragraph 3 of article 4 doesn't contain attribute "leos:action"

  @Cases11To16FromStory1319 @local
  Scenario: Cases 11 to 16 of https://code.europa.eu/leos/core/-/issues/1319
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode7.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  ribbon toolbar is maximized
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When mouseover and click on article 7
    And ck editor window is displayed
    Then click at offset 0 in li 1 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on decrease indent icon present in ck editor panel
    When click save and close button of ck editor
    Then num tag of paragraph 1 of article 7 has html "1."
    And 'del' tag 1 of num tag of paragraph 2 of article 7 has text "(a)"
    And 'del' tag 1 of num tag of paragraph 2 of article 7 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 2 of article 7 has attribute "leos:tc-original-number" with value "(a)"
    And 'del' tag 1 of num tag of paragraph 2 of article 7 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 2 of article 7 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of paragraph 2 of article 7 has text "2."
    And 'ins' tag 1 of num tag of paragraph 2 of article 7 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 2 of article 7 has attribute "leos:tc-original-number" with value "(a)"
    And 'ins' tag 1 of num tag of paragraph 2 of article 7 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 2 of article 7 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 has html "(b)"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 has attribute "leos:tc-original-number" with value "(b)"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-delete"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 has html "(a)"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 has attribute "leos:tc-original-number" with value "(b)"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action-delete"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 2 of article 7 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of paragraph 3 of article 7 has text "2."
    And 'del' tag 1 of num tag of paragraph 3 of article 7 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 3 of article 7 has attribute "leos:tc-original-number" with value "2."
    And 'del' tag 1 of num tag of paragraph 3 of article 7 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 3 of article 7 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of paragraph 3 of article 7 has text "3."
    And 'ins' tag 1 of num tag of paragraph 3 of article 7 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 3 of article 7 has attribute "leos:tc-original-number" with value "2."
    And 'ins' tag 1 of num tag of paragraph 3 of article 7 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 3 of article 7 doesn't have attribute "leos:action"
    Then num tag of point 1 of list 1 of paragraph 3 of article 7 has html "(a)"
    When mouseover and click on article 7
    And ck editor window is displayed
    Then click at offset 0 in li 1 with data-akn-element "subparagraph" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    When click save and close button of ck editor
    Then num tag of paragraph 1 of article 7 has html "1."
    And num tag of paragraph 2 of article 7 has html "2."
    And num tag of point 1 of list 1 of paragraph 1 of article 7 has html "(a)"
    And num tag of point 1 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action-number"
    And num tag of point 1 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action-enter"
    And num tag of point 1 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action"
    And num tag of point 1 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 has html "(b)"
    And 'del' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 has attribute "leos:tc-original-number" with value "(b)"
    And 'del' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 has html "(i)"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 has attribute "leos:tc-original-number" with value "(b)"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 7 doesn't have attribute "leos:action"
    And num tag of point 1 of list 1 of paragraph 2 of article 7 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 2 of article 7 has html "(b)"
    When mouseover and click on article 7
    And ck editor window is displayed
    Then click at offset 0 in li 1 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And click down arrow from keyboard in edition mode
    And click on decrease indent icon present in ck editor panel
    Then click save and close button of ck editor
    And num tag of paragraph 1 of article 7 has html "1."
    And num tag of paragraph 2 of article 7 has html "2."
    And num tag of point 1 of list 1 of paragraph 1 of article 7 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 1 of article 7 has html "(b)"
    And num tag of point 1 of list 1 of paragraph 2 of article 7 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 2 of article 7 has html "(b)"
    When mouseover and click on article 3
    And ck editor window is displayed
    Then click at offset 0 in li 1 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click on increase indent icon present in ck editor panel
    Then click save and close button of ck editor
    And num tag of paragraph 1 of article 3 has html "1."
    And num tag of point 1 of list 1 of paragraph 1 of article 3 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 1 of article 3 has html "(b)"
    And num tag of paragraph 2 of article 3 has html "2."
    And num tag of paragraph 3 of article 3 has html "3."
    And num tag of paragraph 4 of article 3 has html "4."
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 has html "5."
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 has attribute "leos:tc-original-number" with value "5."
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 has html "(a)"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 has attribute "leos:tc-original-number" with value "5."
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of point 1 of list 1 of paragraph 4 of article 3 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of paragraph 5 of article 3 has text "6."
    And 'del' tag 1 of num tag of paragraph 5 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 5 of article 3 has attribute "leos:tc-original-number" with value "6."
    And 'del' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 has text "5."
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 has attribute "leos:tc-original-number" with value "6."
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of paragraph 6 of article 3 has text "7."
    And 'del' tag 1 of num tag of paragraph 6 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 6 of article 3 has attribute "leos:tc-original-number" with value "7."
    And 'del' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 has text "6."
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 has attribute "leos:tc-original-number" with value "7."
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action"
    When mouseover and click on article 3
    And ck editor window is displayed
    Then click at offset 0 in li 1 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click on decrease indent icon present in ck editor panel
    Then click save and close button of ck editor
    And num tag of paragraph 1 of article 3 has html "1."
    And num tag of point 1 of list 1 of paragraph 1 of article 3 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 1 of article 3 has html "(b)"
    And num tag of paragraph 2 of article 3 has html "2."
    And num tag of paragraph 3 of article 3 has html "3."
    And num tag of paragraph 4 of article 3 has html "4."
    And num tag of paragraph 5 of article 3 has html "5."
    And num tag of point 1 of list 1 of paragraph 5 of article 3 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 5 of article 3 has html "(b)"
    And num tag of paragraph 6 of article 3 has html "6."
    And num tag of paragraph 7 of article 3 has html "7."
    When mouseover and click on article 8
    And ck editor window is displayed
    Then click at offset 0 in li 1 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And click on decrease indent icon present in ck editor panel
    Then click save and close button of ck editor
    Then num tag of paragraph 1 of article 8 should not exist
    And 'del' tag 1 of num tag of paragraph 2 of article 8 has text "(a)"
    And 'del' tag 1 of num tag of paragraph 2 of article 8 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 2 of article 8 has attribute "leos:tc-original-number" with value "(a)"
    And 'del' tag 1 of num tag of paragraph 2 of article 8 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 2 of article 8 doesn't have attribute "leos:action"
    And 'ins' tag of num tag of paragraph 2 of article 8 should not exist
    And num tag of paragraph 3 of article 8 should not exist
    When mouseover and click on article 8
    And ck editor window is displayed
    Then click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click down arrow from keyboard in edition mode
    And click on increase indent icon present in ck editor panel
    And click down arrow from keyboard in edition mode
    And click on decrease indent icon present in ck editor panel
    Then click save and close button of ck editor
    And num tag of paragraph 1 of article 8 should not exist
    And num tag of paragraph 2 of article 8 should not exist
    And num tag of point 1 of list 1 of paragraph 1 of article 8 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 1 of article 8 has html "(b)"
    And num tag of point 1 of list 1 of paragraph 2 of article 8 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 2 of article 8 has html "(b)"

  @Cases17To20FromStory1319 @local
  Scenario: Cases 17 to 20 of https://code.europa.eu/leos/core/-/issues/1319 and another case from story https://code.europa.eu/leos/core/-/issues/2208 (in comments)
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode7.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  ribbon toolbar is maximized
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When mouseover and click on article 8
    And ck editor window is displayed
    Then click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click on increase indent icon present in ck editor panel
    Then click save and close button of ck editor
    And num tag of paragraph 1 of article 8 should not exist
    And num tag of point 1 of list 1 of paragraph 1 of article 8 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 1 of article 8 has html "(b)"
    And 'ins' tag 1 of num tag of point 3 of list 1 of paragraph 1 of article 8 has html "(c)"
    And 'ins' tag 1 of num tag of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:tc-original-number" with value "UNNUMBERED"
    And 'ins' tag 1 of num tag of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action"
    And 'del' tag of num tag of point 3 of list 1 of paragraph 1 of article 8 should not exist
    And 'del' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has html "(a)"
    And 'del' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:tc-original-number" with value "(a)"
    And 'del' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has html "(i)"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:tc-original-number" with value "(a)"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of point 1 of list 1 of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action"
    And 'del' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has html "(b)"
    And 'del' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:tc-original-number" with value "(b)"
    And 'del' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action"
    And 'ins' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has html "(ii)"
    And 'ins' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 has attribute "leos:tc-original-number" with value "(b)"
    And 'ins' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of point 2 of list 1 of point 3 of list 1 of paragraph 1 of article 8 doesn't have attribute "leos:action"
    When mouseover and click on article 8
    And ck editor window is displayed
    Then click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click on decrease indent icon present in ck editor panel
    Then click save and close button of ck editor
    And num tag of paragraph 1 of article 8 should not exist
    And num tag of point 1 of list 1 of paragraph 1 of article 8 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 1 of article 8 has html "(b)"
    And num tag of paragraph 2 of article 8 should not exist
    And num tag of point 1 of list 1 of paragraph 2 of article 8 has html "(a)"
    And num tag of point 2 of list 1 of paragraph 2 of article 8 has html "(b)"
    When mouseover and click on article 3
    And ck editor window is displayed
    Then click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    When click on paragraph mode icon two times present in ck editor panel
    And click backspace from keyboard in edition mode
    Then click save and close button of ck editor
    And 'del' tag 1 of num tag of paragraph 1 of article 3 has html "1."
    And 'del' tag 1 of num tag of paragraph 1 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 1 of article 3 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 1 of num tag of paragraph 1 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 1 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag of num tag of paragraph 1 of article 3 should not exist
    And paragraph 1 of article 3 has attribute "leos:action-number" with value "delete"
    And paragraph 1 of article 3 has attribute "leos:tc-original-number" with value "1."
    And 'del' tag 1 of num tag of paragraph 2 of article 3 has html "2."
    And 'del' tag 1 of num tag of paragraph 2 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 2 of article 3 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 1 of num tag of paragraph 2 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 2 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag of num tag of paragraph 2 of article 3 should not exist
    And paragraph 2 of article 3 has attribute "leos:action-number" with value "delete"
    And paragraph 2 of article 3 has attribute "leos:tc-original-number" with value "2."
    And 'del' tag 1 of num tag of paragraph 3 of article 3 has html "3."
    And 'del' tag 1 of num tag of paragraph 3 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 3 of article 3 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 1 of num tag of paragraph 3 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 3 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag of num tag of paragraph 3 of article 3 should not exist
    And paragraph 3 of article 3 has attribute "leos:action-number" with value "delete"
    And paragraph 3 of article 3 has attribute "leos:tc-original-number" with value "3."
    And 'del' tag 1 of num tag of paragraph 4 of article 3 has html "↰"
    And 'del' tag 1 of num tag of paragraph 4 of article 3 has attribute "leos:action-enter" with value "delete"
    And 'del' tag 1 of num tag of paragraph 4 of article 3 doesn't have attribute "leos:action-number"
    And 'del' tag 1 of num tag of paragraph 4 of article 3 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 1 of num tag of paragraph 4 of article 3 doesn't have attribute "leos:action"
    And 'del' tag 2 of num tag of paragraph 4 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 2 of num tag of paragraph 4 of article 3 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 2 of num tag of paragraph 4 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 2 of num tag of paragraph 4 of article 3 doesn't have attribute "leos:action"
    And paragraph 4 of article 3 has attribute "leos:action-number" with value "delete"
    And paragraph 4 of article 3 has attribute "leos:tc-original-number" with value "4."
    And 'del' tag 1 of num tag of paragraph 5 of article 3 has html "5."
    And 'del' tag 1 of num tag of paragraph 5 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 5 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag of num tag of paragraph 5 of article 3 should not exist
    And paragraph 5 of article 3 has attribute "leos:action-number" with value "delete"
    And paragraph 5 of article 3 has attribute "leos:tc-original-number" with value "5."
    And 'del' tag 1 of num tag of paragraph 6 of article 3 has html "6."
    And 'del' tag 1 of num tag of paragraph 6 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 6 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag of num tag of paragraph 6 of article 3 should not exist
    And paragraph 6 of article 3 has attribute "leos:action-number" with value "delete"
    And paragraph 6 of article 3 has attribute "leos:tc-original-number" with value "6."
    And 'del' tag 1 of num tag of paragraph 3 of article 3 has html "3."
    And 'del' tag 1 of num tag of paragraph 3 of article 3 has attribute "leos:action-number" with value "delete"
    And 'del' tag 1 of num tag of paragraph 3 of article 3 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 1 of num tag of paragraph 3 of article 3 doesn't have attribute "leos:action-enter"
    And 'del' tag 1 of num tag of paragraph 3 of article 3 doesn't have attribute "leos:action"
    And 'ins' tag of num tag of paragraph 3 of article 3 should not exist
    And paragraph 3 of article 3 has attribute "leos:action-number" with value "delete"
    And paragraph 3 of article 3 has attribute "leos:tc-original-number" with value "3."
    When mouseover and click on article 4
    And ck editor window is displayed
    Then click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on paragraph mode icon present in ck editor panel
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click down arrow from keyboard in edition mode
    And click backspace from keyboard in edition mode
    Then click save and close button of ck editor
    And 'ins' tag 1 of num tag of paragraph 1 of article 4 has html "1."
    And 'ins' tag 1 of num tag of paragraph 1 of article 4 has attribute "leos:action-number" with value "insert"
    And 'ins' tag 1 of num tag of paragraph 1 of article 4 has attribute "leos:tc-original-number" with value "UNNUMBERED"
    And 'ins' tag 1 of num tag of paragraph 1 of article 4 doesn't have attribute "leos:action-enter"
    And 'ins' tag 1 of num tag of paragraph 1 of article 4 doesn't have attribute "leos:action"
    And 'del' tag of num tag of paragraph 1 of article 4 should not exist
    And paragraph 1 of article 4 has attribute "leos:action-number" with value "insert"
    And paragraph 1 of article 4 has attribute "leos:tc-original-number" with value "UNNUMBERED"
    And 'del' tag 1 of num tag of paragraph 2 of article 4 has html "↰"
    And 'del' tag 1 of num tag of paragraph 2 of article 4 has attribute "leos:action-enter" with value "delete"
    And 'del' tag 1 of num tag of paragraph 2 of article 4 doesn't have attribute "leos:action-number"
    And 'del' tag 1 of num tag of paragraph 2 of article 4 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 1 of num tag of paragraph 2 of article 4 doesn't have attribute "leos:action"
    And 'del' tag 2 of num tag of paragraph 2 of article 4 has html "2."
    And 'del' tag 2 of num tag of paragraph 2 of article 4 has attribute "leos:action-number" with value "delete"
    And 'del' tag 2 of num tag of paragraph 2 of article 4 doesn't have attribute "leos:action-enter"
    And 'del' tag 2 of num tag of paragraph 2 of article 4 doesn't have attribute "leos:tc-original-number"
    And 'del' tag 2 of num tag of paragraph 2 of article 4 doesn't have attribute "leos:action"
    And paragraph 2 of article 4 has attribute "leos:action-number" with value "delete"
    And paragraph 2 of article 4 has attribute "leos:action-enter" with value "delete"
    And paragraph 2 of article 4 has attribute "leos:tc-original-number" with value "UNNUMBERED"
    When disable track changes
    Then enable track changes toggle bar is off in ribbon toolbar
    When mouseover and click on article 1
    And ck editor window is displayed
    Then click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click on paragraph mode icon two times present in ck editor panel
    Then click save and close button of ck editor
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When mouseover and click on article 1
    And ck editor window is displayed
    Then click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on paragraph mode icon present in ck editor panel
    And click down arrow from keyboard in edition mode
    And click end from keyboard in edition mode
    And click enter from keyboard in edition mode
    And add "Test" at current cursor position in edition mode
    And click on paragraph mode icon present in ck editor panel
    Then click save and close button of ck editor
    And paragraph 3 of article 1 has attribute 'leos:tc-original-number' with value 'NEW'
    And paragraph 3 of article 1 has attribute 'leos:action-number' with value 'insert'
    And num tag of paragraph 3 of article 1 should not exist
    When mouseover and click on article 1
    And ck editor window is displayed
    Then click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on paragraph mode icon present in ck editor panel
    Then click save and close button of ck editor
    And paragraph 3 of article 1 has attribute 'leos:tc-original-number' with value 'NEW'
    And paragraph 3 of article 1 has attribute 'leos:action-number' with value 'insert'
    And ins tag of num tag of paragraph 3 of article 1 contains attribute 'leos:tc-original-number' with value 'NEW'
    And ins tag of num tag of paragraph 3 of article 1 contains attribute 'leos:action-number' with value 'insert'
    And num tag of paragraph 3 of article 1 doesn't contain "del" tag

  @rejectingTrackChanges @local
  Scenario: to test rejecting track changes for different scenarios
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When click on insert after icon of citation 4
    Then citation 5 contains attribute "leos:action" with value "insert"
    And  total citation count is 7
    When click on right angle icon of preamble link
    Then citations section contains new element in navigation pane
    When click on insert before icon of recital 2
    Then recital 2 contains attribute "leos:action" with value "insert"
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of recital 3 contains value "(2)"
    And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of recital 3 contains value "(3)"
    And  total recital count is 3
    And  recitals section contains new element in navigation pane
    When click on insert after icon of article 1
    Then article 2 contains attribute "leos:action" with value "insert"
    And  del tag of num tag of article 3 contains value "Article 2"
    And  ins tag of num tag of article 3 contains value "Article 3"
    And  del tag of num tag of article 4 contains value "Article 3"
    And  ins tag of num tag of article 4 contains value "Article 4"
    And  total article count is 11
    And  enacting terms contains new element in navigation pane
    When right click on citation 5
    And  click on reject this change option under track changes action
    Then total citation count is 6
    And  citations section doesn't contain new element in navigation pane
    When right click on recital 2
    And  click on reject this change option under track changes action
    Then total recital count is 2
    And  recitals section doesn't contain new element in navigation pane
    When right click on article 2
    And  click on reject this change option under track changes action
    Then total article count is 10
    And  enacting terms doesn't contain new element in navigation pane
    When click on close button present in legal act page
    Then user is on act viewer page
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on annex 1 link
    Then user is on annex page
    And  ribbon toolbar is maximized
    And  annotation side bar is present
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When click on insert after icon of level 1
    Then total number of level is 4
    And  level 2 contains attribute "leos:action" with value "insert"
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of level 3 contains value "1.1."
    And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of level 3 contains value "2.1."
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of level 4 contains value "2."
    And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of level 4 contains value "3."
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When drag element "Paragraph" from element tree list and drop after node label "3. Text..." in navigation pane
    Then success message "Paragraph has been added successfully!" is displayed in navigation pane
    And  success message disappears from table of content
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  total number of paragraph is 1
    When right click on level 2
    And  click on reject this change option under track changes action
    Then total number of level is 3
    When right click on paragraph 1
    And  click on reject this change option under track changes action
    Then no paragraph exists

  @movePointInAnnexTrackChanges @local
  Scenario: move of point inside annex using 3 dots and drag and drop
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Testing Move Point in Annex" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on annex 1 link
    Then user is on annex page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    When click on insert after icon of level 2
    Then total number of level is 4
    When click on insert after icon of level 2
    Then total number of level is 5
    When click on insert after icon of level 2
    Then total number of level is 6
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When click on three vertical dots for the element contains text "1.1. Text..." in toc
    And  click on move option from dropdown content
    And  click on three vertical dots for the element contains text "1.4. Text..." in toc
    And  click on place before option from dropdown content
    Then "MOVED" is showing as soft move label with soft move title " 1.1." in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " #" in navigation pane
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  "MOVED" is showing as soft move label with soft move title " 1.1." in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " 1.3." in navigation pane
    And  level 2 contains attribute "leos:action" with value "delete"
    And  level 2 contains attribute "leos:softaction" with value "move_to"
    And  level 2 contains attribute "leos:softmove_label" with value "MOVED to point 1.3"
    And  level 2 contains attribute "leos:softactionroot" with value "true"
    And  level 2 contains attribute "leos:deletable" with value "false"
    And  level 2 contains attribute "leos:editable" with value "false"
    And  "MOVED to point 1.3" is showing as soft move label in num of level 2
    And  level 5 contains attribute "leos:softaction" with value "move_from"
    And  level 5 contains attribute "leos:softmove_label" with value "MOVED from point 1.1"
    And  level 5 contains attribute "leos:softactionroot" with value "true"
    And  num of level 5 contains attribute "leos:action" with value "insert"
    And  num value of level 5 contains "1.3."
    And  "MOVED from point 1.1" is showing as soft move label in num of level 5
    When right click on soft move label of num of level 2
    And  click on reject this change option under track changes action
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When drag node label "1.1. Text..." and drop to node label "1.3. Text..." in navigation pane
    Then "MOVED" is showing as soft move label with soft move title " 1.1." in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " #" in navigation pane
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  "MOVED" is showing as soft move label with soft move title " 1.1." in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " 1.3." in navigation pane
    And  level 2 contains attribute "leos:action" with value "delete"
    And  level 2 contains attribute "leos:softaction" with value "move_to"
    And  level 2 contains attribute "leos:softmove_label" with value "MOVED to point 1.3"
    And  level 2 contains attribute "leos:softactionroot" with value "true"
    And  level 2 contains attribute "leos:deletable" with value "false"
    And  level 2 contains attribute "leos:editable" with value "false"
    And  "MOVED to point 1.3" is showing as soft move label in num of level 2
    And  level 5 contains attribute "leos:softaction" with value "move_from"
    And  level 5 contains attribute "leos:softmove_label" with value "MOVED from point 1.1"
    And  level 5 contains attribute "leos:softactionroot" with value "true"
    And  num of level 5 contains attribute "leos:action" with value "insert"
    And  num value of level 5 contains "1.3."
    And  "MOVED from point 1.1" is showing as soft move label in num of level 5

  @importOJTrackChanges @local
  Scenario: import from office journal
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation import OJ Testing with track changes" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
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
    And  recital 3 contains attribute "leos:action" with value "insert"
    And  recital 4 contains attribute "leos:action" with value "insert"
    And  recital 5 contains attribute "leos:action" with value "insert"
    And  article 4 contains attribute "leos:action" with value "insert"
    And  article 5 contains attribute "leos:action" with value "insert"
    And  article 6 contains attribute "leos:action" with value "insert"
    When click on versions pane accordion
    Then last subversion of recent changes version card contains "0.1.1Import element(s) inserted"