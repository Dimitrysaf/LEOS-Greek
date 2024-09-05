
@ImportProposalScenario
  Feature: Import act feature

    @import_proposal_api @local
      Scenario: Test to import act in leos using api call
        Given Send a POST request to import act
         Then the response status code should be 200 or match failure conditions