import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nop-attach-file',
  actions: {
    remove() {
      console.log("remove attachment");
    }
  }
});
