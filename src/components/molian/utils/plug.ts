import {
    langInstall
} from './lang'
import {
    compsInstall
} from './compsConfig'
import { uiMapping } from './defaultData'
import type { App } from 'vue'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import ContextMenu from '@imengyu/vue3-context-menu';
import VConsole from 'vconsole';
console.log(`%c无界魔方%cOmni Magic Cube V1.0.0%c
%cTo:墨联墨客`,
    'background: #2D74FF; color: #fff; border-radius:3px;padding:4px 8px;font-size:14px;font-weight:bold;',
    'background: #5b92ff; color: #fff; border-radius:3px;padding:4px 8px;margin-top:5px;font-size:14px;',
    '',
    'background: #5b92ff; color: #fff; border-radius:3px;padding:4px 8px;margin-top:5px;font-size:12px;',
)

export default {
    install(app: App<any>, options: any = {
        customComps: {}
    }) {
        uiMapping.useUI = options.useUI || uiMapping.useUI
        if (!!options.usePrefix) {
            const uiIndex = uiMapping.data.findIndex(item => item.name === uiMapping.useUI)
            if (uiIndex > -1) {
                uiMapping.data[uiIndex].prefix = options.usePrefix
            }
        }
        uiMapping.usePrefix = options.usePrefix || null
        if (options.useData) {
            uiMapping.data = options.useData
        }
        langInstall(app)
        compsInstall(app, options.compsConfig)


        // 注册右键菜单组件
        app.use(ContextMenu);
        const { showContextMenu, closeContextMenu, transformMenuPosition, isAnyContextMenuOpen } = ContextMenu
        app.provide('cmdMenu', {
            showMenu: showContextMenu,
            hideMenu: closeContextMenu,
            moveMenu: transformMenuPosition,
            isOpenedMenu: isAnyContextMenuOpen
        })
        if(!!uiMapping.debug){
            const vConsole = new VConsole();
        }
    }
}