import Ember from 'ember';

export default Ember.Component.extend({
  document: null,
  canRemove: false,
  showIcon: true,
  actions: {
    removeDocument(document) {
      this.sendAction('removeDocument', this.get('document'));
    }
  }
});
