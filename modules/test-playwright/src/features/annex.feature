#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in annex in drafting instance

@AnnexScenarios
Feature: Annex Page Regression Features

  Background:
    Given navigate to leos application with "username1"
    Then user is on home page

  @annex @local
  Scenario: create, delete of annexes and edit of text inside annex
    When click on create act button
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    When provide document title "Automation Annex Numbering Testing" in create document page
    When click on create button
    Then user is on act view page
    When click on add button in annexes section
#    And  click on annex in another format option
    Then total number of annexes present in act viewer page is 1
