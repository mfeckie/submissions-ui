import { moduleForModel, test } from 'ember-qunit';

moduleForModel('activity-contact', 'Unit | Model | activity contact', {
  // Specify the other units that are required for this test.
  needs: ['model:address']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});