import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
import './body.html';
import './task.js';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
    const selector = (Template.instance().state.get('hideCompleted'))
      ? { checked: { $ne: true } }
      : {};

    const sort = (Template.instance().state.get('sort'));

    return Tasks.find(selector, { sort: { [sort]: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(event) {
    event.preventDefault();

    const { text, dueDate, priority } = event.target;

    Meteor.call('tasks.insert', {
      text: text.value,
      dueDate: dueDate.value,
      priority: parseInt(priority.value, 10),
    }, (error) => {
      if (error) {
        toastr.error(error.error, 'Error', {
          preventDuplicates: true,
        });
      } else {
        toastr.success('Task created');

        text.value = '';
        dueDate.value = '';
        priority.value = 1;
      }
    });
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
  'change .sort'(event, instance) {
    instance.state.set('sort', event.target.value);
  },
});
