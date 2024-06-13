
@ImportProposalScenario
  Feature: Import proposal feature

    @import_proposal_api @local
      Scenario: Test to import proposal in leos using api call
        Given Send a POST request to import proposal with the following data
          | legFile | PROP_ACT-clxacyrh50004ik5811kwzdqv-fr.leg |
      Then the response status code should be 200 or match failure conditions