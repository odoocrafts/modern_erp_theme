/** @odoo-module **/

import { Component } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";
import { cookie } from "@web/core/browser/cookie";
import { registry } from "@web/core/registry";

export class DarkModeToggle extends Component {
    static template = "modern_erp_theme.DarkModeToggle";
    static props = {};

    get dark() {
        return cookie.get("color_scheme") === "dark";
    }

    toggle() {
        if (this.dark) {
            cookie.delete("color_scheme");
        } else {
            cookie.set("color_scheme", "dark");
        }
        browser.location.reload();
    }
}

registry.category("systray").add(
    "modern_erp_theme.dark_mode",
    { Component: DarkModeToggle },
    { sequence: 0.5 }
);
