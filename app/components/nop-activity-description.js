import Ember from 'ember';
import _ from 'lodash/lodash';
import Constants from '../constants';

export default Ember.Component.extend({
  tagName: 'nop-activity-description',
  classNameBindings: ['hasErrors'],
  validation: Ember.inject.service('validations.activity-description'),
  _initialiseLocationMap: function() {
    const submission = this.get('submission');
    if (!submission.documents) {
      submission.documents = {};
    }

    if (!submission.documents.locationMap) {
      submission.documents.locationMap = {};
    }
  }.on('init'),
  _validate: function() {
    const errors = this.get('validation').validate(this.get('submission'));
    const keys = _.keys(errors);
    this.set('errors', errors);
    this.set('hasErrors', keys.length > 0);
  }.on('init'),
  regulationTypes: _.keys(Constants.REGULATION_TYPES).map((k, index) => {return {value: k, label: Constants.REGULATION_TYPES[k], name: `regulation-type-${index}`};}),
  trueOrFalse: [
    {label: 'Yes', value: true},
    {label: 'No', value: false}
  ],
  readonly: false,
  showReferenceNumber: Ember.computed.or('submission.hasOPP', 'submission.hasEnvironmentMinisterDecision'),
  showReferenceNumberChanged: function() {
    if(!this.get('showReferenceNumber')) {
      Ember.set(this.get('submission'), 'OPPOrEPBCReferenceNumber', null);
    }
  }.observes('showReferenceNumber').on('init'),
  hasOffshoreProjectChanged: Ember.observer('submission.hasOffshoreProject', function() {
    const submission = this.get('submission');
    if (!submission.hasOffshoreProject) {
        Ember.set(submission, 'hasOPP', null);
        Ember.set(submission, 'hasEnvironmentMinisterDecision', null);
    }
  }),
});
