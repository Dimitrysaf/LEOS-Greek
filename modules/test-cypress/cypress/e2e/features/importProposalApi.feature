
@ImportProposalScenario
  Feature: Import proposal feature

    @import_proposal_api @local
      Scenario: Test to import proposal in leos using api call
        Given Send a POST request to import proposal
         Then the response status code should be 200 or match failure conditions