#Author: Felipe Machado
#Keywords Summary : Testing different scenarios for track changes

@TrackChangesScenarios
Feature: Track Changes Feature

  @adding_new_character @local
  Scenario: Add new character in an Article in Legal Act
    Given navigate to "local" edit drafting application
