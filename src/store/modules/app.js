
import { TOGGLE_THEME, DEFAULT_COLOR } from '@/store/mutation-types'
import store from 'store'
import config from '../../../defaultSettings'

const  app = {
    state: {
        theme: config.theme,
        fixedHeader: false,
        fixSiderbar: false,
        autoHideHeader: false,
        color: config.color,
    },
    mutations: {
        [TOGGLE_THEME]: (state, theme) => {
            store.set(TOGGLE_THEME, theme);
            state.theme = theme;
        },
        [DEFAULT_COLOR]: (state, color) => {
            store.set(DEFAULT_COLOR, color);
            state.color = color
        }
    },
    actions: {
        ToggleTheme({ commit }, theme) {
            commit(TOGGLE_THEME, theme)
        },
        ToggleColor({ commit }, color) {
            commit(DEFAULT_COLOR, color)
        }
    }
}

export default app;