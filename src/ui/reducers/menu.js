import {
    OPEN_MENU,
    CLOSE_MENU
} from '../actions/types';

const DEFAULT_STATE = {
    menuopen: false
};

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case OPEN_MENU:
            return {
                ...state,
                menuopen: true
            };
        case CLOSE_MENU:
            return {
                ...state,
                menuopen: false
            };
        default:
            return state;
    }
};
