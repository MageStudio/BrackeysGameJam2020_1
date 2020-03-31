import { store } from 'mage-engine';
import test from './test';

const reducers = store.combineReducers({
    test
});

export default reducers;
