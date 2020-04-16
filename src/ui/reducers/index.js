import { store } from 'mage-engine';
import menu from './menu';
import test from './test';

const reducers = store.combineReducers({
    test
});

export default reducers;
