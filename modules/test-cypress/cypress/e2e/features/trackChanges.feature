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
    Then user is on act viewer page
    When click on collaborators tab in act view page
    And  click on add button in collaborators tab
    Then user is on "Add users" window
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
    # Open first act
    When click on act 1
    Then user is on act viewer page
    # Enter in Legal Act
    When click on legal act link present in act viewer page
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

  @renumberingTrackChanges @local
  Scenario: test renumbering of paragraphs when we add or delete paragraph
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-ExamplesForChangeParagraphMode6.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
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