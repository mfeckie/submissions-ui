import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nop-add-another',
  actions: {
    click: function() {
      this.sendAction();
    }
  }
});
