/** @odoo-module **/

import { Component, onMounted, onWillUnmount, useEffect, useRef, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { fuzzyLookup } from "@web/core/utils/search";
import { computeAppsAndMenuItems } from "@web/webclient/menus/menu_helpers";
import { registry } from "@web/core/registry";

const FALLBACK_ICON = "/base/static/description/icon.png";

function toIconSrc(webIconData) {
    const value = String(webIconData || "").trim();
    if (!value || value.includes("web_enterprise")) {
        return FALLBACK_ICON;
    }
    if (value.startsWith("data:image") || value.startsWith("/")) {
        return value;
    }
    const prefix = value.startsWith("P")
        ? "data:image/svg+xml;base64,"
        : "data:image/png;base64,";
    return prefix + value.replace(/\s/g, "");
}

export class AppDrawerPanel extends Component {
    static template = "modern_erp_theme.AppDrawerPanel";
    static props = {};

    setup() {
        this.appDrawer = useService("app_drawer");
        this.menuService = useService("menu");
        this.state = useState({ query: "", activeIndex: 0 });
        this.searchRef = useRef("search");
        this.root = useRef("root");
        try {
            this.catalog = computeAppsAndMenuItems(this.menuService.getMenuAsTree("root"));
        } catch (error) {
            console.error("Modern ERP theme could not read the menu tree.", error);
            this.catalog = { apps: [], menuItems: [] };
        }
        onMounted(() => {
            document.body.classList.add("o_met_drawer_open");
            this.searchRef.el?.focus();
        });
        onWillUnmount(() => {
            document.body.classList.remove("o_met_drawer_open");
        });
        useEffect(
            () => {
                const active = this.root.el?.querySelector(".o_met_active");
                active?.scrollIntoView({ block: "nearest" });
            },
            () => [this.state.activeIndex]
        );
    }

    get query() {
        return this.state.query.trim();
    }

    get matchedApps() {
        if (!this.query) {
            return this.catalog.apps;
        }
        return fuzzyLookup(this.query, this.catalog.apps, (menu) => menu.label).slice(0, 8);
    }

    get matchedMenus() {
        if (!this.query) {
            return [];
        }
        return fuzzyLookup(this.query, this.catalog.menuItems, (menu) =>
            (menu.parents + " / " + menu.label).split("/").reverse().join("/")
        ).slice(0, 20);
    }

    get flatEntries() {
        if (!this.query) {
            return this.catalog.apps;
        }
        return [...this.matchedApps, ...this.matchedMenus];
    }

    iconFor(entry) {
        if (entry.webIconData && !String(entry.webIconData).includes("web_enterprise")) {
            return { src: toIconSrc(entry.webIconData) };
        }
        if (entry.webIcon && entry.webIcon.iconClass) {
            return { webIcon: entry.webIcon };
        }
        if (entry.menuID) {
            const app = this.catalog.apps.find((item) => item.id === entry.menuID);
            if (app && app !== entry) {
                return this.iconFor(app);
            }
        }
        return { src: FALLBACK_ICON };
    }

    iconClass(entry) {
        const icon = this.iconFor(entry);
        return icon.webIcon ? `o_met_icon o_met_fa_icon ${icon.webIcon.iconClass}` : "";
    }

    iconStyle(entry) {
        const icon = this.iconFor(entry);
        if (!icon.webIcon) {
            return "";
        }
        return `color:${icon.webIcon.color};background-color:${icon.webIcon.backgroundColor};`;
    }

    onInput(ev) {
        this.state.query = ev.target.value;
        this.state.activeIndex = 0;
    }

    columnCount() {
        const grid = this.root.el?.querySelector(".o_met_grid");
        if (!grid) {
            return 1;
        }
        const columns = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean);
        return columns.length || 1;
    }

    onKeydown(ev) {
        if (ev.key === "Escape") {
            ev.preventDefault();
            ev.stopPropagation();
            this.appDrawer.close();
            return;
        }
        if (ev.key === "Tab") {
            this.trapFocus(ev);
            return;
        }
        const entries = this.flatEntries;
        if (!entries.length) {
            return;
        }
        if (ev.key === "Enter") {
            if (ev.target.closest(".o_met_app, .o_met_result")) {
                return;
            }
            ev.preventDefault();
            const current = entries[this.state.activeIndex] || entries[0];
            this.select(current);
            return;
        }
        const step = this.query ? 1 : this.columnCount();
        let delta = 0;
        if (ev.key === "ArrowDown") {
            delta = step;
        } else if (ev.key === "ArrowUp") {
            delta = -step;
        } else if (!this.query && ev.key === "ArrowRight") {
            delta = 1;
        } else if (!this.query && ev.key === "ArrowLeft") {
            delta = -1;
        }
        if (!delta) {
            return;
        }
        ev.preventDefault();
        const next = this.state.activeIndex + delta;
        if (next >= 0 && next < entries.length) {
            this.state.activeIndex = next;
        }
    }

    trapFocus(ev) {
        const focusables = [
            ...this.root.el.querySelectorAll("input, button, [href], [tabindex]:not([tabindex='-1'])"),
        ].filter((el) => !el.disabled);
        if (!focusables.length) {
            return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (ev.shiftKey && document.activeElement === first) {
            ev.preventDefault();
            last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
            ev.preventDefault();
            first.focus();
        }
    }

    onBackdropClick(ev) {
        if (ev.target.closest(".o_met_search, .o_met_results, .o_met_app")) {
            return;
        }
        this.appDrawer.close();
    }

    select(entry) {
        const menu = this.menuService.getMenu(entry.id);
        this.appDrawer.close();
        if (menu) {
            this.menuService.selectMenu(menu);
        }
    }
}

export class AppDrawer extends Component {
    static template = "modern_erp_theme.AppDrawer";
    static components = { AppDrawerPanel };
    static props = {};

    setup() {
        // useState subscribes this component to the shared reactive object.
        // A plain read of service.state does not, in this Owl version.
        this.appDrawer = useState(useService("app_drawer").state);
    }
}

registry.category("main_components").add("modern_erp_theme.app_drawer", {
    Component: AppDrawer,
});
