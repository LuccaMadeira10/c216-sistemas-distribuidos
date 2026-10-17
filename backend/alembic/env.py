from logging.config import fileConfig

from sqlalchemy import create_engine, pool

from alembic import context
from app.core.config import DATABASE_URL
from app.models.item import Item

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# nos testes, a URL aponta para um banco separado
url = config.get_main_option("sqlalchemy.url") or DATABASE_URL
target_metadata = Item.metadata


def run_migrations_offline():
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    engine = create_engine(url, poolclass=pool.NullPool)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()
    engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
