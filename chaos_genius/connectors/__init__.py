from chaos_genius.connectors.bigquery import BigQueryDb
from chaos_genius.connectors.postgres import PostgresDb
from chaos_genius.connectors.mysql import MysqlDb

DB_CLASS_MAPPER = {
    "Postgres": PostgresDb,
    "MySQL": MysqlDb,
    "BigQuery": BigQueryDb,
}


def get_sqla_db_conn(data_source_info=None, connection_config=None):
    database = None
    if not (data_source_info or connection_config):
        raise Exception("Either provide the data source info or the database connection config")
    if data_source_info:
        ds_type = data_source_info["connection_type"]
        ds_third_party = data_source_info["is_third_party"]
        if ds_third_party is False:
            db_class = DB_CLASS_MAPPER[ds_type]
            db_connection_info = data_source_info["sourceConfig"]["connectionConfiguration"]
            database = db_class(connection_info=db_connection_info)
        else:
            # TODO: Make this configurable from the integration constants
            db_class = DB_CLASS_MAPPER["Postgres"]
            db_connection_info = data_source_info["destinationConfig"]["connectionConfiguration"]
            database = db_class(connection_info=db_connection_info)
    elif connection_config:
        ds_type = connection_config["connection_type"]
        db_connection_info = connection_config["connectionConfiguration"]
        db_class = DB_CLASS_MAPPER[ds_type]
        database = db_class(connection_info=db_connection_info)
    return database


def get_metadata(data_source_info, from_query=False, query=''):
    db_tables = data_source_info["dbConfig"]["tables"]
    db_connection = get_sqla_db_conn(data_source_info=data_source_info)
    db_connection.init_inspector()
    metadata = {
        "tables": {
            "query": {
                "table_columns": []
            }
        }
    }
    all_schema = {}
    err_msg = ''
    try:
        if not from_query:
            all_schema = db_connection.get_schema_metadata(tables=db_tables)
        else:
            all_schema = db_connection.get_schema_metadata_from_query(query)
    except Exception as err:
        print(err)
        err_msg = str(err)

    if all_schema:
        metadata = all_schema
    return metadata, err_msg


def test_connection(data_source_info):
    db_connection = get_sqla_db_conn(connection_config=data_source_info)
    status, message = db_connection.test_connection()
    return status, message