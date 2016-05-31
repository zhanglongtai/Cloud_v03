import { createStore } from 'redux';
import { updateModelReducer } from '../reducers';
import { updateDirReducer } from '../reducers';
import { updateDirDataReducer } from '../reducers';

let updateModelStore = createStore(updateModelReducer);
let updateDirStore = createStore(updateDirReducer);
let updateDirDataStore = createStore(updateDirDataReducer);

export {
	updateModelStore,
	updateDirStore,
	updateDirDataStore,
};
