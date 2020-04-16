import {
    CLOSE_MENU,
    OPEN_MENU
} from './types';

export const openMenu = () => ({
    type: OPEN_MENU
});

export const closeMenu = () => ({
    type: CLOSE_MENU
});
