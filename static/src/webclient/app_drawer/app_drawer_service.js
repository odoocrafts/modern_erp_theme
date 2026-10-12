/** @odoo-module **/

import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";

export const appDrawerService = {
    start() {
        const state = reactive({
            isOpen: false,
            session: 0,
        });
        return {
            state,
            open() {
                state.session += 1;
                state.isOpen = true;
            },
            close() {
                state.isOpen = false;
            },
            toggle() {
                if (state.isOpen) {
                    state.isOpen = false;
                } else {
                    state.session += 1;
                    state.isOpen = true;
                }
            },
        };
    },
};

registry.category("services").add("app_drawer", appDrawerService);
