#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in legal act in drafting instance

@LegalActScenarios
Feature: Legal Act Page Regression Features

  @citation_recital_editing @local
  Scenario: Add and removal of text in citation and recital element in legal Act
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    And  collapse all button is displayed in create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation testing citation and recital scenarios" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    And  annotation side bar is present
    And  annotation pane is minimized
    When minimize ribbon toolbar
    Then ribbon toolbar is minimized
    When maximize ribbon toolbar
    Then ribbon toolbar is maximized
    And  zoom percentage level is showing 100 in ribbon toolbar
    When click on zoom in button in ribbon toolbar
    Then zoom percentage level is showing 110 in ribbon toolbar
    When click on zoom out button in ribbon toolbar
    Then zoom percentage level is showing 100 in ribbon toolbar
    When click on zoom out button in ribbon toolbar
    Then zoom percentage level is showing 90 in ribbon toolbar
    When click on zoom in button in ribbon toolbar
    Then zoom percentage level is showing 100 in ribbon toolbar
    When click on annotation forward pane
    Then annotation pane is maximized
    When click on annotation back pane
    Then annotation pane is minimized
    When mouseover and click on citation 1
    Then ck editor window is displayed
    When select content from offset 7 till offset 14 in citation in edition mode
    And  click delete button from keyboard in edition mode
    And  add "New Text " at offset 7 in citation in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    And  citation 1 contains "New Text"
    And  citation 1 doesn't contain "regard"
    When mouseover and click on citation 2
    Then ck editor window is displayed
    When click close button of ck editor
    Then ck editor window is not displayed
    When mouseover and click on recital 2
    Then ck editor window is displayed
    When add " New Text " at offset 7 in recital in edition mode
    And  select content from offset 0 till offset 7 in recital in edition mode
    And  click delete button from keyboard in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    And  recital 2 contains "New Text"
    And  recital 2 doesn't contain "Recital"
    When click on close button present in legal act page
    Then user is on act viewer page
    When click on close button on act viewer page
    Then user is on repository browser page

  @splittingParagraphInArticle @local
  Scenario: append text in existing paragraph and make same paragraph into two inside article
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation testing article ck editor scenario" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    When mouseover and click on article 1
    Then ck editor window is displayed
    Then numbered paragraph 1 of article contains "Text..." in edition mode
    And  numbered paragraph 2 of article contains "Text..." in edition mode
    When append " New Text " at offset 7 in numbered paragraph 1 of article in edition mode
    Then numbered paragraph 1 of article contains "Text... New Text" in edition mode
    When move the cursor position to offset 7 in paragraph 1 of article in edition mode
    And  click enter from keyboard in edition mode
    Then numbered paragraph 1 of article contains "Text..." in edition mode
    And  numbered paragraph 2 of article contains "New Text" in edition mode
    And  numbered paragraph 3 of article contains "Text..." in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  3 paragraphs are present in article 1
    And  content of paragraph 1 of article 1 contains "Text..."
    And  content of paragraph 2 of article 1 contains "New Text"
    And  content of paragraph 3 of article 1 contains "Text..."
    When click on close button present in legal act page
    Then user is on act viewer page

  @articleWithSingleNumberedParagraph @local
  Scenario: Article with single paragraph cannot be numbered
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-3210011215583606762-EN.leg"
    Then active upload window label contains "Guidance approval"
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    When mouseover and click on article 1
    Then ck editor window is displayed
    When append "New Text" at offset 7 in numbered paragraph 1 of article in edition mode
    Then numbered paragraph 1 of article contains "Text...New Text" in edition mode
    When click save and close button of ck editor
    Then drafting rule violations dialog box displayed with message "Articles with a single paragraph cannot be numbered."
    Then click dialog ok button
    When move the cursor position to offset 7 in paragraph 1 of article in edition mode
    And  click enter from keyboard in edition mode
    Then numbered paragraph 1 of article contains "Text..." in edition mode
    And  numbered paragraph 2 of article contains "New Text" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    When mouseover and click on article 1
    Then ck editor window is displayed
    When move the cursor position to offset 7 in paragraph 1 of article in edition mode
    And  click delete button from keyboard in edition mode
    Then numbered paragraph 1 of article contains "Text... New Text" in edition mode
    When click save and close button of ck editor
    Then drafting rule violations dialog box displayed with message "Articles with a single paragraph cannot be numbered."
    Then click dialog ok button
    When click at offset 8 of child 2 of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    When click save and close button of ck editor
    Then drafting rule violations dialog box displayed with message "Articles with a single paragraph cannot be numbered."
    Then click dialog ok button
    When append "New Text" at offset 0 in numbered paragraph 2 of article in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed

  @articleEditing @local
  Scenario: Addition of text and removal of text from article
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-clymts48h00018g73xyrc19ma-en.leg"
    Then active upload window label contains "Guidance approval"
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    Then below element lists are displayed in Elements menu
      | ElementList |
      | Citation    |
      | Recital     |
      | Part        |
      | Title       |
      | Chapter     |
      | Section     |
      | Article     |
    When drag element "Article" from element tree list and drop before node label "Article 2 - Definitions Text..." in navigation pane
    Then enacting terms contains node label "Article # - Article heading... Text..." and showing as bold
    And  wait for 1000 milliseconds
    When click on three vertical dots for the element contains text "Article # - Article heading... Text..." in toc
    And  click on delete option from eui dropdown content
    Then "Delete Element: confirmation" dialog confirm box window is displayed
    When click on ok button in dialog box window
    Then enacting terms doesn't contain new element in navigation pane
    When drag element "Article" from element tree list and drop before node label "Article 2 - Definitions Text..." in navigation pane
    Then enacting terms contains node label "Article # - Article heading... Text..." and showing as bold
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    When click on "Article 2 - Article heading... 1.Text..." link in navigation pane
    Then article 2 is displayed
    Then heading of article 2 contains "Article heading..."
    And  2 paragraphs are present in article 2
    When click on insert before icon of article 2
    Then heading of article 2 contains "Article heading..."
    And  2 paragraphs are present in article 2
    When click on "Article 2 - Article heading... 1.Text..." link in navigation pane
    Then article 2 is displayed
    When click on insert after icon of article 3
    Then heading of article 4 contains "Article heading..."
    And  2 paragraphs are present in article 4
    When mouseover and click on article 7
    Then ck editor window is displayed
    When select content from offset 65 till offset 75 in numbered paragraph 1 of article in edition mode
    And  click delete button from keyboard in edition mode
    When append " New Text " at offset 22 in numbered paragraph 1 of article in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of paragraph 1 of article 7 contains "New Text"
    And  paragraph 1 of article 7 doesn't contain "Directive"
    When click on save button in ribbon toolbar
    Then "Save this version" dialog box window is displayed
    When provide input "major version" dialog box window
    And  click on ok button in dialog box window
    And  click on versions pane accordion
    Then compare versions button is displayed in versions pane section
    And  search button is displayed in versions pane section
    And  navigation pane is minimized
    And  "No changes after last version" subtitle is displayed under recent changes version card
    And  app-versions-pane-group 2 contains card header title "Version 0.2.0 - major version"
    When click on navigation pane accordion
    When click on toc edit button
    And  drag node label "Article 1 - Scope 1. Text..." and drop before node label "Article 6 - Entry into force This Regulation" in navigation pane
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  enacting terms contains "Article 5 - Scope 1. Text..." at index 4 in navigation pane
    And  enacting terms contains "Article 6 - Entry into force This Regulation" at index 5 in navigation pane
    When mouseover and click on article 1
    And  click at offset 7 of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  add "point a" at current cursor position in edition mode
    And  click enter from keyboard in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  add "point i" at current cursor position in edition mode
    And  click at offset 0 of pTag 1 of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click backspace from keyboard in edition mode
    And  click on soft enter icon present in ck editor panel
    And  click on decrease indent icon present in ck editor panel
    And  click save and close button of ck editor
    Then ck editor window is not displayed

  @indentOutdent @paragraphMode @TabKeyInArticle @local
  Scenario: test indent and out-dent scenario inside article
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT_1383684831844402901.leg"
    Then active upload window label contains "Guidance approval"
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click on paragraph mode icon two times present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text" to li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc" to li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click at offset 162 in li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on soft enter icon present in ck editor panel
    And  p tag 1 of li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains "It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated " in edition mode
    And  p tag 2 of li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article contains "Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc" in edition mode
    And  click at offset 0 of p tag 1 of li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on decrease indent icon present in ck editor panel
    Then p tag 1 of li 2 with data-akn-element "paragraph" of article contains "It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated " in edition mode
    And  li 3 with data-akn-element "paragraph" of article contains "Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of paragraph 2 of article 1 contains "It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated"
    And  content of paragraph 3 of article 1 contains "Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc"
        #######################START /leos/core/issues/864 : List( Legal act )- Soft enter button is creating an issue when used after Wrapper subparagraph############################################
    When mouseover and click on article 6
    Then ck editor window is displayed
    When move the cursor position to offset 7 in paragraph 1 of article in edition mode
    And  click enter from keyboard in edition mode
    When append " New Text " at offset 0 in numbered paragraph 2 of article in edition mode
    When move the cursor position to offset 7 in paragraph 1 of article in edition mode
    And  click enter from keyboard in edition mode
    And  add content "Point a" to li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  click on add subparagraph icon present in ck editor panel
    And  add "wrapper subparagraph" at current cursor position in edition mode
    And  click on soft enter icon present in ck editor panel
    And  add "list sibling subparagraph" at current cursor position in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of subparagraph refersTo "~INP" of list 1 of paragraph 1 of article 6 contains "Text..."
    And  content of subparagraph refersTo "~WRP" of list 1 of paragraph 1 of article 6 contains "wrapper subparagraph"
    And  content of point 1 of list 1 of paragraph 1 of article 6 contains "Point a"
    And  content of subparagraph 1 of paragraph 1 of article 6 contains "list sibling subparagraph"
    When click on insert after icon of article 1
    Then article 2 is displayed
    When mouseover and click on article 2
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click enter from keyboard in edition mode
    When click on tab key from keyboard
    When click on tab key from keyboard
    When add "point a" at current cursor position in edition mode
    When click enter from keyboard in edition mode
    When click on tab key from keyboard
    When click on tab key from keyboard
    When add "point i" at current cursor position in edition mode
    When click enter from keyboard in edition mode
    When click on tab key from keyboard
    When click on tab key from keyboard
    When add "point 1" at current cursor position in edition mode
    When click enter from keyboard in edition mode
    When click on tab key from keyboard
    When click on tab key from keyboard
    When add "point -" at current cursor position in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of subparagraph 1 of list 1 of paragraph 1 of article 2 contains "Text..."
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of paragraph 1 of article 2 contains "point a"
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 2 contains "point i"
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 2 contains "point 1"
    And  content of indent 1 of list 1 of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 2 contains "point -"
    And  content of paragraph 2 of article 2 contains "Text..."
    When click on insert after icon of article 2
    Then article 2 is displayed
    When click on toc refresh icon
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When click on three vertical dots for the element contains text "Article 3" in toc
    When mouseover on change type category
    When click on definition option in change type category
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    Then heading of article 3 contains "Definitions"
    When mouseover and click on article 3
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click enter from keyboard in edition mode
    When click on tab key from keyboard
    When add "point 1" at current cursor position in edition mode
    When click enter from keyboard in edition mode
    When click on tab key from keyboard
    When click on tab key from keyboard
    When add "point a" at current cursor position in edition mode
    When click enter from keyboard in edition mode
    When click on tab key from keyboard
    When click on tab key from keyboard
    When add "point i" at current cursor position in edition mode
    When click enter from keyboard in edition mode
    When click on tab key from keyboard
    When add "point i subparagraph" at current cursor position in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of subparagraph 1 of list 1 of paragraph 1 of article 3 contains "Text..."
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of paragraph 1 of article 3 contains "point 1"
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 3 contains "point a"
    And  content of subparagraph 1 of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 3 contains "point i"
    And  content of subparagraph 2 of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 1 of article 3 contains "point i subparagraph"
    When click on insert after icon of article 3
    Then article 4 is displayed
    When mouseover and click on article 4
    Then ck editor window is displayed
    Then  li 1 with data-akn-element "paragraph" of article contains "Text..." in edition mode
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click enter from keyboard in edition mode
    And click on increase indent icon present in ck editor panel
    And click on increase indent icon present in ck editor panel
    And  add "point a" at current cursor position in edition mode
    And click enter from keyboard in edition mode
    And  add "sub point a" at current cursor position in edition mode
    And click on decrease indent icon present in ck editor panel
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And content of subparagraph 1 of list 1 of paragraph 1 of article 4 contains "Text..."
    And content of point 1 of list 1 of paragraph 1 of article 4 contains "point a"
    And content of subparagraph 2 of list 1 of paragraph 1 of article 4 contains "sub point a"

    # Ticket 2982
    When click on insert after icon of article 3
    Then article 4 is displayed
    When mouseover and click on article 4
    Then ck editor window is displayed
    Then  li 1 with data-akn-element "paragraph" of article contains "Text..." in edition mode
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click enter from keyboard in edition mode
    And click on increase indent icon present in ck editor panel
    And click on increase indent icon present in ck editor panel
    And  add "point a" at current cursor position in edition mode
    And click enter from keyboard in edition mode
    And  add "sub point a" at current cursor position in edition mode
    And click on decrease indent icon present in ck editor panel
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And content of subparagraph 1 of list 1 of paragraph 1 of article 4 contains "Text..."
    And content of point 1 of list 1 of paragraph 1 of article 4 contains "point a"
    And content of subparagraph 2 of list 1 of paragraph 1 of article 4 contains "sub point a"
    #Ticket 2990
    When click on insert after icon of article 4
    Then article 5 is displayed
    When mouseover and click on article 5
    Then ck editor window is displayed
    Then  li 1 with data-akn-element "paragraph" of article contains "Text..." in edition mode
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click enter from keyboard in edition mode
    And click on increase indent icon present in ck editor panel
    And click on increase indent icon present in ck editor panel
    And  add "point a" at current cursor position in edition mode
    And click enter from keyboard in edition mode
    And  add "point b" at current cursor position in edition mode
    And click enter from keyboard in edition mode
    And  add "point c" at current cursor position in edition mode
    And click enter from keyboard in edition mode
    And  add "point d" at current cursor position in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And content of subparagraph refersTo "~INP" of list 1 of paragraph 1 of article 5 contains "Text..."
    And content of point 1 of list 1 of paragraph 1 of article 5 contains "point a"
    And content of point 2 of list 1 of paragraph 1 of article 5 contains "point b"
    And content of point 3 of list 1 of paragraph 1 of article 5 contains "point c"
    And content of point 4 of list 1 of paragraph 1 of article 5 contains "point d"
#3039
    When mouseover and click on article 5
    Then ck editor window is displayed
    And  click at offset 7 in li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And click on decrease indent icon present in ck editor panel
    And click on decrease indent icon present in ck editor panel
    And click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of subparagraph refersTo "~INP" of list 1 of paragraph 1 of article 5 contains "Text..."
    And content of point 1 of list 1 of paragraph 1 of article 5 contains "point a"
    And  content of subparagraph refersTo "~INP" of list 1 of paragraph 2 of article 5 contains "point b"
    And content of point 1 of list 1 of paragraph 2 of article 5 contains "point c"
    And content of point 2 of list 1 of paragraph 2 of article 5 contains "point d"
    And mouseover and click on article 6
    Then ck editor window is displayed
    Then  li 1 with data-akn-element "paragraph" of article contains "This Regulation shall enter into force on the [...] day following that of its publication in the Official Journal of the European Union" in edition mode
    When click at offset 39 of child 1 of li 1 with data-akn-element "paragraph" of article in edition mode
    And click enter from keyboard in edition mode
    And click on increase indent icon present in ck editor panel
    And click on increase indent icon present in ck editor panel
    And  add "point a" at current cursor position in edition mode
    And click enter from keyboard in edition mode
    And  add "point b" at current cursor position in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And content of subparagraph refersTo "~INP" of list 1 of paragraph 1 of article 6 contains "This Regulation shall enter into force on the [...] day following that of its publication in the Official Journal of the European Union"
    And content of point 1 of list 1 of paragraph 1 of article 6 contains "point a"
    And content of point 2 of list 1 of paragraph 1 of article 6 contains "point b"

    When  mouseover and click on article 6
    Then ck editor window is displayed
    And  click at offset 7 in li 1 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And click on decrease indent icon present in ck editor panel
    And click save and close button of ck editor
    Then ck editor window is not displayed
    And content of paragraph 1 of article 6 contains "This Regulation shall enter into force on the [...] day following that of its publication in the Official Journal of the European Union"
    And content of subparagraph refersTo "~INP" of list 1 of paragraph 2 of article 6 contains "point a"
    And content of point 1 of list 1 of paragraph 2 of article 6 contains "point b"

  @definitionArticle @local
  Scenario: definition article should have maximum three depth
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation Testing Definition Article" in create document page
    And  click on create button
    Then user is on act viewer page
    And  title of the act contains "Automation Testing Definition Article" keyword
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    When click on insert after icon of article 1
    Then heading of article 2 contains "Article heading..."
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    Then paragraph mode icon is enabled in ck editor panel
    When click enter from keyboard in edition mode
    And  add content "paragraph2" to li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  add content "point a" to li 3 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "point b" to li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  add content "point i" to li 3 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "point ii" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  add content "point 1" to li 3 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "point 2" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  add content "point -" to li 3 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    Then increase indent icon is disabled in ck editor
    When click enter from keyboard in edition mode
    And  add content "point --" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    And  num tag of paragraph 1 of article 1 contains "1."
    And  content of paragraph 1 of article 1 contains "Text..."
    And  num tag of paragraph 2 of article 1 contains "2."
    And  content of subparagraph 1 of list 1 of paragraph 2 of article 1 contains "paragraph2"
    And  num tag of point 1 of list 1 of paragraph 2 of article 1 contains "(a)"
    And  content of point 1 of list 1 of paragraph 2 of article 1 contains "point a"
    And  num tag of point 2 of list 1 of paragraph 2 of article 1 contains "(b)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point b"
    And  num tag of point 1 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(i)"
    And  content of point 1 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point i"
    And  num tag of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(ii)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point ii"
    And  num tag of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(1)"
    And  content of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point 1"
    And  num tag of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(2)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point 2"
    And  num tag of indent 1 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "—"
    And  content of indent 1 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point -"
    And  num tag of indent 2 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "—"
    And  content of indent 2 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point --"
    When click on toc edit button
    And  click on three vertical dots for the element contains text "Article 1" in toc
    And  mouseover on change type category
    Then regular option is selected in change type category
    When click on definition option in change type category
    Then "Conversion not allowed!" dialog confirm box window is displayed
    And  dialog box body contains "Not allowed to convert article to DEFINITION, because the current depth of 4 is exceeding the maximum allowed depth level of 3."
    When click on close button in dialog confirm box window
    And  click on cancel button in navigation pane
    Then toc editing button is displayed and enabled
    When mouseover and click on article 1
    Then ck editor window is displayed
    When select content from offset 0 till offset 7 in li 1 with data-akn-element "indent" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click delete button from keyboard in edition mode
    And  click backspace from keyboard in edition mode
    And  select content from offset 0 till offset 8 in li 1 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click delete button from keyboard in edition mode
    And  click backspace from keyboard in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  num tag of paragraph 1 of article 1 contains "1."
    And  content of paragraph 1 of article 1 contains "Text..."
    And  num tag of paragraph 2 of article 1 contains "2."
    And  content of subparagraph 1 of list 1 of paragraph 2 of article 1 contains "paragraph2"
    And  num tag of point 1 of list 1 of paragraph 2 of article 1 contains "(a)"
    And  content of point 1 of list 1 of paragraph 2 of article 1 contains "point a"
    And  num tag of point 2 of list 1 of paragraph 2 of article 1 contains "(b)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point b"
    And  num tag of point 1 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(i)"
    And  content of point 1 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point i"
    And  num tag of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(ii)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point ii"
    And  num tag of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(1)"
    And  content of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point 1"
    And  num tag of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(2)"
    And  content of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point 2"
    And  article 1 doesn't contain indent tag
    When click on toc edit button
    And  click on three vertical dots for the element contains text "Article 1" in toc
    And  mouseover on change type category
    Then regular option is selected in change type category
    When click on definition option in change type category
    And  click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  heading of article 1 contains "Definitions"
    And  paragraph 1 of article 1 doesn't contain num tag
    And  content of paragraph 1 of article 1 contains "Text..."
    And  paragraph 2 of article 1 doesn't contain num tag
    And  content of subparagraph 1 of list 1 of paragraph 2 of article 1 contains "paragraph2"
    And  num tag of point 1 of list 1 of paragraph 2 of article 1 contains "(1)"
    And  content of point 1 of list 1 of paragraph 2 of article 1 contains "point a"
    And  num tag of point 2 of list 1 of paragraph 2 of article 1 contains "(2)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point b"
    And  num tag of point 1 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(a)"
    And  content of point 1 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point i"
    And  num tag of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(b)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point ii"
    And  num tag of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(i)"
    And  content of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point 1"
    And  num tag of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "(ii)"
    And  content of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point 2"
    And  paragraph 3 of article 1 doesn't contain num tag

    When mouseover and click on article 2
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on paragraph mode icon two times present in ck editor panel
    When click enter from keyboard in edition mode
    And  add content "point a" to li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "point b" to li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  add content "point i" to li 3 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "point ii" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  add content "point 1" to li 3 with data-akn-element "point" of li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "point 2" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    Then increase indent icon is displayed and enabled in ck editor panel
    And  decrease indent icon is displayed and enabled in ck editor panel
    When click save and close button of ck editor
    Then ck editor window is not displayed
    When click on toc edit button
    And  click on three vertical dots for the element contains text "Article 2" in toc
    And  mouseover on change type category
    Then regular option is selected in change type category
    When click on definition option in change type category
    And  click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  heading of article 2 contains "Definitions"
    And  paragraph 1 of article 2 doesn't contain num tag
    And  content of subparagraph 1 of list 1 of paragraph 1 of article 2 contains "Text..."
    And  num tag of point 1 of list 1 of paragraph 1 of article 2 contains "(1)"
    And  content of point 1 of list 1 of paragraph 1 of article 2 contains "point a"
    And  num tag of point 2 of list 1 of paragraph 1 of article 2 contains "(2)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of paragraph 1 of article 2 contains "point b"
    And  num tag of point 1 of list 1 of point 2 of list 1 of paragraph 1 of article 2 contains "(a)"
    And  content of point 1 of list 1 of point 2 of list 1 of paragraph 1 of article 2 contains "point i"
    And  num tag of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 2 contains "(b)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 2 contains "point ii"
    And  num tag of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 2 contains "(i)"
    And  content of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 2 contains "point 1"
    And  num tag of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 2 contains "(ii)"
    And  content of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 2 contains "point 2"
    When mouseover and click on article 2
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    Then paragraph mode icon is disabled in ck editor panel
    When click close button of ck editor
    Then ck editor window is not displayed
    When mouseover and click on article 3
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    Then paragraph mode icon is disabled in ck editor panel
    Then increase indent icon is disabled in ck editor
    And  decrease indent icon is disabled in ck editor panel
    When click enter from keyboard in edition mode
    And  add content "paragraph 2" to li 2 with data-akn-element "paragraph" of article in edition mode
    Then decrease indent icon is disabled in ck editor panel
    When click enter from keyboard in edition mode
    And  add content "point 1" to li 3 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    Then li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(1)" in edition mode
    When click enter from keyboard in edition mode
    And  add content "point 2" to li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    Then li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(2)" in edition mode
    When click enter from keyboard in edition mode
    And  add content "point a" to li 3 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    Then li 1 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(a)" in edition mode
    When click enter from keyboard in edition mode
    And  add content "point b" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    Then li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(b)" in edition mode
    When click enter from keyboard in edition mode
    And  add content "point i" to li 3 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    Then increase indent icon is disabled in ck editor
    And  li 1 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(i)" in edition mode
    When click enter from keyboard in edition mode
    And  add content "point ii" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    Then li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(ii)" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  article 3 doesn't contain indent tag
    When click on toc edit button
    And  click on three vertical dots for the element contains text "Article 3" in toc
    And  mouseover on change type category
    Then definition option is selected in change type category
    When click on regular option in change type category
    And  click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  article 3 doesn't contain indent tag
#        And  heading of article 3 contains "Article heading..."
    And  paragraph 1 of article 3 doesn't contain num tag
    And  content of paragraph 1 of article 3 contains "Text..."
    And  content of subparagraph 1 of list 1 of paragraph 2 of article 3 contains "paragraph 2"
    And  num tag of point 1 of list 1 of paragraph 2 of article 3 contains "(a)"
    And  content of point 1 of list 1 of paragraph 2 of article 3 contains "point 1"
    And  num tag of point 2 of list 1 of paragraph 2 of article 3 contains "(b)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of paragraph 2 of article 3 contains "point 2"
    And  num tag of point 1 of list 1 of point 2 of list 1 of paragraph 2 of article 3 contains "(i)"
    And  content of point 1 of list 1 of point 2 of list 1 of paragraph 2 of article 3 contains "point a"
    And  num tag of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 3 contains "(ii)"
    And  content of subparagraph 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 3 contains "point b"
    And  num tag of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 3 contains "(1)"
    And  content of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 3 contains "point i"
    And  num tag of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 3 contains "(2)"
    And  content of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 3 contains "point ii"
    When mouseover and click on article 3
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    Then paragraph mode icon is enabled in ck editor panel
    When click close button of ck editor
    Then ck editor window is not displayed

  @internalReference @local
  Scenario: test internal reference by uploading existing leg file
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT_1383684831844402901.leg"
    Then active upload window label contains "Guidance approval"
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    Then title of the act contains "Automation.....internal references....." keyword
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    When mouseover and click on citation 2
    Then ck editor window is displayed
    When click at offset 59 of child 0 of citation in edition mode
    And  click on internal reference icon present in ck editor panel
    Then cke dialog window is displayed with title "Internal reference"
    When click on "Article 3 - Subject matter and scope 1.In order..." link in enacting terms on the left side of internal reference window
    And  click on point 2 of list 1 of paragraph 3 of article on the right side of internal reference window
    And  click on ok button in cke dialog window
    And  click save and close button of ck editor
    Then "Article 3(3), point (b)" is added as internal reference 1 of citation 2
    When mouseover and click on recital 1
    Then ck editor window is displayed
    When click on internal reference icon present in ck editor panel
    Then cke dialog window is displayed with title "Internal reference"
    When click on "Article 11 - Monitoring and reporting 1.Member ..." link in enacting terms on the left side of internal reference window
    And  click on ok button in cke dialog window
    And  click save and close button of ck editor
    Then "Article 11" is added as internal reference 1 of recital 1
    When mouseover and click on recital 2
    Then ck editor window is displayed
    When click on internal reference icon present in ck editor panel
    Then cke dialog window is displayed with title "Internal reference"
    When click on "Article 9 - Additional measures 1.Member States..." link in enacting terms on the left side of internal reference window
    And  click on point 2 of list 1 of paragraph 1 of article on the right side of internal reference window
    And  click on ok button in cke dialog window
    And  click save and close button of ck editor
    Then "Article 9(1), point (b)" is added as internal reference 1 of recital 2
    When mouseover and click on article 4
    Then ck editor window is displayed
    When click at offset 0 in li 1 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    When click on internal reference icon present in ck editor panel
    Then cke dialog window is displayed with title "Internal reference"
    When click on "Having regard to the proposal from the European..." link in citations on the left side of internal reference window
    And  click on ok button in cke dialog window
    And  click save and close button of ck editor
    Then "second citation" is added as internal reference 1 of point 1 of list 1 of paragraph 1 of article 4
    When mouseover and click on article 4
    Then ck editor window is displayed
    When click at offset 0 in li 8 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on internal reference icon present in ck editor panel
    Then cke dialog window is displayed with title "Internal reference"
    When click on "(1) Recital...Article 11" link in recitals on the left side of internal reference window
    And  click on ok button in cke dialog window
    And  click save and close button of ck editor
    Then "Recital (1)" is added as internal reference 1 of point 8 of list 1 of paragraph 1 of article 4
    When mouseover and click on article 8
    Then ck editor window is displayed
    When move the cursor position to offset 7 in paragraph 1 of article in edition mode
    And  click enter from keyboard in edition mode
    When append " New Text " at offset 0 in numbered paragraph 2 of article in edition mode
    When move the cursor position to offset 7 in paragraph 1 of article in edition mode
    And  click on internal reference icon present in ck editor panel
    Then cke dialog window is displayed with title "Internal reference"
    When click on "Article 11 - Monitoring and reporting 1.Member ..." link in enacting terms on the left side of internal reference window
    And  click on paragraph 2 of article on the right side of internal reference window
    And  click on ok button in cke dialog window
    And  click save and close button of ck editor
    Then "Article 11(2)" is added as internal reference 1 of paragraph 1 of article 8
    When click on internal reference link 1 of citation 2
    Then point 2 of list 1 of paragraph 3 of article 3 is displayed
    When click on right angle icon of preamble link
    When click on "(1) Recital..." link in navigation pane
    Then recital 1 is displayed
    When click on internal reference link 1 of recital 1
    Then article 11 is displayed
    When click on "(2) Recital..." link in navigation pane
    Then recital 2 is displayed
    When click on internal reference link 1 of recital 2
    Then point 2 of list 1 of paragraph 1 of article 9 is displayed
    When click on "Article 4 - Definitions For the purposes of this Directive" link in navigation pane
    Then article 4 is displayed
    When click on internal reference link 1 of point 1 of list 1 of paragraph 1 of article 4
    Then citation 2 is displayed
    When click on "Article 4 - Definitions For the purposes of this Directive" link in navigation pane
    Then article 4 is displayed
    When click on internal reference link 1 of point 8 of list 1 of paragraph 1 of article 4
    Then recital 1 is displayed
    When click on "Article 8 - Article heading... 1.Text..." link in navigation pane
    Then article 8 is displayed
    When click on internal reference link 1 of paragraph 1 of article 8
    Then paragraph 2 of article 11 is displayed

  @importOfficeJournal @local
  Scenario: import from office journal
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation import OJ Testing" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    When click on import from oj button in ribbon toolbar
    Then "Import from the Official Journal of the European Union" dialog box window is displayed
    And  close button in import office journal window is displayed and enabled
    And  select all recitals button is disabled
    And  select all enacting items button is disabled
    And  "REGULATION" option is selected by default for type field
    And  current year is selected by default for year field
    And  blank input box is present for Nr. field
    When click on type field
    And  below options are displayed in type dropdown
      | TypeOptions |
      | REGULATION  |
      | DIRECTIVE   |
      | DECISION    |
    When click on search button in import office journal window
    Then exclamation mark is appeared with "rgb(48, 48, 48)" color
    When select option "DIRECTIVE" for type field
    And  select option "2016" for year field
    And  provide value "2102" in Nr. field
    And  click on search button in import office journal window
    Then bill content is appeared in import office journal window
    And  select all recitals button is enabled
    And  select all enacting items button is enabled
    When click on checkbox of recital 1
    When click on checkbox of recital 2
    When click on checkbox of recital 3
    When click on checkbox of article 1
    When click on checkbox of article 2
    When click on checkbox of article 3
    When click on import button
    Then 3 recitals are added in legal act by import oj
    Then 3 articles are added in legal act by import oj
    When click on import from oj button in ribbon toolbar
    Then "Import from the Official Journal of the European Union" dialog box window is displayed
    When select option "REGULATION" for type field
    And  select option "2014" for year field
    And  provide value "9999" in Nr. field
    And  click on search button in import office journal window
    Then warning message contains "Search returned with no result! Please modify the search parameters"
    When select option "REGULATION" for type field
    And  select option "2013" for year field
    And  provide value "1303" in Nr. field
    And  click on search button in import office journal window
    Then bill content is appeared in import office journal window
    When click on select all recitals button in import office journal window
    Then checkboxes of all the recitals are selected
    And  number of recitals selected is 130
    When click on import button
    Then 133 recitals are added in legal act by import oj
    When click on import from oj button in ribbon toolbar
    Then "Import from the Official Journal of the European Union" dialog box window is displayed
    When select option "REGULATION" for type field
    And  select option "2013" for year field
    And  provide value "1303" in Nr. field
    And  click on search button in import office journal window
    Then bill content is appeared in import office journal window
    When click on select all enacting items button in import office journal window
    Then checkboxes of all the articles are selected
    And  number of articles selected is 154
    And  checkboxes of all the parts are selected
    And  number of parts selected is 5
    And  checkboxes of all the titles are selected
    And  number of titles selected is 17
    And  checkboxes of all the chapters are selected
    And  number of chapters selected is 33
    And  checkboxes of all the sections are selected
    And  number of sections selected is 7
    When click on import button
    Then 5 parts are added in legal act by import oj
    And  17 titles are added in legal act by import oj
    And  33 chapters are added in legal act by import oj
    And  7 sections are added in legal act by import oj
    And  157 articles are added in legal act by import oj
    When click on import from oj button in ribbon toolbar
    Then "Import from the Official Journal of the European Union" dialog box window is displayed
    When select option "REGULATION" for type field
    And  select option "2013" for year field
    And  provide value "1303" in Nr. field
    And  click on search button in import office journal window
    When click on checkbox of higher division part 2
    Then number of articles selected is 85
    And  number of parts selected is 1
    And  number of titles selected is 9
    And  number of chapters selected is 18
    And  number of sections selected is 2
    When click on import button
    Then 6 parts are added in legal act by import oj
    And  26 titles are added in legal act by import oj
    And  51 chapters are added in legal act by import oj
    And  9 sections are added in legal act by import oj
    And  242 articles are added in legal act by import oj
    When click on versions pane accordion
    When click on show more button in "Recent changes" eui-card
    Then title of last 4 minor versions from recent changes eui-card contains "Import element(s) inserted"

  @numberedToUnnumbered @local
  Scenario: changing article from numbered to unnumbered with List creates an empty paragraph
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation Article Testing" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  toc editing button is displayed and enabled
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click enter from keyboard in edition mode
    And  add content "line 1" to li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on increase indent icon present in ck editor panel
    And  click on increase indent icon present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "line 2" to li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of subparagraph 1 of list 1 of paragraph 1 of article 1 contains "Text..."
    And  content of point 1 of list 1 of paragraph 1 of article 1 contains "line 1"
    And  content of point 2 of list 1 of paragraph 1 of article 1 contains "line 2"
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 0 in li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on decrease indent icon present in ck editor panel
    And  click on decrease indent icon present in ck editor panel
    Then decrease indent icon is disabled in ck editor panel
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of subparagraph 1 of list 1 of paragraph 1 of article 1 contains "Text..."
    And  content of point 1 of list 1 of paragraph 1 of article 1 contains "line 1"
    And  content of paragraph 2 of article 1 contains "line 2"
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 0 of li 2 with data-akn-element "paragraph" of article in edition mode
    Then decrease indent icon is disabled in ck editor panel
    When click on paragraph mode icon present in ck editor panel
    Then "data-akn-num" attribute is not present in li 1 with data-akn-element "paragraph" of article in edition mode
    And  "data-akn-num" attribute is not present in li 2 with data-akn-element "paragraph" of article in edition mode
    When mouseover and click on article 3
    Then content of subparagraph 1 of list 1 of paragraph 1 of article 1 contains "Text..."
    And  content of point 1 of list 1 of paragraph 1 of article 1 contains "line 1"
    And  content of paragraph 2 of article 1 contains "line 2"
    And  paragraph 1 of article 1 doesn't contain num tag
    And  paragraph 2 of article 1 doesn't contain num tag
    When click close button of ck editor
    Then ck editor window is not displayed

  @checksForStory1703And2060And2208 @local
  Scenario: Checks related to specific stories: 1703, 2060 and 2208. Tests for alternatives and some track changes related to paragraph mode
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-cm65ct0qm005tzg88xg9uph7b-en.leg"
    Then active upload window label contains "Guidance approval"
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    When mouseover and click on article 3
    Then ck editor window is displayed
    When click on alternative2 icon present in ck editor panel
    And  click dialog ok button
    Then check content inside ckeditor is of size 2925
    When mouseover and click on article 3
    Then ck editor window is displayed
    When append "Text" at offset 7 in numbered paragraph 1 of article in edition mode
    Then alternative 1 and alternative 2 are present
    When click save and close button of ck editor
    Then ck editor window is not displayed
    Then enable track changes
    When mouseover and click on article 5
    Then ck editor window is displayed
    When click on alternative2 icon present in ck editor panel
    And click dialog ok button
    Then check content inside ckeditor is greater than 100
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And num tag of paragraph 1 of article 5 should not exist
    And num tag of paragraph 2 of article 5 should not exist
    When mouseover and click on article 1
    Then ck editor window is displayed
    Then move the cursor position to offset 0 in paragraph 1 of article in edition mode
    Then click on paragraph mode icon two times present in ck editor panel
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of paragraph 1 of article 1 contains value "1."
    And  del tag with attribute "leos\:action-number" and value "delete" of num tag of paragraph 2 of article 1 contains value "2."
    When mouseover and click on article 1
    Then ck editor window is displayed
    And  move the cursor position to offset 0 in paragraph 1 of article in edition mode
    When click on paragraph mode icon present in ck editor panel
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    And num tag of paragraph 1 of article 1 does not contain html '<del id=".*" leos:action-number="delete" leos:title="DOE Jane'
    And num tag of paragraph 1 of article 1 does not contain html '</del>'
    And num tag of paragraph 1 of article 1 contains html '1.'
    And num tag of paragraph 2 of article 1 does not contain html '<del id=".*" leos:action-number="delete" leos:title="DOE Jane'
    And num tag of paragraph 2 of article 1 does not contain html '</del>'
    And num tag of paragraph 2 of article 1 contains html '2.'
    When mouseover and click on article 6
    Then ck editor window is displayed
    And add content "test" to li 1 with data-akn-element "paragraph" of article in edition mode
    And content inside ckeditor contains 'data-akn-tc-original-number="UNNUMBERED"'
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And num tag of paragraph 1 of article 6 should not exist
    And num tag of paragraph 2 of article 6 should not exist

  @versionPane @archiveFunctionality @local
  Scenario: VersionPane Archive functionality
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation Article Testing" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click enter from keyboard in edition mode
    And  add content "line 1" to li 2 with data-akn-element "paragraph" of article in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    When click on versions pane accordion
    And  title of last 1 minor versions from recent changes eui-card contains "Article 1 updated"
    When click on three vertical dots of eui-card containing "Article 1 updated" with index 0 in version pane
    Then only below options are displayed in dropdown content
      | dropdownContent     |
      | Export this version |
    When click on insert after icon of article 1
    Then heading of article 2 contains "Article heading..."
    And  title of last 1 minor versions from recent changes eui-card contains " inserted"
    And  click on show more button in "Recent changes" eui-card
    When click on three vertical dots of eui-card containing "Article 1 updated" with index 1 in version pane
    Then only below options are displayed in dropdown content
      | dropdownContent        |
      | View this version      |
      | Revert to this version |
      | Export this version    |
      | Archive this version   |
    When click on archive this version
    Then "Archive Version" dialog box window is displayed
    And  click on archive button
    Then subversion of recent changes version card doesn't contain "Article 1 updated"

  # Ticket LEOS#2446 : Error with functionality 'Add Subparagraph' in article edition
  @addSubParagraph @local
  Scenario: test add subparagraph functionality for first subparagraph inside article
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation test add subparagraph plugin for article" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on add subparagraph icon present in ck editor panel
    And  add "subparagraph 1" at current cursor position in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of subparagraph 1 of paragraph 1 of article 1 contains "Text..."
    And  content of subparagraph 2 of paragraph 1 of article 1 contains "subparagraph 1"
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 7 of pTag 1 with data-akn-element "subparagraph" of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click on add subparagraph icon present in ck editor panel
    And  add "subparagraph 2" at current cursor position in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of subparagraph 1 of paragraph 1 of article 1 contains "Text..."
    And  content of subparagraph 2 of paragraph 1 of article 1 contains "subparagraph 2"
    And  content of subparagraph 3 of paragraph 1 of article 1 contains "subparagraph 1"

  @searchAndReplaceLimitNumbers @local
  Scenario: search and limit numbers and replace search word
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation search and replace testing" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  search button is displayed in ribbon toolbar
    When click search button in ribbon toolbar
    Then document search bar is displayed
    When put keyword "the" in document search input box
    Then search result is showing "1 of 17"
    Then total occurrences of keyword "the" is "17"
    When click on the replace button from search bar
    Then document replace bar is displayed
    When put keyword "that" in replace document search input box
    When click on replace all button from document replace bar
    Then "Replace all text" dialog box window is displayed
    When click on ok button in dialog box window
    And  click on save and close button from search bar
    And  click search button in ribbon toolbar
    Then document search bar is displayed
    When put keyword "the" in document search input box
    Then total occurrences of keyword "the" is "0"
    And  search result is showing "Not Found"
    When put keyword "regard" in document search input box
    Then search result is showing "1 of 4"
    And  number of focus search result is 1
    And  number of other search results are 3
    When click next button in document search bar
    Then search result is showing "2 of 4"
    When click next button in document search bar
    Then search result is showing "3 of 4"
    When click previous button in document search bar
    Then search result is showing "2 of 4"
    When click on cancel button in document search bar
    Then document search bar is not present

  @multiDragAndDrop @higherDivisionValidation @local
  Scenario: user is able to drag and drop multiple element with same type
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation multi drag and drop testing" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    When click on insert after icon of article 3
    Then total article count is 4
    And  toc refresh icon is visible
    When click on toc refresh icon
    Then toc refresh icon is not visible
    And  enacting terms contains node label "Article 4 - Article heading... 1.Text..."
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When click on ngContent "Article 1 - Scope 1. Text..." from navigation pane
    And  click on ngContent "Article 3 - Entry into force This Regulation shall enter into force on" from navigation pane along with control button from keyboard
    And  drag node label "Article 1 - Scope 1. Text..." and drop to node label "Article 4 - Article heading... 1.Text..." in navigation pane
    And  wait for 5000 milliseconds
    And  enacting terms contains below node labels in this order
      | nodeLabel                                                                                                                                                             |
      | Article 2 - Definitions Text...                                                                                                                                       |
      | Article 4 - Article heading... 1.Text...                                                                                                                              |
      | Article 1 - Scope 1. Text...                                                                                                                                          |
      | Article 3 - Entry into force This Regulation shall enter into force on the [...] day following that of its publication in the Official Journal of the European Union. |
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  enacting terms contains below node labels in this order
      | nodeLabel                                                                                                                                                             |
      | Article 1 - Definitions Text...                                                                                                                                       |
      | Article 2 - Article heading... 1.Text...                                                                                                                              |
      | Article 3 - Scope 1. Text...                                                                                                                                          |
      | Article 4 - Entry into force This Regulation shall enter into force on the [...] day following that of its publication in the Official Journal of the European Union. |
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    When drag element "Chapter" from element tree list and drop before node label "Article 1 - Definitions Text..." in navigation pane
    Then success message "Chapter has been added successfully!" is displayed in navigation pane
    And  success message disappears from table of content
    And  ngContent "Chapter # Chapter heading..." is showing as bold in toc
    When drag element "Section" from element tree list and drop before node label "Article 1 - Definitions Text..." in navigation pane
    Then ngContent "Section # Section heading..." is showing as bold in toc
    And  warning symbol is displayed in navigation pane
    And  below warning message is displayed in navigation pane
      | warning                                                                                                |
      | Higher divisions have a hierarchy, cannot place two hierarchically different element at the same level |
      | A higher division must contain at least one sub-element                                                |
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  warning symbol is displayed in navigation pane
    And  below warning message is displayed in navigation pane
      | warning                                                                                                |
      | Higher divisions have a hierarchy, cannot place two hierarchically different element at the same level |
      | A higher division must contain at least one sub-element                                                |
      | A lower division cannot exist outside a higher division element                                        |
    When click on toc edit button
    And  click on ngContent "Section 1 Section heading..." from navigation pane along with control button from keyboard
    And  click on ngContent "Article 1 - Definitions Text..." from navigation pane along with control button from keyboard
    Then below warning message is displayed in navigation pane
      | warning                                                                                                |
      | Higher divisions have a hierarchy, cannot place two hierarchically different element at the same level |
      | A higher division must contain at least one sub-element                                                |
      | A lower division cannot exist outside a higher division element                                        |
      | Only elements of the same type can be selected together.                                               |
    When click on cancel button in navigation pane
    Then toc editing button is displayed and enabled
    And  wait for 5000 milliseconds
    And  below warning message is displayed in navigation pane
      | warning                                                                                                |
      | Higher divisions have a hierarchy, cannot place two hierarchically different element at the same level |
      | A higher division must contain at least one sub-element                                                |
      | A lower division cannot exist outside a higher division element                                        |
    When click on toc edit button
    When click on ngContent "Article 1 - Definitions Text..." from navigation pane
    And  click on ngContent "Article 2 - Article heading... 1.Text..." from navigation pane along with control button from keyboard
    And  drag node label "Article 1 - Definitions Text..." and drop to node label "Section 1 Section heading..." in navigation pane
    And  wait for 5000 milliseconds
    Then below warning message is displayed in navigation pane
      | warning                                                                                                |
      | Higher divisions have a hierarchy, cannot place two hierarchically different element at the same level |
      | A higher division must contain at least one sub-element                                                |
    And  node label "Section 1 Section heading..." contains node label "Article 1 -"
    And  node label "Section 1 Section heading..." contains node label "Article 2 -"
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  below warning message is displayed in navigation pane
      | warning                                                                                                |
      | Higher divisions have a hierarchy, cannot place two hierarchically different element at the same level |
      | A higher division must contain at least one sub-element                                                |
      | A lower division cannot exist outside a higher division element                                        |
    And  node label "Section 1 - Section heading..." contains node label "Article 1 -"
    And  node label "Section 1 - Section heading..." contains node label "Article 2 -"

  @switchingAlternativeClause @local
  Scenario: user is able to switch alternative article
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation Testing Alternative clause" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  content of clause 1 is "This Regulation shall be binding in its entirety and directly applicable in all Member States."
    When mouseover and click on clause 1
    Then ck editor window is displayed
    Then the clause inside ck editor is not editable and contains attribute "contenteditable" with value "false"
    When alternative1 is selected in ck editor panel
    And  click on alternative2 icon present in ck editor panel
    Then cke dialog window is displayed with title "Confirm alternative change"
    And  cke dialog window is displayed with body "If any changes were made to the default content, selecting an alternative will discard them. Are you sure to continue?"
    When click on ok button in cke dialog window
    Then content of clause is "This Regulation shall be binding in its entirety and directly applicable in the Member States in accordance with the Treaties." in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of clause 1 is "This Regulation shall be binding in its entirety and directly applicable in the Member States in accordance with the Treaties."
    When mouseover and click on clause 1
    Then ck editor window is displayed
    Then the clause inside ck editor is not editable and contains attribute "contenteditable" with value "false"
    When alternative2 is selected in ck editor panel
    And  click on alternative1 icon present in ck editor panel
    Then cke dialog window is displayed with title "Confirm alternative change"
    And  cke dialog window is displayed with body "If any changes were made to the default content, selecting an alternative will discard them. Are you sure to continue?"
    When click on ok button in cke dialog window
    Then content of clause is "This Regulation shall be binding in its entirety and directly applicable in all Member States." in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of clause 1 is "This Regulation shall be binding in its entirety and directly applicable in all Member States."


  @switchingAlternativeArticleAndSignature @local
  Scenario: user is able to switch alternative article/Signature and unable to edit article content and Heading
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-007" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation Testing Alternative Article and Alternative Signature" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And heading of article 3 contains "Article heading..."
    And content of subparagraph 1 of paragraph 1 of article 2 contains "Member States shall bring into force the laws, regulations and administrative provisions necessary to comply with this Directive by [...] at the latest. They shall forthwith communicate to the Commission the text of those provisions."
    And content of subparagraph 2 of paragraph 1 of article 2 contains "When Member States adopt those provisions, they shall contain a reference to this Directive or be accompanied by such a reference on the occasion of their official publication. Member States shall determine how such reference is to be made."
    And  content of paragraph 2 of article 2 contains "Member States shall communicate to the Commission the text of the main provisions of national law which they adopt in the field covered by this Directive."
    When mouseover and click on article 2
    Then ck editor window is displayed
    And the article inside ck editor is not editable and contains attribute "contenteditable" with value "false"
    And alternative1 is selected in ck editor panel
    When click on alternative2 icon present in ck editor panel
    Then cke dialog window is displayed with title "Confirm alternative change"
    And  cke dialog window is displayed with body "If any changes were made to the default content, selecting an alternative will discard them. Are you sure to continue?"
    When click on ok button in cke dialog window
    And click save and close button of ck editor
    Then ck editor window is not displayed
    And content of subparagraph 1 of paragraph 1 of article 2 contains "Member States shall adopt and publish, by [...] at the latest, the laws, regulations and administrative provisions necessary to comply with this Directive. They shall forthwith communicate to the Commission the text of those provisions."
    And content of subparagraph 2 of paragraph 1 of article 2 contains "They shall apply those provisions from [...]."
    And content of subparagraph 3 of paragraph 1 of article 2 contains "When Member States adopt those provisions, they shall contain a reference to this Directive or be accompanied by such a reference on the occasion of their official publication. Member States shall determine how such reference is to be made."
    And  content of paragraph 2 of article 2 contains "Member States shall communicate to the Commission the text of the main provisions of national law which they adopt in the field covered by this Directive."
    When mouseover and click on article 2
    Then ck editor window is displayed
    And the article inside ck editor is not editable and contains attribute "contenteditable" with value "false"
    When click close button of ck editor
    Then ck editor window is not displayed
  # Alternative Signature
    And  block 1 contains the signature organisation 1 contains text "For the Commission"
    And block 1 contains the  role 1 contains text "The President"
    And block 1 contains the signature of the person 1 contains "[...]"
    When mouseover and click on block 1
    Then ck editor window is displayed
    And the block inside ck editor is not editable and contains attribute "contenteditable" with value "false"
    When click on alternative icon present in ck editor panel
    Then Alternative dropdown displays the following options:
      | The President              |
      | On behalf of the President |
    When click on role from the dropdown button which contains text "On behalf of the President"
    Then cke dialog window is displayed with title "Confirm alternative change"
    And  cke dialog window is displayed with body "If any changes were made to the default content, selecting an alternative will discard them. Are you sure to continue?"
    When click on ok button in cke dialog window
    And click save and close button of ck editor
    Then ck editor window is not displayed
    And  block 1 contains the signature organisation 1 contains text "For the Commission"
    And block 1 contains the  role 1 contains text "On behalf of the President"
    And block 1 contains the signature of the person 1 contains "[...]"
    When mouseover and click on block 1
    Then ck editor window is displayed
    And the block inside ck editor is not editable and contains attribute "contenteditable" with value "false"
    When click close button of ck editor
    Then ck editor window is not displayed

  @validationOfRecitalSectionInAutonomousAct @local
  Scenario: Recital section in autonomous act
    Given navigate to leos application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-003" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "Automation Testing for recital Section in Autonomous act" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    When click on toc edit button
    Then cancel button is displayed and enabled in navigation pane
    Then below element lists are displayed in Elements menu
      | ElementList     |
      | Citation        |
      | Recital section |
      | Recital         |
      | Part            |
      | Title           |
      | Chapter         |
      | Section         |
      | Article         |
    When click on right angle icon of preamble link
    And drag element "Recital section" from element tree list and drop before node label "(1) Recital..." in navigation pane
    And  click on save button in navigation pane
    And  below warning message is displayed in navigation pane
      | warning                                                                                                |
      | A recital section must contain at least one recital element |

    #second scenerio Add recital inside recital section
    When click on cancel button in navigation pane
    And  click on toc edit button
    And click on three vertical dots for the element contains text "(1) Recital..." in toc
    And click on move option from dropdown content
    And  click on three vertical dots for the element contains text "Recitals 1. Recital Section Heading" in toc
    And click on place as child option from dropdown content
    And  click on save and close button in navigation pane
    Then no warning symbol should be displayed in the navigation pane

    #Third scenerio # Delete Recital Section with recitals inside
    Then total recital count is 2
    And recital section count is 1
    And recital section 1 contains "num" tag with value "1."
    And  recital section 1 contains "heading" tag with value "Recital Section Heading"
    When click on toc edit button
    And click on three vertical dots for the element contains text "Recitals 1. Recital Section Heading" in toc
    And click on delete option from eui dropdown content
    Then "Delete Element: confirmation" dialog confirm box window is displayed
    When click on ok button in dialog box window
    Then "Delete item confirmation" dialog confirm box window is displayed
    When click on delete button in dialog box window
    And click on save and close button in navigation pane
    Then total recital count is 1
    And recital section count is 0





