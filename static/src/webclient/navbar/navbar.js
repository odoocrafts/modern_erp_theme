/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { NavBar } from "@web/webclient/navbar/navbar";

import "@modern_erp_theme/webclient/app_drawer/app_drawer_service";

patch(NavBar.prototype, {
    setup() {
        super.setup();
        this.appDrawer = useService("app_drawer");
    },

    openAppDrawer() {
        this.appDrawer.open();
    },
});
