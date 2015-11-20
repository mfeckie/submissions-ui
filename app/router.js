import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('styleguide');
  this.route('prototype/activity-description');
  this.route('prototype/person-details');
});

export default Router;
