
@restApiScenario
  Feature: rest api regression features

    @import_proposal_api @local
    Scenario: Test to import act in leos using api call
      Given Send a POST request to import act
      Then the response status code should be 200 or match failure conditions

    @import_document_api @local
    Scenario: Test to import document in leos using api call
      Given user "User1" calls import document api with xml file "REG-clusabwtw000c0756jcwvn7hf-bg.xml" and language "bg" and navigate to edit drafting using leos light url
      Then mark as done button is displayed in the ribbon toolbar
      And  toc editing button is not present
      When mouseover on article 1
      Then only below widgets are present in show all action menu of article 1
        | widget |
        | edit   |
      When mouseover and click on article 1
      Then ck editor window is displayed
      And  internal reference icon is disabled in ck editor panel
      And  insert footnote icon is disabled in ck editor panel
      When click at offset 112 in li 1 with data-akn-element "subparagraph" of li 1 with data-akn-element "paragraph" of article in edition mode
      And  add "new changes " at current cursor position in edition mode
      And  click save and close button of ck editor
      Then ck editor window is not displayed
      And  num tag of point 1 of list 1 of paragraph 1 of article 1 contains "(а)"
      And  num tag of point 2 of list 1 of paragraph 1 of article 1 contains "(б)"
      And  num tag of point 3 of list 1 of paragraph 1 of article 1 contains "(в)"
      And  num tag of point 4 of list 1 of paragraph 1 of article 1 contains "(г)"
      And  num tag of point 5 of list 1 of paragraph 1 of article 1 contains "(д)"
