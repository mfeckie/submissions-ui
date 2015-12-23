import Ember from 'ember';
import _ from 'lodash/lodash';
import ResetScroll from '../../../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  submissionStore: Ember.inject.service(),
  model() {
    return this.get('submissionStore').retrieve();
  },
  afterModel(model) {
    if (!model.documents) {
      model.documents = {};
    }
    if (!model.documents.attachments) {
      model.documents.attachments = [];
    }
  },
  actions: {
    willTransition() {
      const currentModel = this.get('currentModel');
      _.remove(currentModel.documents.attachments, (a) => !a.token);

      this.get('submissionStore').save(currentModel);
    }
  }
});