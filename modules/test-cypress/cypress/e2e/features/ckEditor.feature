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
        And  content of subparagraph 1 of paragraph 3 of article 1 contains a table with 3 row and 2 column
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

    @ckEditorTablePlugin @local
    Scenario: Basic test to create a table inside another table
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on Create act button
        Then user is on create new legislative document window
        And  collapse all button is displayed in create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "ck editor scenario for table creation" in create document page
        And  click on create button
        Then user is on act viewer page

        ########## open legal act ###################
        When click on legal act link present in act viewer page
        Then user is on legal act page
        When click on edit icon of article 1
        Then ck editor window is displayed
        When click on table icon present in ck editor panel
        Then cke dialog window is displayed with title "Table Properties"
        When click on ok button in cke dialog window
        Then table icon is disabled in ck editor
        When click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
        Then table icon is enabled in ck editor
        When click at cell 1 of row 1 of table 1 of li 2 with data-akn-element "paragraph" in edition mode
        Then table icon is disabled in ck editor
        When click save and close button of ck editor
        Then content of subparagraph 2 of paragraph 2 of article 1 contains a table with 3 row and 2 column
        When click on edit icon of article 1
        And  click at cell 1 of row 1 of table 1 of li 2 with data-akn-element "paragraph" in edition mode
        Then table icon is disabled in ck editor
        When click at offset 0 of li 1 with data-akn-element "paragraph" of article in edition mode
        Then table icon is enabled in ck editor

        ######  subparagraphMandate ######
        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then user is on act viewer page
        When click on financial statement link present in act viewer page
        Then user is on financial statement page
        And  doctype is "LEGISLATIVE FINANCIAL AND DIGITAL STATEMENT"
        And  annotation side bar is present
        And  content of subparagraph 3 of level 26 contains a table with 5 row and 4 column in financial statement document
        When click on edit icon of subparagraph 3 of landscape level 2 in financial statement page
        Then ck editor window is displayed
        And  table icon is disabled in ck editor

        ######  Annex inlineParagraph ######
        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        When click on annex 1 link
        Then user is on annex page
        And  ribbon toolbar is maximized
        And  annotation side bar is present
        When click on toc edit button
        Then cancel button is displayed and enabled in navigation pane
        When drag element "Paragraph" from element tree list and drop before node label "1. Text..." in navigation pane
        Then success message "Paragraph has been added successfully!" is displayed in navigation pane
        When click on save and close button in navigation pane
        Then toc editing button is displayed and enabled
        When click on edit icon of paragraph 1
        Then ck editor window is displayed
        And  table icon is enabled in ck editor
        When click on table icon present in ck editor panel
        Then cke dialog window is displayed with title "Table Properties"
        When click on ok button in cke dialog window
        Then table icon is disabled in ck editor
        When click at offset 0 of li 1 with data-akn-element "paragraph" in edition mode
        Then table icon is enabled in ck editor
        When click at cell 1 of row 1 of table 1 of li 1 with data-akn-element "paragraph" in edition mode
        Then table icon is disabled in ck editor
        When click save and close button of ck editor
        Then content of paragraph 2 contains a table with 3 row and 2 column
        #### Workaround to get attr 'id' of new paragraph for table #####
        When refresh the browser
        Then user is on annex page
        ####
        When click on edit icon of level 1
        When click on edit icon of paragraph 2
        Then ck editor window is displayed
        And  table icon is disabled in ck editor
        When mouseover and click on paragraph 1
        Then ck editor window is displayed
        And table icon is enabled in ck editor
        When click close button of ck editor

    @ckEditorOpen @local
    Scenario: preventing actions when ckEditor is open
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on Create act button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation Article Testing" in create document page
        And  click on create button
        Then user is on act viewer page

        ## breadcrum navigation from explanatory memorandum ##
        When click on explanatory memorandum link present in act viewer page
        Then user is on explanatory memorandum page
        When mouseover and click on block container 1 in explanatory memorandum page
        Then ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then user is on act viewer page

        ##### Save button #####
        When click on legal act link present in act viewer page
        Then user is on legal act page
        When mouseover and click on article 1
        Then ck editor window is displayed

        When click on save button in ribbon toolbar
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When click on save button in ribbon toolbar
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then "Save this version" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is not displayed

        ##### Import from OJ button #####
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click on import from oj button in ribbon toolbar
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When mouseover and click on article 1
        Then ck editor window is displayed
        When click on import from oj button in ribbon toolbar
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then "Import from the Official Journal of the European Union" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is not displayed

        ##### Edit TOC #####
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click on toc edit button
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And elements list is not displayed in navigation pane
        And ck editor window is displayed

        When mouseover and click on article 1
        Then ck editor window is displayed
        When click on toc edit button
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then cancel button is displayed and enabled in navigation pane
        When click on cancel button in navigation pane
        Then no dialog box window present
        And elements list is not displayed in navigation pane
        And ck editor window is not displayed

        ##### Revert to previous version #####
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click on versions pane accordion
        Then search button is displayed in versions pane section
        When click on three vertical dots of card header title "Version 0.1.0 - Document created" in version pane
        And click on revert to this version
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When mouseover and click on article 1
        Then ck editor window is displayed
        When click on three vertical dots of card header title "Version 0.1.0 - Document created" in version pane
        And click on revert to this version
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then "Restore Version" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is not displayed

        ##### Close button #####
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click on close button present in legal act page
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When mouseover and click on article 1
        Then ck editor window is displayed
        When click on close button present in legal act page
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then user is on act viewer page

        ##### Breadcrum navigation #####
        ## from legal act##
        When click on legal act link present in act viewer page
        Then user is on legal act page
        When mouseover and click on article 1
        Then ck editor window is displayed

        When click on home link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When click on workspace button in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then user is on act viewer page

        ## from financial statement ##
        When click on financial statement link present in act viewer page
        Then user is on financial statement page
        When click on edit icon of level 2 in financial statement page
        Then ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then user is on act viewer page

        ## from cover page ##
        When click on cover page link present in act viewer page
        Then user is on cover page
        When click on long title of doc purpose
        Then ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then user is on act viewer page

        ## from annex ##
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        When click on annex 1 link
        Then user is on annex page
        When mouseover and real click on level 1
        Then ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on cancel button in dialog box window
        Then no dialog box window present
        And ck editor window is displayed

        When click on act view link in breadcrumb item
        Then "Open Editor Detected" dialog box window is displayed
        When click on confirm button in dialog box window
        Then user is on act viewer page

    @saveAddNext @local
    Scenario: create a new element with same type after the current element using shortcut control and enter key together when ck editor is open
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on Create act button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation saveAddNext Testing" in create document page
        And  click on create button
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        When click on legal act link present in act viewer page
        Then user is on legal act page
        And  total citation count is 6
        When mouseover and click on citation 1
        Then ck editor window is displayed
        And  click ctrl key and enter key together from keyboard in edition mode
        Then ck editor window is displayed
        When click close button of ck editor
        Then ck editor window is not displayed
        And  total citation count is 7
        And  total recital count is 2
        When mouseover and click on recital 1
        Then ck editor window is displayed
        And  click ctrl key and enter key together from keyboard in edition mode
        Then ck editor window is displayed
        When click close button of ck editor
        Then ck editor window is not displayed
        And  total recital count is 3
        And  total article count is 3
        When mouseover and click on article 1
        Then ck editor window is displayed
        And  click ctrl key and enter key together from keyboard in edition mode
        Then ck editor window is displayed
        When click close button of ck editor
        Then ck editor window is not displayed
        And  total article count is 4
        When click on close button present in legal act page
        Then user is on act viewer page
        When click on annex 1 link
        Then user is on annex page
        When refresh the browser
        When click on toc edit button
        And  drag element "Paragraph" from element tree list and drop after node label "2. Text..." in navigation pane
        And  click on save and close button in navigation pane
        Then total number of level is 3
        When click on edit icon of level 1
        Then ck editor window is displayed
        And  click ctrl key and enter key together from keyboard in edition mode
        Then ck editor window is displayed
        When click close button of ck editor
        Then ck editor window is not displayed
        And  total number of level is 4
        And  total number of paragraph is 1
        When mouseover and click on paragraph 1
        Then ck editor window is displayed
        And  click ctrl key and enter key together from keyboard in edition mode
        Then ck editor window is displayed
        When click close button of ck editor
        Then ck editor window is not displayed
        And  total number of paragraph is 2

    @trackChangesPlugin @local
    Scenario: Verify the TC plugin
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on Create act button
        Then user is on create new legislative document window
        And  collapse all button is displayed in create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation Testing Accept All and Reject All Plugin" in create document page
        And  click on create button
        Then user is on act viewer page
        When click on explanatory memorandum link present in act viewer page
        Then user is on explanatory memorandum page
        When enable track changes
        When mouseover and click on block container 1 in explanatory memorandum page
        Then ck editor window is displayed
        And  content of p tag 1 with attribute "data-akn-name" with value "aknParagraph" of blockContainer contains "Not Applicable" in edition mode
        When click at offset 14 in p with attribute "data-akn-name" with value "aknParagraph" of blockContainer in edition mode
        And  click on numberedList icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add "test2" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "test3" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "test4" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "test5" at current cursor position in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  click on bulletedList icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add "test6" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "test7" at current cursor position in edition mode
        And  click on increase indent icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add "test8" at current cursor position in edition mode
        And  user clicks on the track changes action plugin
        Then track changes action dropdown displays the following options:
            | Accept All |
            | Reject All |
        When click on reject all changes dropdown button
        Then content of p tag 1 with attribute "data-akn-name" with value "aknParagraph" of blockContainer contains "Not Applicable" in edition mode
        When click at offset 14 in p with attribute "data-akn-name" with value "aknParagraph" of blockContainer in edition mode
        And  click on numberedList icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add "test2" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "test3" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "test4" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "test5" at current cursor position in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  click on bulletedList icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add "test6" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "test7" at current cursor position in edition mode
        And  click on increase indent icon present in ck editor panel
        And  click enter from keyboard in edition mode
        And  add "test8" at current cursor position in edition mode
        When user clicks on the track changes action plugin
        When click on accept all changes dropdown button
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  num of item 1 of blockList 1 of blockContainer 1 contains value "1."
        And  content of item 1 of blockList 1 of blockContainer 1 contains value "Not Applicable"
        And  num of item 2 of blockList 1 of blockContainer 1 contains value "2."
        And  content of item 2 of blockList 1 of blockContainer 1 contains value "test2"
        And  num of item 1 of blockList 1 of item 2 of blockList 1 of blockContainer 1 contains value "1."
        And  content of item 1 of blockList 1 of item 2 of blockList 1 of blockContainer 1 contains value "test3"
        And  num of item 2 of blockList 1 of item 2 of blockList 1 of blockContainer 1 contains value "2."
        And  content of item 2 of blockList 1 of item 2 of blockList 1 of blockContainer 1 contains value "test4"
        And  num of item 1 of blockList 2 of blockContainer 1 contains value "•"
        And  content of item 1 of blockList 2 of blockContainer 1 contains value "test5"
        And  num of item 2 of blockList 2 of blockContainer 1 contains value "•"
        And  content of item 2 of blockList 2 of blockContainer 1 contains value "test6"
        And  num of item 1 of blockList 1 of item 2 of blockList 2 of blockContainer 1 contains value "•"
        And  content of item 1 of blockList 1 of item 2 of blockList 2 of blockContainer 1 contains value "test7"
        And  num of item 2 of blockList 1 of item 2 of blockList 2 of blockContainer 1 contains value "•"
        And  content of item 2 of blockList 1 of item 2 of blockList 2 of blockContainer 1 contains value "test8"
        And  click on close button on explanatory memorandum page
        Then user is on act viewer page
        When click on legal act link present in act viewer page
        Then user is on legal act page
        When enable track changes
        When mouseover and click on citation 2
        Then ck editor window is displayed
        And  citation contains text "Having regard to the proposal from the European Commission," in edition mode
        When click at offset 0 of child 0 of citation in edition mode
        When add "Text..." at current cursor position in edition mode
        Then citation contains span tag with attribute name "data-akn-action" with value "insert" in edition mode
        When user clicks on the track changes action plugin
        Then track changes action dropdown displays the following options:
            | Accept All |
            | Reject All |
        When click on reject all changes dropdown button
        Then citation should not contain a span tag in edition mode
        And  citation contains text "Having regard to the proposal from the European Commission," in edition mode
        When click at offset 0 of child 0 of citation in edition mode
        When add "Text..." at current cursor position in edition mode
        Then citation contains span tag with attribute name "data-akn-action" with value "insert" in edition mode
        When user clicks on the track changes action plugin
        When click on accept all changes dropdown button
        Then citation should not contain a span tag in edition mode
        And  citation contains text "Text...Having regard to the proposal from the European Commission," in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  citation 2 contains "Text...Having regard to the proposal from the European Commission,"
        When mouseover and click on recital 1
        Then ck editor window is displayed
        And  recital contains text "Recital..." in edition mode
        When click at offset 0 of child 0 of recital in edition mode
        When add "Text..." at current cursor position in edition mode
        Then recital contains span tag with attribute name "data-akn-action" with value "insert" in edition mode
        When user clicks on the track changes action plugin
        When click on reject all changes dropdown button
        Then recital should not contain a span tag in edition mode
        And  recital contains text "Recital..." in edition mode
        When click at offset 0 of child 0 of recital in edition mode
        When add "Text..." at current cursor position in edition mode
        Then recital contains span tag with attribute name "data-akn-action" with value "insert" in edition mode
        When user clicks on the track changes action plugin
        When click on accept all changes dropdown button
        Then recital should not contain a span tag in edition mode
        And  recital contains text "Text...Recital..." in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  recital 1 contains "Text...Recital..."
        When mouseover and click on article 1
        And  ck editor window is displayed
        When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point a sub point a" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point b sub point b" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point i sub point i" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point ii sub point ii" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point 1 sub point 1" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point 2 sub point 2" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point - sub point -" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point -- sub point --" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "point 3 sub point 3" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "point iii sub point iii" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "point c sub point c" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "second paragraph" at current cursor position in edition mode
        And  append "First Paragraph" at offset 7 in numbered paragraph 1 of article in edition mode
        And  append "last Paragraph" at offset 7 in numbered paragraph 3 of article in edition mode
#        And  user clicks on the track changes action plugin
#        And  click on reject all changes dropdown button
#        Then article should not contain a span tag in edition mode
#        Then numbered paragraph 1 of article contains "Text..." in edition mode
#        And  numbered paragraph 2 of article contains "Text..." in edition mode
#        When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point a sub point a" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point b sub point b" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point i sub point i" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point ii sub point ii" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point 1 sub point 1" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point 2 sub point 2" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point - sub point -" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point -- sub point --" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on decrease indent icon present in ck editor panel
#        And  add "point 3 sub point 3" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on decrease indent icon present in ck editor panel
#        And  add "point iii sub point iii" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on decrease indent icon present in ck editor panel
#        And  add "point c sub point c" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on decrease indent icon present in ck editor panel
#        And  add "second paragraph" at current cursor position in edition mode
#        And  append "First Paragraph" at offset 7 in numbered paragraph 1 of article in edition mode
#        And  append "last Paragraph" at offset 7 in numbered paragraph 3 of article in edition mode
        And  user clicks on the track changes action plugin
        And  click on accept all changes dropdown button
        Then article should not contain a span tag in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  content of subparagraph 1 of list 1 of paragraph 1 of article 1 contains "Text...First Paragraph"
        And  content of point 1 of list 1 of paragraph 1 of article 1 contains "point a sub point a"
        And  content of subparagraph 1 of list 1 of point 2 of list 1 of paragraph 1 of article 1 contains "point b sub point b"
        And  content of point 1 of list 1 of point 2 of list 1 of paragraph 1 of article 1 contains "point i sub point i"
        And  content of subparagraph 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 1 contains "point ii sub point ii"
        And  content of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 1 contains "point 1 sub point 1"
        And  content of subparagraph 1 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 1 contains "point 2 sub point 2"
        And  content of indent 1 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 1 contains "point - sub point -"
        And  content of indent 2 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 1 contains "point -- sub point --"
        And  content of point 3 of list 1 of point 2 of list 1 of point 2 of list 1 of paragraph 1 of article 1 contains "point 3 sub point 3"
        And  content of point 3 of list 1 of point 2 of list 1 of paragraph 1 of article 1 contains "point iii sub point iii"
        And  content of point 3 of list 1 of paragraph 1 of article 1 contains "point c sub point c"
        And  content of paragraph 2 of article 1 contains "second paragraph"
        And  content of paragraph 3 of article 1 contains "Text...last Paragraph"
        When click on close button present in legal act page
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        When click on annex 1 link
        Then user is on annex page
        When click on toc edit button
        Then cancel button is displayed and enabled in navigation pane
        When drag element "Paragraph" from element tree list and drop after node label "2. Text..." in navigation pane
        Then success message "Paragraph has been added successfully!" is displayed in navigation pane
        And  success message disappears from table of content
        When click on save and close button in navigation pane
        Then toc editing button is displayed and enabled
        And  total number of paragraph is 1
        When enable track changes
        When mouseover and click on level 1
        Then ck editor window is displayed
#        When click enter from keyboard in edition mode
#        And  add "new paragraph" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point a sub point a" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point b sub point b" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point i sub point i" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point ii sub point ii" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point 1 sub point 1" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point 2 sub point 2" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point - sub point -" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point -- sub point --" at current cursor position in edition mode
#        And  user clicks on the track changes action plugin
#        And  click on reject all changes dropdown button
#        Then level should not contain a span tag in edition mode
#        Then pTag 1 of level contains "Text..." in edition mode
#        When click at offset 7 of pTag 1 of level in edition mode
        When click enter from keyboard in edition mode
        And  add "new paragraph" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point a sub point a" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point b sub point b" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point i sub point i" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point ii sub point ii" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point 1 sub point 1" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point 2 sub point 2" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point - sub point -" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point -- sub point --" at current cursor position in edition mode
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        When mouseover and click on level 1
        Then ck editor window is displayed
        When click at offset 8 of span tag with attribute name "data-akn-action" and value "insert" of li tag 1 with attribute name "data-akn-element" and value "subparagraph" of ol tag of li tag 3 of ol tag of level in edition mode
        And  click on soft enter icon present in ck editor panel
        When click at offset 8 of span tag with attribute name "data-akn-action" and value "insert" of li tag 1 with attribute name "data-akn-element" and value "point" of ol tag of li tag 3 of ol tag of level in edition mode
        And  click on soft enter icon present in ck editor panel
        When click at offset 8 of span tag with attribute name "data-akn-action" and value "insert" of li tag 1 with attribute name "data-akn-element" and value "subparagraph" of ol tag of li tag 3 of ol tag of li tag 2 of ol tag of li tag 3 of ol tag of level in edition mode
        And  click on soft enter icon present in ck editor panel
        When click at offset 8 of span tag with attribute name "data-akn-action" and value "insert" of li tag 2 with attribute name "data-akn-element" and value "point" of ol tag of li tag 3 of ol tag of li tag 2 of ol tag of li tag 3 of ol tag of level in edition mode
        And  click on soft enter icon present in ck editor panel
        When user clicks on the track changes action plugin
        And  click on reject all changes dropdown button
        Then level should not contain a span tag in edition mode
        Then pTag 1 of level contains "Text..." in edition mode
        When click enter from keyboard in edition mode
        And  add "new paragraph" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point a sub point a" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point b sub point b" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point i sub point i" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point ii sub point ii" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point 1 sub point 1" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point 2 sub point 2" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point - sub point -" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point -- sub point --" at current cursor position in edition mode
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        When mouseover and click on level 1
        Then ck editor window is displayed
#        When click at offset 8 of span tag with attribute name "data-akn-action" and value "insert" of li tag 1 with attribute name "data-akn-element" and value "subparagraph" of ol tag of li tag 3 of ol tag of level in edition mode
#        And  click on soft enter icon present in ck editor panel
#        When click at offset 8 of span tag with attribute name "data-akn-action" and value "insert" of li tag 1 with attribute name "data-akn-element" and value "point" of ol tag of li tag 3 of ol tag of level in edition mode
#        And  click on soft enter icon present in ck editor panel
#        When click at offset 8 of span tag with attribute name "data-akn-action" and value "insert" of li tag 1 with attribute name "data-akn-element" and value "subparagraph" of ol tag of li tag 3 of ol tag of li tag 2 of ol tag of li tag 3 of ol tag of level in edition mode
#        And  click on soft enter icon present in ck editor panel
#        When click at offset 8 of span tag with attribute name "data-akn-action" and value "insert" of li tag 2 with attribute name "data-akn-element" and value "point" of ol tag of li tag 3 of ol tag of li tag 2 of ol tag of li tag 3 of ol tag of level in edition mode
#        And  click on soft enter icon present in ck editor panel
        When user clicks on the track changes action plugin
        And  click on accept all changes dropdown button
        Then level should not contain a span tag in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  content of subparagraph 1 of level 1 is "Text..."
        And  content of subparagraph with attribute name "refersto" and value "~INP" of list 1 of level 1 is "new paragraph"
        And  content of point 1 of list 1 of level 1 is "point a sub point a"
        And  content of subparagraph 1 of list 1 of point 2 of list 1 of level 1 is "point b sub point b"
#        And  content of subparagraph with attribute name "refersto" and value "~INP" of list 1 of point 2 of list 1 of level 1 is "sub point b"
        And  content of point 1 of list 1 of point 2 of list 1 of level 1 is "point i sub point i"
#        And  content of subparagraph 2 of point 1 of list 1 of point 2 of list 1 of level 1 is "sub point i"
        And  content of subparagraph with attribute name "refersto" and value "~INP" of list 1 of point 2 of list 1 of point 2 of list 1 of level 1 is "point ii sub point ii"
        And  content of point 1 of list 1 of point 2 of list 1 of point 2 of list 1 of level 1 is "point 1 sub point 1"
        And  content of subparagraph 1 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of level 1 is "point 2 sub point 2"
#        And  content of subparagraph with attribute name "refersto" and value "~INP" of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of level 1 is "sub point 2"
        And  content of indent 1 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of level 1 is "point - sub point -"
        And  content of indent 2 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of level 1 is "point -- sub point --"
#        And  content of subparagraph 2 of indent 2 of list 1 of point 2 of list 1 of point 2 of list 1 of point 2 of list 1 of level 1 is "sub point --"
        When mouseover and click on paragraph 1
        Then ck editor window is displayed
#        When click enter from keyboard in edition mode
#        And  add "second paragraph" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point a sub point a" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point b sub point b" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point i sub point i" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point ii sub point ii" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point 1 sub point 1" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point 2 sub point 2" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on increase indent icon present in ck editor panel
#        And  add "point - sub point -" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  add "point -- sub point --" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on decrease indent icon present in ck editor panel
#        And  add "point 3 sub point 3" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on decrease indent icon present in ck editor panel
#        And  add "point iii sub point iii" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on decrease indent icon present in ck editor panel
#        And  add "point c sub point c" at current cursor position in edition mode
#        And  click enter from keyboard in edition mode
#        And  click on decrease indent icon present in ck editor panel
#        And  add "wrapper paragraph" at current cursor position in edition mode
#        And  user clicks on the track changes action plugin
#        And  click on reject all changes dropdown button
#        And  user clicks on the track changes action plugin
#        And  click on reject all changes dropdown button
#        Then paragraph should not contain a span tag in edition mode
#        When click save and close button of ck editor
#        Then ck editor window is not displayed
#        When mouseover and click on paragraph 1
#        Then ck editor window is displayed
#        Then paragraph contains "Text..." in edition mode
#        When click at offset 7 of paragraph in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point a sub point a" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point b sub point b" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point i sub point i" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point ii sub point ii" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point 1 sub point 1" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point 2 sub point 2" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point - sub point -" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point -- sub point --" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "point 3 sub point 3" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "point iii sub point iii" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "point c sub point c" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "wrapper paragraph" at current cursor position in edition mode
        And click save and close button of ck editor
        Then ck editor window is not displayed
        When refresh the browser
        Then user is on annex page
        When click on edit icon of paragraph 1
        Then ck editor window is displayed
        When user clicks on the track changes action plugin
        And  click on reject all changes dropdown button
        Then paragraph should not contain a span tag in edition mode
        Then paragraph contains "Text..." in edition mode
        And  click enter from keyboard in edition mode
        And  add "intro subparagraph" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point a sub point a" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point b sub point b" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point i sub point i" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point ii sub point ii" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point 1 sub point 1" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point 2 sub point 2" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point - sub point -" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  add "point -- sub point --" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "point 3 sub point 3" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "point iii sub point iii" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "point c sub point c" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on decrease indent icon present in ck editor panel
        And  add "wrapper subparagraph" at current cursor position in edition mode
        And  user clicks on the track changes action plugin
        And  click on accept all changes dropdown button
        Then paragraph should not contain a span tag in edition mode
        When click save and close button of ck editor
        Then ck editor window is not displayed
        When refresh the browser
        Then user is on annex page
        And  total number of paragraph is 2
        And  content of paragraph 1 is "Text..."
        And  content of subparagraph with attribute name "refersto" and value "~INP" of paragraph 2 is "intro subparagraph"
        And  content of point 1 of paragraph 2 is "point a sub point a"
        And  content of subparagraph with attribute name "refersto" and value "~INP" of list of point 2 of paragraph 2 is "point b sub point b"
        And  content of point 1 of point 2 of paragraph 2 is "point i sub point i"
        And  content of subparagraph with attribute name "refersto" and value "~INP" of list of point 2 of point 2 of paragraph 2 is "point ii sub point ii"
        And  content of point 1 of point 2 of point 2 of paragraph 2 is "point 1 sub point 1"
        And  content of subparagraph with attribute name "refersto" and value "~INP" of list of point 2 of point 2 of point 2 of paragraph 2 is "point 2 sub point 2"
        And  content of point 1 of point 2 of point 2 of point 2 of paragraph 2 is "point - sub point -"
        And  content of point 2 of point 2 of point 2 of point 2 of paragraph 2 is "point -- sub point --"
        And  content of point 3 of point 2 of point 2 of paragraph 2 is "point 3 sub point 3"
        And  content of point 3 of point 2 of paragraph 2 is "point iii sub point iii"
        And  content of point 3 of point 2 of paragraph 2 is "point iii sub point iii"
        And  content of point 3 of paragraph 2 is "point c sub point c"
        And  content of subparagraph with attribute name "refersto" and value "~WRP" of paragraph 2 is "wrapper subparagraph"