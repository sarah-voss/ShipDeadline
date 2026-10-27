import test from 'node:test';
import assert from 'node:assert/strict';
import * as state from '../js/features/calculator/state.js';

test('correcting either vehicle clears a previously duplicated type', () => {
 state.calculatorState.shipmentDetails.fullRoad.vehicles=[{id:1,type:'standard-truck',status:'valid'},{id:2,type:'',status:'idle'}];
 state.setFullRoadVehicleType(1,'standard-truck');
 assert.equal(state.isFullRoadComplete(),false);
 state.setFullRoadVehicleType(0,'van');
 assert.equal(state.isFullRoadComplete(),true);
 assert.equal(state.hasDuplicateFullRoadVehicles(),false);
});
test('removing the earlier duplicate restores the remaining vehicle validity', () => {
 state.calculatorState.shipmentDetails.fullRoad.vehicles=[{id:1,type:'standard-truck',status:'valid'},{id:2,type:'standard-truck',status:'error'}];
 state.removeFullRoadVehicle(1);
 assert.equal(state.isFullRoadComplete(),true);
 assert.equal(state.getSelectedVehicles().length,1);
});
