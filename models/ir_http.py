# -*- coding: utf-8 -*-

from odoo import models
from odoo.http import request


class IrHttp(models.AbstractModel):
    _inherit = "ir.http"

    def color_scheme(self):
        """Community 19 always returns light and ignores the color_scheme cookie.

        The systray toggle sets that cookie and reloads. web.webclient_bootstrap
        includes web.assets_web_dark only when this method returns "dark".
        """
        scheme = super().color_scheme()
        try:
            cookies = request.httprequest.cookies
        except RuntimeError:
            return scheme
        if cookies.get("color_scheme") == "dark":
            return "dark"
        return scheme
