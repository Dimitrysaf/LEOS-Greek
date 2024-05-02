#Author: Felipe Machado
#Keywords Summary : Testing different scenarios for track changes

@TrackChangesScenarios
Feature: Track Changes Feature

  @adding_new_character @local @nonlocal
  Scenario: Add new character in an Article in Legal Act
    Given navigate to edit drafting application with "User1"
