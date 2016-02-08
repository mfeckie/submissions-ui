import Ember from 'ember';

export default Ember.Service.extend({
  validate(entity) {
    const errors = {};

    if (!entity.documents || !entity.documents.environmentPlan || !entity.documents.environmentPlan.token) {
      errors['environmentPlan.token'] = 'An Environment Plan must be uploaded with your submission';
    } else {
      if (Ember.isBlank(entity.documents.environmentPlan.name)) {
        errors['environmentPlan.name'] = 'The submitted Environment Plan document must have a name';
      }
    }

    return errors;
  }
});