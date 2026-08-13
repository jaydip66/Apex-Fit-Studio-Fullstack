from django.db.backends.base.base import BaseDatabaseWrapper

# Django चा MySQL Version Check बंद (Bypass) करा
BaseDatabaseWrapper.check_database_version_supported = lambda self: None