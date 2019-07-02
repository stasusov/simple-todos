import { check, Match } from 'meteor/check';
import { Meteor } from "meteor/meteor";
import { Tasks } from './tasks';

export const CheckAuthorized = Match.Where((taskId) => {
  const task = Tasks.findOne(taskId);
  if (task.private && task.owner !== Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }

  return true;
});

export const IsOwner = Match.Where((taskId) => {
  const task = Tasks.findOne(taskId);
  if (task.owner !== Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }

  return true;
});

export const StringMinFiveSymbols = Match.Where((string) => {
  check(string, String);
  if (string.length < 5) {
    throw new Meteor.Error('Task name should be at least 5 characters long');
  }

  return true;
});
