import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nop-activity-type',
  actions: {
    remove() {
      console.log("remove activity type");
    }
  }
});
