{
    'name': 'Modern ERP Theme',
    'summary': 'Frosted app drawer, global menu search, and a lighter backend',
    'description': """
        Replaces the Community apps dropdown with a translucent app drawer
        and a global menu search. Refreshes navbar, surfaces, colors, and shadows.
    """,
    'version': '17.0.1.0.0',
    'category': 'Themes/Backend',
    'license': 'LGPL-3',
    'depends': ['web'],
    'excludes': [
        'web_enterprise',
        'muk_web_theme',
    ],
    'assets': {
        'web._assets_primary_variables': [
            ('prepend', 'modern_erp_theme/static/src/scss/primary_variables.scss'),
        ],
        'web.assets_backend': [
            'modern_erp_theme/static/src/scss/backend.scss',
            'modern_erp_theme/static/src/webclient/app_drawer/app_drawer_service.js',
            'modern_erp_theme/static/src/webclient/app_drawer/app_drawer.js',
            'modern_erp_theme/static/src/webclient/app_drawer/app_drawer.xml',
            'modern_erp_theme/static/src/webclient/app_drawer/app_drawer.scss',
            'modern_erp_theme/static/src/webclient/navbar/navbar.js',
            'modern_erp_theme/static/src/webclient/navbar/navbar.xml',
            'modern_erp_theme/static/src/webclient/navbar/dark_mode.js',
            'modern_erp_theme/static/src/webclient/navbar/dark_mode.xml',
            'modern_erp_theme/static/src/webclient/navbar/navbar.scss',
        ],
        'web.assets_web_dark': [
            'modern_erp_theme/static/src/scss/backend.dark.scss',
        ],
        'web.assets_frontend': [
            'modern_erp_theme/static/src/scss/login.scss',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
