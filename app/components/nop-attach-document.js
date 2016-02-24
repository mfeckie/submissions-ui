import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nop-attach-document',
  hint: '',
  actions: {
    addDocument(document) {
      this.set('document', document);
    },
    removeDocument(document) {
      this.set('document', null);
    }
  }
});
