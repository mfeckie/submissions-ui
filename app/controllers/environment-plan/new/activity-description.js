import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    goNext() {
      this.transitionToRoute('environment-plan.new.submission-contact');
    },
    goBack() {
      this.transitionToRoute('environment-plan.new.before-you-start');
    }
  }
});