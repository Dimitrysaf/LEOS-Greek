#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in legal act in drafting instance

@LegalActScenarios
Feature: Legal Act Page Regression Features

    @citation_recital_editing @local
    Scenario: Add and removal of text in citation and recital element in legal Act
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on create proposal button
        Then user is on create new legislative document window
        And  collapse all button is displayed in create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation testing citation and recital scenarios" in create document page
        And  click on create button
        Then user is on proposal viewer page
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is displayed
        And  toc editing button is displayed and enabled
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
        Then user is on proposal viewer page
        When click on close button on proposal viewer page
        Then user is on repository browser page

    @splittingParagraphInArticle @local
    Scenario: append text in existing paragraph and make same paragraph into two inside article
        Given navigate to edit drafting application with "User1"
        Then user is on home page
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
        Then user is on proposal viewer page

    @articleWithSingleNumberedParagraph @local
    Scenario: Article with single paragraph cannot be numbered
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on upload button
        Then active upload window label contains "Upload a legislative document"
        When upload a leg file from a relative location "PROP_ACT-3210011215583606762-EN.leg"
        Then active upload window label contains "Document metadata"
        And  document title input field is displayed
        When click on create button in upload document page
        Then user is on proposal viewer page
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is displayed
        When mouseover and click on article 1
        Then ck editor window is displayed
        When append " New Text " at offset 7 in numbered paragraph 1 of article in edition mode
        Then numbered paragraph 1 of article contains "Text... New Text" in edition mode
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
        When move the cursor position to offset 7 in paragraph 1 of article in edition mode
        And  click enter from keyboard in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed

    @articleEditing @local
    Scenario: Addition of text and removal of text from article
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
        When click on save and close button in navigation pane
        Then toc editing button is displayed and enabled
        And  enacting terms contains node label "Article 2 - Article heading... 1.Text..."
        When click on "Article 2 - Article heading... 1.Text..." link in navigation pane
        Then article 2 is displayed
        Then heading of article 2 contains "Article heading..."
        And  2 paragraphs are present in article 2
        When click on insert before icon of article 2
        Then heading of article 2 contains "Article heading..."
        And  2 paragraphs are present in article 2
        When click on "Article 3 - Article heading... 1.Text..." link in navigation pane
        Then article 3 is displayed
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

    @indentOutdent @paragraphMode @local
    Scenario: test indent and out-dent scenario inside article
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on upload button
        Then active upload window label contains "Upload a legislative document"
        When upload a leg file from a relative location "PROP_ACT_1383684831844402901.leg"
        Then active upload window label contains "Document metadata"
        And  document title input field is displayed
        When click on create button in upload document page
        Then user is on proposal viewer page
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is displayed
        And  toc editing button is displayed and enabled
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
        When click on paragraph mode icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add content "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text" to li 2 with data-akn-element "paragraph" of article in edition mode
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
        And  p tag 1 of li 3 with data-akn-element "paragraph" of article contains "Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc" in edition mode
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
        And  click on add subparagraph icon present in ck editor panel
        And  add "wrapper subparagraph" at current cursor position in edition mode
        And  click on soft enter icon present in ck editor panel
        And  add "list sibling subparagraph" at current cursor position in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  content of subparagraph refersTo "~_INP" of list 1 of paragraph 1 of article 6 contains "Text..."
        And  content of subparagraph refersTo "~_WRP" of list 1 of paragraph 1 of article 6 contains "wrapper subparagraph"
        And  content of point 1 of list 1 of paragraph 1 of article 6 contains "Point a"
        And  content of subparagraph 1 of paragraph 1 of article 6 contains "list sibling subparagraph"

#    @leosCore210211 @local
#    Scenario: changing article from numbered to unnumbered with List creates an empty paragraph
#        Given navigate to edit drafting application with "User1"
#        Then user is on home page
#        When click on create proposal button
#        Then user is on create new legislative document window
#        When click on template "SJ-023" in create new legislative document window
#        When click on next button in create document page
#        And  provide document title "Automation Article Testing" in create document page
#        And  click on create button
#        Then user is on proposal viewer page
#        When click on legal act link present in proposal viewer page
#        Then user is on legal act page
#        And  annotation side bar is present
#        And  ribbon toolbar is displayed
#        And  toc editing button is displayed and enabled
#        When mousehover and click on article 1
#        Then ck editor window is displayed
#        When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
#        When click enter from keyboard in edition mode
#        And  add content "line 1" to li 2 with data-akn-element "paragraph" of article in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  click enter from keyboard in edition mode
#        And  add content "line 2" to li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
#        When click save and close button of ck editor
#        Then ck editor window is not displayed
#        And  content of subparagraph 1 of list 1 of paragraph 1 of article 1 contains "Text..."
#        And  content of point 1 of list 1 of paragraph 1 of article 1 contains "line 1"
#        And  content of point 2 of list 1 of paragraph 1 of article 1 contains "line 2"
#        When mousehover and click on article 1
#        Then ck editor window is displayed
#        When click at offset 0 in li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
#        And  click on decrease indent icon present in ck editor panel
#        Then decrease indent icon is disabled in ck editor panel
#        When click save and close button of ck editor
#        Then ck editor window is not displayed
#        And  content of subparagraph 1 of list 1 of paragraph 1 of article 1 contains "Text..."
#        And  content of point 1 of list 1 of paragraph 1 of article 1 contains "line 1"
#        And  content of paragraph 2 of article 1 contains "line 2"
#        When mousehover and click on article 1
#        Then ck editor window is displayed
#        When click at offset 0 of li 2 with data-akn-element "paragraph" of article in edition mode
#        Then decrease indent icon is disabled in ck editor panel
#        When click on paragraph mode icon present in ck editor panel
#        Then "data-akn-num" attribute is not present in li 1 with data-akn-element "paragraph" of article in edition mode
#        And  "data-akn-num" attribute is not present in li 2 with data-akn-element "paragraph" of article in edition mode
#        When click save and close button of ck editor
#        Then ck editor window is not displayed
#        And  content of subparagraph 1 of list 1 of paragraph 1 of article 1 contains "Text..."
#        And  content of point 1 of list 1 of paragraph 1 of article 1 contains "line 1"
#        And  content of paragraph 2 of article 1 contains "line 2"
#        And  paragraph 1 of article 1 doesnot contain num tag
#        And  paragraph 2 of article 1 doesnot contain num tag

    @definitionArticle @local
    Scenario: definition article should have maximum three depth
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on create proposal button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation Testing Definition Article" in create document page
        And  click on create button
        Then user is on proposal viewer page
        And  title of the proposal contains "Automation Testing Definition Article" keyword
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        And  annotation side bar is present
        When click on insert after icon of article 1
        Then heading of article 2 contains "Article heading..."
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
        When click enter from keyboard in edition mode
        And  add content "paragraph2" to li 2 with data-akn-element "paragraph" of article in edition mode
        And  click enter from keyboard in edition mode
        And  add content "point a" to li 3 with data-akn-element "paragraph" of article in edition mode
        And  click on increase indent icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add content "point b" to li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
        And  click enter from keyboard in edition mode
        And  add content "point i" to li 3 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
        And  click on increase indent icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add content "point ii" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
        And  click enter from keyboard in edition mode
        And  add content "point 1" to li 3 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
        And  click on increase indent icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add content "point 2" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
        And  click enter from keyboard in edition mode
        And  add content "point -" to li 3 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
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
        And  num tag of indent 1 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "-"
        And  content of indent 1 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "point -"
        And  num tag of indent 2 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 2 of article 1 contains "-"
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
        When mouseover and click on article 2
        Then ck editor window is displayed
        When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
        And  click on paragraph mode icon present in ck editor panel
        When click enter from keyboard in edition mode
        And  add content "point a" to li 2 with data-akn-element "paragraph" of article in edition mode
        And  click on increase indent icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add content "point b" to li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
        And  click enter from keyboard in edition mode
        And  add content "point i" to li 3 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
        And  click on increase indent icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add content "point ii" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
        And  click enter from keyboard in edition mode
        And  add content "point 1" to li 3 with data-akn-element "point" of li 2 with data-akn-element "point" of li 1 with data-akn-element "paragraph" of article in edition mode
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
        When mouseover and click on article 3
        Then ck editor window is displayed
        When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
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
        Then li 1 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(a)" in edition mode
        When click enter from keyboard in edition mode
        And  add content "point b" to li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
        Then li 2 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "(b)" in edition mode
        When click enter from keyboard in edition mode
        And  add content "point i" to li 3 with data-akn-element "point" of li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
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

#    @importOfficeJournal @local
#    Scenario: import from office journal
#        Given navigate to edit drafting application with "User1"
#        Then user is on home page
#        When click on create proposal button
#        Then user is on create new legislative document window
#        When click on template "SJ-023" in create new legislative document window
#        When click on next button in create document page
#        And  provide document title "Automation import OJ Testing" in create document page
#        And  click on create button
#        Then user is on proposal viewer page
#        When click on legal act link present in proposal viewer page
#        Then user is on legal act page
#        And  annotation side bar is present
#        And  ribbon toolbar is displayed
#        When click on import from oj button in ribbon toolbar
#        Then user is on "Import from the Official Journal of the European Union" window
#        And  close button in import office journal window is displayed and enabled
#        And  select all recitals button is disabled
#        And  select all articles button is disabled
#        And  "REGULATION" option is selected by default for type field
#        And  current year is selected by default for year field
#        And  blank input box is present for Nr. field
#        When click on type field
#        And  below options are displayed in type dropdown
#            | TypeOptions |
#            | REGULATION |
#            | DIRECTIVE  |
#            | DECISION   |
#        When click on search button in import office journal window
#        Then exclamation mark is appeared with "rgb(48, 48, 48)" color
#        When select option "DIRECTIVE" for type field
#        And  select option "2016" for year field
#        And  provide value "2102" in Nr. field
#        And  click on search button in import office journal window
#        Then bill content is appeared in import office journal window
#        And  select all recitals button is enabled
#        And  select all articles button is enabled
#        When click on checkbox of recital 1
#        When click on checkbox of recital 2
#        When click on checkbox of recital 3
#        When click on checkbox of article 1
#        When click on checkbox of article 2
#        When click on checkbox of article 3
#        When click on import button
#        Then 3 recitals are added in legal act by import oj
#        Then 3 articles are added in legal act by import oj
#        When click on import from oj button in ribbon toolbar
#        Then user is on "Import from the Official Journal of the European Union" window
#        When select option "REGULATION" for type field
#        And  select option "2014" for year field
#        And  provide value "9999" in Nr. field
#        And  click on search button in import office journal window
#        Then warning message contains "Search returned with no result! Please modify the search parameters"
#        When select option "REGULATION" for type field
#        And  select option "2016" for year field
#        And  provide value "679" in Nr. field
#        And  click on search button in import office journal window
#        Then bill content is appeared in import office journal window
#        When click on select all recitals button in import office journal window
#        Then checkboxes of all the recitals are selected
#        And  number of recitals selected is 173
#        When click on import button
#        Then 176 recitals are added FVin legal act by import oj
#        When click on import from oj button in ribbon toolbar
#        Then user is on "Import from the Official Journal of the European Union" window
#        When select option "REGULATION" for type field
#        And  select option "2016" for year field
#        And  provide value "679" in Nr. field
#        And  click on search button in import office journal window
#        Then bill content is appeared in import office journal window
#        When click on select all articles button in import office journal window
#        Then checkboxes of all the articles are selected
#        And  number of articles selected is 99
#        When click on import button
#        Then 102 articles are added in legal act by import oj
#        When click on versions pane accordion
#        When click on show more button in "Recent changes" eui-card
#        Then title of last 3 minor versions from recent changes eui-card contains "Import element(s) inserted"

    @internalReference @local
    Scenario: test internal reference by uploading existing leg file
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on upload button
        Then active upload window label contains "Upload a legislative document"
        When upload a leg file from a relative location "PROP_ACT_1383684831844402901.leg"
        Then active upload window label contains "Document metadata"
        And  document title input field is displayed
        When click on create button in upload document page
        Then user is on proposal viewer page
        Then title of the proposal contains "Automation.....internal references....." keyword
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is displayed
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
        When click on "(1) Recital...Article 11" link in navigation pane
        Then recital 1 is displayed
        When click on internal reference link 1 of recital 1
        Then article 11 is displayed
        When click on "(2) Recital...Article 9(1), point (b)" link in navigation pane
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
        When click on "Article 8 - Article heading... 1.Text...Article 11(2)" link in navigation pane
        Then article 8 is displayed
        When click on internal reference link 1 of paragraph 1 of article 8
        Then paragraph 2 of article 11 is displayed