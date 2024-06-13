#Author: Satyabrata Das
#Keywords Summary : clean up proposals in drafting instance

@cleanUpScenario
Feature: clean up scenario

    @cleanUpProposal
    Scenario: delete proposal from drafting instance
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        And  delete all the proposals containing keyword "Automation"