import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nop-attach-image',
  hint: '',
  dropZoneInstruction: '',
  actions: {
    addDocument(document) {
      this.set('document', document);
    },
    removeDocument(document) {
      this.set('document', null);
    }
  }
});
