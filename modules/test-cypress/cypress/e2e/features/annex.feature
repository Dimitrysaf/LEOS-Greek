#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in annex in drafting instance

@AnnexScenarios
Feature: Annex Page Regression Features

    Background:
        Given navigate to edit drafting application with "User1"
        Then user is on home page

    @annexOperations @local
    Scenario: create, delete of annexes and edit of text inside annex
        When click on Create act button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation Annex Numbering Testing" in create document page
        And  click on create button
        Then user is on act viewer page
        And  cover page link is present
        And  explanatory memorandum link is present
        And  legal act link is present
        And  annexes section is present
        And  there is no annex in annexes section
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        When click on annex 1 link
        Then annotation side bar is present
        And  user is on annex page
        And  annex title is "Annex"
        When click on close button present in annex page
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 2
        When click on annex 1 link
        Then annotation side bar is present
        And  user is on annex page
        And  annex title is "Annex I"
        When click on close button present in annex page
        Then user is on act viewer page
        When click on annex 2 link
        Then annotation side bar is present
        And  user is on annex page
        And  annex title is "Annex II"
        When click on close button present in annex page
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 3
        When click on action icon of annex 1
        And  click on change title button
        Then "Edit title" dialog box window is displayed
        And  input value of dialog box window is "Annex"
        When provide input "Annex 1" dialog box window
        Then input value of dialog box window is "Annex 1"
        When click on save button in dialog input box window
        Then title of annex 1 contains "Annex 1"
        When click on action icon of annex 2
        And  click on change title button
        Then "Edit title" dialog box window is displayed
        And  input value of dialog box window is "Annex"
        When provide input "Annex 2" dialog box window
        And  click on save button in dialog input box window
        Then title of annex 2 contains "Annex 2"
        When click on action icon of annex 3
        And  click on change title button
        Then "Edit title" dialog box window is displayed
        And  input value of dialog box window is "Annex"
        When provide input "Annex 3" dialog box window
        When click on save button in dialog input box window
        Then title of annex 3 contains "Annex 3"
        When click on annex 1 link
        Then user is on annex page
        And  annotation side bar is present
        And  ribbon toolbar is maximized
        And  toc editing button is displayed and enabled
        And  annex title is "Annex I"
#        Then block heading of the annex container is "Annex 1"
        When click on toc edit button
        Then cancel button is displayed and enabled in navigation pane
        Then below element lists are displayed in Elements menu
            | ElementList |
            | Part        |
            | Title       |
            | Chapter     |
            | Section     |
            | Point 1.    |
            | Paragraph   |
        When click on cancel button in navigation pane
        Then elements list is not displayed in navigation pane
        When click on insert before icon of level 1
        Then total number of level is 4
        When click on insert before icon of level 2
        Then total number of level is 5
        And  click on edit icon of level 1
        Then ck editor window is displayed
        ##########LEOS-6034 - START###################
        When append "New Addition" at p tag 1 of level in edition mode
        # And  click enter button from keyboard
        # And  click backspace button from keyboard
        ##########LEOS-6034 - END###################
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  level 1 contains "New Addition"
        When mouseover and click on level 1
        Then ck editor window is displayed
        ##########LEOS-6034 - START###################
        When select content from offset 7 to 19 of p tag 1 of level in edition mode
        And  click delete button from keyboard in edition mode
        ##########LEOS-6034 - END###################
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  level 1 doesn't contain "New Addition"
        When click on delete icon of level 3
        Then "Delete Element: confirmation" dialog confirm box window is displayed
        When click on ok button in dialog box window
        Then total number of level is 4
        ##################################### START ## LEOS-5980 ####################################
        When click on change annex structure in ribbon toolbar
        Then "Switch Annex Structure" dialog confirm box window is displayed
        When click on confirm button in dialog box window
        When mouseover and click on article 1
        Then ck editor window is displayed
        When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
        And  click on paragraph mode icon two times present in ck editor panel
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
        ###################################### END ## LEOS-5980 ####################################
        When click on close button present in annex page
        Then user is on act viewer page
        When user clicks on the reorder button
        Then "Edit annex order" dialog box window is displayed
        And  example box 1 contains " Annex 1"
        And  example box 2 contains "Annex 2"
        And  example box 3 contains "Annex 3"
        When drag row 1 and drop on row 3 in dialog box window
        Then example box 1 contains "Annex 2"
        And  example box 2 contains "Annex 3"
        And  example box 3 contains "Annex 1"
        When click on dismiss close button in dialog box window
        Then no dialog box window present
        When click on action icon of annex 3
        And  click on delete button in action menu
        Then "Annex deletion confirm" dialog confirm box window is displayed
        When click on danger button in dialog box window
        Then total number of annexes present in act viewer page is 2
#        And  title of annex 1 contains "Annex 2"
#        And  title of annex 2 contains "Annex 3"
        When click on annex 1 link
        Then user is on annex page
        And  annex title is "Annex I"
        When mouseover and click on level 1
        Then ck editor window is displayed
        When click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point a" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point i" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point 1" at current cursor position in edition mode
        And  click enter from keyboard in edition mode
        And  click on increase indent icon present in ck editor panel
        And  add "point -" at current cursor position in edition mode
        Then increase indent icon is disabled in ck editor
        When click save and close button of ck editor
        Then ck editor window is not displayed
        When enable track changes
        Then enable track changes toggle bar is on in ribbon toolbar
        When mouseover and click on level 1
        Then ck editor window is displayed
        When click on decrease indent icon present in ck editor panel
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  del tag with attribute "leos\:action-number" and value "delete" of num tag of point 2 of list of point 1 of list of point 1 of list of level 1 contains "—"
        And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of point 2 of list of point 1 of list of point 1 of list of level 1 contains "(2)"
        And  content of point 2 of list of point 1 of list of point 1 of list of level 1 contains "point -"
        When mouseover and click on level 1
        Then ck editor window is displayed
        When click on decrease indent icon present in ck editor panel
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  del tag with attribute "leos\:action-number" and value "delete" of num tag of point 2 of list of point 1 of list of level 1 contains "—"
        And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of point 2 of list of point 1 of list of level 1 contains "(ii)"
        And  content of point 2 of list of point 1 of list of level 1 contains "point -"
        When mouseover and click on level 1
        Then ck editor window is displayed
        When click on decrease indent icon present in ck editor panel
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  del tag with attribute "leos\:action-number" and value "delete" of num tag of point 2 of list of level 1 contains "—"
        And  ins tag with attribute "leos\:action-number" and value "insert" of num tag of point 2 of list of level 1 contains "(b)"
        And  content of point 2 of list of level 1 contains "point -"
        When mouseover and click on level 1
        Then ck editor window is displayed
        When click on decrease indent icon present in ck editor panel
        Then decrease indent icon is disabled in ck editor panel
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  del tag with attribute "leos\:action-number" and value "delete" of num tag of subparagraph 2 of list of level 1 contains "—"
        And  content of subparagraph 2 of list of level 1 contains "point -"

    @paragraphLevelValidation @local
    Scenario: issues/1920 AKN4EU 4.1.1 : A paragraph cannot have as nearest preceding sibling a level
        When click on Create act button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "paragraph level validation" in create document page
        And  click on create button
        Then user is on act viewer page
        When click on add button in annexes section
        Then total number of annexes present in act viewer page is 1
        When click on annex 1 link
        Then user is on annex page
        And  ribbon toolbar is maximized
        And  annotation side bar is present
        When click on toc edit button
        Then cancel button is displayed and enabled in navigation pane
        When drag element "Paragraph" from element tree list and drop before node label "1.1. Text..." in navigation pane
        Then error message "Only higher division are allowed in between points" is displayed in navigation pane
        And  error message disappears from table of content
        When drag element "Section" from element tree list and drop before node label "1.1. Text..." in navigation pane
        Then success message "Section has been added successfully!" is displayed in navigation pane
        And  success message disappears from table of content
        When drag element "Paragraph" from element tree list and drop as child of node label "Section # Section heading..." in navigation pane
        Then error message "Only higher division are allowed in between points" is displayed in navigation pane
        And  error message disappears from table of content
        When drag element "Point 1." from element tree list and drop as child of node label "Section # Section heading..." in navigation pane
        Then success message "Level has been added successfully!" is displayed in navigation pane
        And  success message disappears from table of content
        When drag element "Paragraph" from element tree list and drop before node label "1. Text..." in navigation pane
        Then success message "Paragraph has been added successfully!" is displayed in navigation pane
        And  success message disappears from table of content
        When drag element "Paragraph" from element tree list and drop after node label "2. Text..." in navigation pane
        Then success message "Paragraph has been added successfully!" is displayed in navigation pane
        And  success message disappears from table of content
        When click on save and close button in navigation pane
        Then toc editing button is displayed and enabled
        When mouseover and click on paragraph 1
        Then ck editor window is displayed
        When add "paragraph1" at offset 0 in paragraph in edition mode
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        When mouseover and click on paragraph 2
        Then ck editor window is displayed
        When add "paragraph2" at offset 0 in paragraph in edition mode
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        When click on toc edit button
        Then cancel button is displayed and enabled in navigation pane
        When drag element "Point 1." from element tree list and drop before node label "paragraph1" in navigation pane
        Then error message "Only higher division are allowed in between points" is displayed in navigation pane
        And  error message disappears from table of content
        When drag element "Point 1." from element tree list and drop after node label "paragraph2" in navigation pane
        Then error message "Only higher division are allowed in between points" is displayed in navigation pane
        And  error message disappears from table of content
        When drag element "Section" from element tree list and drop before node label "1. Text..." in navigation pane
        Then success message "Section has been added successfully!" is displayed in navigation pane
        And  success message disappears from table of content
        When drag element "Paragraph" from element tree list and drop as child of node label "Section # Section heading..." in navigation pane
        Then success message "Paragraph has been added successfully!" is displayed in navigation pane
        And  success message disappears from table of content
        When drag element "Point 1." from element tree list and drop before node label "Section # Section heading..." in navigation pane
        Then error message "Only higher division are allowed in between points" is displayed in navigation pane
        And  error message disappears from table of content
        When drag element "Point 1." from element tree list and drop as child of node label "Section # Section heading..." in navigation pane
        Then success message "Level has been added successfully!" is displayed in navigation pane
        And  success message disappears from table of content
        When click on save and close button in navigation pane
        Then toc editing button is displayed and enabled