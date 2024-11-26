#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities inside ck editor in drafting instance

@ckEditorScenarios
Feature: CK Editor Regression Features

    @ckEditorPlugin @local
    Scenario: testing of different ck editor plugin in citation, recital and articles
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on Create act button
        Then user is on create new legislative document window
        And  collapse all button is displayed in create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "ck editor scenarios" in create document page
        And  click on create button
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        When click on legal act link present in act viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is maximized
        When mouseover and click on citation 2
        Then ck editor window is displayed
        When select content from offset 7 till offset 13 in citation in edition mode
        Then undo button is disabled in ck editor
        And  redo button is disabled in ck editor
        And  citation contains text "regard" in edition mode
        When click on change text case icon present in ck editor panel
        Then undo button is enabled in ck editor
        And  redo button is disabled in ck editor
        And  citation contains text "REGARD" in edition mode
        When click on undo icon present in ck editor panel
        Then undo button is disabled in ck editor
        And  redo button is enabled in ck editor
        And  citation contains text "regard" in edition mode
        When click on redo icon present in ck editor panel
        Then undo button is enabled in ck editor
        And  redo button is disabled in ck editor
        And  citation contains text "REGARD" in edition mode
        When click on subscript icon present in ck editor panel
        Then "sub" tag is present in citation in edition mode
        When click on undo icon present in ck editor panel
        And  click on undo icon present in ck editor panel
        Then "sub" tag is not present in citation in edition mode
        When click on superscript icon present in ck editor panel
        Then "sup" tag is present in citation in edition mode
        When click on undo icon present in ck editor panel
        And  click on undo icon present in ck editor panel
        Then "sup" tag is not present in citation in edition mode
        When click on insert footnote icon present in ck editor panel
        Then cke dialog window is displayed with title "Edit Footnote"
        When type "new footnote" in cke dialog textarea
        And  click on ok button in cke dialog window
        Then authorial note with marker "(1)" and title "new footnote" is present inside citation in edition mode
        When click at offset 0 of child 0 of citation in edition mode
        And  click on insert special character icon present in ck editor panel
        Then cke dialog window is displayed with title "Select Special Character"
        When click on cell 1 of row 1 of special character table in cke dialog window
        Then citation contains text "!" in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  citation 2 contains "!"
        And  citation 2 contains authorial note with marker "(1)" and text "new footnote"
        When click on authorial note with marker "(1)" in citation 2
        Then authorial note table is displayed
        And  text of marker 1 of authorial note table is "new footnote"
        When click on marker 1 link in authorial note table
        Then citation 2 contains authorial note with marker "(1)" and text "new footnote"
        When mouseover and click on recital 1
        Then ck editor window is displayed
        When select content from offset 0 till offset 7 in recital in edition mode
        Then undo button is disabled in ck editor
        And  redo button is disabled in ck editor
        And  recital contains text "Recital" in edition mode
        When click on change text case icon present in ck editor panel
        Then undo button is enabled in ck editor
        And  redo button is disabled in ck editor
        And  recital contains text "RECITAL" in edition mode
        When click on undo icon present in ck editor panel
        Then undo button is disabled in ck editor
        And  redo button is enabled in ck editor
        And  recital contains text "Recital" in edition mode
        When click on redo icon present in ck editor panel
        Then undo button is enabled in ck editor
        And  redo button is disabled in ck editor
        And  recital contains text "RECITAL" in edition mode
        When click on subscript icon present in ck editor panel
        Then "sub" tag is present in recital in edition mode
        When click on undo icon present in ck editor panel
        And  click on undo icon present in ck editor panel
        Then "sub" tag is not present in recital in edition mode
        When click on superscript icon present in ck editor panel
        Then "sup" tag is present in recital in edition mode
        When click on undo icon present in ck editor panel
        And  click on undo icon present in ck editor panel
        Then "sup" tag is not present in recital in edition mode
        When click on insert footnote icon present in ck editor panel
        Then cke dialog window is displayed with title "Edit Footnote"
        When type "new footnote" in cke dialog textarea
        And  click on ok button in cke dialog window
        Then authorial note with marker "(1)" and title "new footnote" is present inside recital in edition mode
        When click at offset 0 of child 0 of recital in edition mode
        And  click on insert special character icon present in ck editor panel
        Then cke dialog window is displayed with title "Select Special Character"
        When click on cell 1 of row 1 of special character table in cke dialog window
        Then recital contains text "!" in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  recital 1 contains "!"
        And  recital 1 contains authorial note with marker "(4)" and text "new footnote"
        When click on authorial note with marker "(4)" in recital 1
        Then authorial note table is displayed
        And  text of marker 4 of authorial note table is "new footnote"
        When click on marker 4 link in authorial note table
        Then recital 1 contains authorial note with marker "(4)" and text "new footnote"
        When click on edit icon of article 1
        Then ck editor window is displayed
        When select content from offset 0 till offset 4 in numbered paragraph 1 of article in edition mode
        Then undo button is disabled in ck editor
        And  redo button is disabled in ck editor
        And  numbered paragraph 1 of article contains "Text" in edition mode
        When click on change text case icon present in ck editor panel
        Then undo button is enabled in ck editor
        And  redo button is disabled in ck editor
        And  numbered paragraph 1 of article contains "TEXT" in edition mode
        When click on undo icon present in ck editor panel
        And  click on undo icon present in ck editor panel
        Then undo button is disabled in ck editor
        And  redo button is enabled in ck editor
        And  numbered paragraph 1 of article contains "Text" in edition mode
        When click on redo icon present in ck editor panel
        And  click on redo icon present in ck editor panel
        Then undo button is enabled in ck editor
        And  redo button is disabled in ck editor
        And  numbered paragraph 1 of article contains "TEXT" in edition mode
        When click on subscript icon present in ck editor panel
        Then numbered paragraph 1 of article contains "sub" tag in edition mode
        When click on undo icon present in ck editor panel
        And  click on undo icon present in ck editor panel
        Then numbered paragraph 1 of article doesn't contain "sub" tag in edition mode
        When click on superscript icon present in ck editor panel
        Then numbered paragraph 1 of article contains "sup" tag in edition mode
        When click on undo icon present in ck editor panel
        And  click on undo icon present in ck editor panel
        Then numbered paragraph 1 of article doesn't contain "sup" tag in edition mode
        When click on insert footnote icon present in ck editor panel
        Then cke dialog window is displayed with title "Edit Footnote"
        When type "new footnote" in cke dialog textarea
        And  click on ok button in cke dialog window
        Then numbered paragraph 1 of article contains authorial note with marker "(1)" and title "new footnote" in edition mode
        When click at offset 0 of child 0 of li 1 with data-akn-element "paragraph" of article in edition mode
        And  click on insert special character icon present in ck editor panel
        Then cke dialog window is displayed with title "Select Special Character"
        When click on cell 1 of row 1 of special character table in cke dialog window
        Then numbered paragraph 1 of article contains text "!" in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  paragraph 1 of article 1 contains "!"
        And  paragraph 1 of article 1 contains authorial note with marker "(5)" and text "new footnote"
        When click on authorial note with marker "(5)" in paragraph 1 of article 1
        Then authorial note table is displayed
        And  text of marker 5 of authorial note table is "new footnote"
        When click on marker 5 link in authorial note table
        Then paragraph 1 of article 1 contains authorial note with marker "(5)" and text "new footnote"
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click at offset 7 of child 0 of li 2 with data-akn-element "paragraph" of article in edition mode
        When click enter from keyboard in edition mode
        And  click on math icon present in ck editor panel
        Then cke dialog window is displayed with title "Mathematics in TeX"
        When click on ok button in cke dialog window
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  paragraph 3 of article 1 contains "x=−b±√b2−4ac2ax=−b±b2−4ac2ax = {-b \pm \sqrt{b^2-4ac} \over 2a}"
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click at offset 7 of child 0 of li 2 with data-akn-element "paragraph" of article in edition mode
        When click enter from keyboard in edition mode
        And  click on table icon present in ck editor panel
        Then cke dialog window is displayed with title "Table Properties"
        When click on ok button in cke dialog window
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  content of subparagraph 1 of  of paragraph 3 of article 1 contains a table with 3 row and 2 column
        When mouseover and click on article 1
        Then ck editor window is displayed
        When select content from offset 0 till offset 7 in numbered paragraph 2 of article in edition mode
        And  click on bold icon present in ck editor panel
        And  click on italic icon present in ck editor panel
        Then numbered paragraph 2 of article contains "strong" tag in edition mode
        And  numbered paragraph 2 of article contains "em" tag in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  content of paragraph 2 of article 1 contains tag "b"
        And  content of paragraph 2 of article 1 contains tag "i"

    @ckEditorPluginInAnnex @local
    Scenario: testing of different ck editor plugin in annexes
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on Create act button
        Then user is on create new legislative document window
        And  collapse all button is displayed in create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "ck editor scenarios for annexes" in create document page
        And  click on create button
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        ########## open annex 1 ###################
        When click on annex 1 link
        Then annotation side bar is present
        And  user is on annex page
        And  annex title is "Annex"
        ########## insert table functionality ###################
        And  click on edit icon of level 1
        Then ck editor window is displayed
        And  click on table icon present in ck editor panel
        Then cke dialog window is displayed with title "Table Properties"
        When click on ok button in cke dialog window
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  content of subparagraph 2 of level 1 contains a table with 3 row and 2 column
        ########## insert footnote  ###################
        When click on edit icon of level 1
        Then ck editor window is displayed
        And  click at offset 7 in pTag 1 with data-akn-element "subparagraph" of li with data-akn-element "level" of ol with data-akn-element "level" in edition mode
        When click on insert footnote icon present in ck editor panel
        Then cke dialog window is displayed with title "Edit Footnote"
        When type "new footnote" in cke dialog textarea
        And  click on ok button in cke dialog window
        Then authorial note with marker "(1)" and title "new footnote" is present inside level in edition mode
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        ########## click footnote  ###################
        And  level 1 contains authorial note with marker "(1)" and text "new footnote"
        When click on authorial note with marker "(1)" in level 1
        Then authorial note table is displayed
        And  text of marker 1 of authorial note table is "new footnote"
        When click on marker 1 link in authorial note table
        Then level 1 contains authorial note with marker "(1)" and text "new footnote"
        ########### create internal reference ##############
        When click on edit icon of level 1
        Then ck editor window is displayed
        And  click at offset 7 in pTag 1 with data-akn-element "subparagraph" of li with data-akn-element "level" of ol with data-akn-element "level" in edition mode
        And  click on internal reference icon present in ck editor panel
        Then cke dialog window is displayed with title "Internal reference"
        When click on "2. Text..." link in annex on the left side of internal reference window
        And  click on ok button in cke dialog window
        And  click save and close button of ck editor
        Then "point 2" is added as internal reference 1 of level 1
        ### click the links of internal reference
        When click on internal reference link 1 of level 1
        Then level 3 of annex is displayed
        ###########  insert image ###########
        When click on edit icon of level 2
        Then ck editor window is displayed
        And  click on image icon present in ck editor panel
        Then cke dialog window is displayed with title "Image"
        And upload an image file from a relative location "the-quick-fox.jpg" in iframe "cke_dialog_ui_input_file"
        And click dialog ok button
        When click save and close button of ck editor
        Then level 2 contains image