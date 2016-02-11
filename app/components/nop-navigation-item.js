import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
  initialiseProperties: function() {
    const keyName = this.get('item').key;
    this.set('visited', Ember.computed(`submissionStatus.${keyName}`, function () {
      return this.get('submissionStatus').visited(this.get('item').key);
    }));
    this.set('errors', Ember.computed(`submissionStatus.${keyName}`, function() {
      return this.get('submissionStatus').hasErrors(this.get('item').key);
    }));
  }.on('init'),
  tagName: 'nop-navigation-item',
  submissionStatus: Ember.inject.service(),
  classNameBindings: ['current', 'complete', 'errors'],
  complete: Ember.computed('visited', 'errors', function() {
    return this.get('visited') && !this.get('errors');
  })
});
