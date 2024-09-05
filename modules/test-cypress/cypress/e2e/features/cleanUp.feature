#Author: Satyabrata Das
#Keywords Summary : clean up acts in drafting instance

@cleanUpScenario
Feature: clean up scenario

    @cleanUpProposal
    Scenario: delete act from drafting instance
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        And  delete all the acts containing keyword "Automation"