import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_USERNAME = os.getenv("DATABASE_USERNAME")
DB_PASSWORD = os.getenv("DATABASE_PASSWRD")
DB_HOST = os.getenv("DATABASE_HOST")
DB_NAME = "proj1part2"


def execute_query(query):
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME, user=DB_USERNAME, password=DB_PASSWORD, host=DB_HOST
        )
        cur = conn.cursor()

        if query.strip().upper().startswith('SELECT'):
            cur.execute(query)
            rows = cur.fetchall()
            cur.close()
            conn.close()
            return rows
        elif query.strip().upper().startswith('INSERT'):
            cur.execute(query)
            conn.commit()
            cur.close()
            conn.close()
            return {'message': 'Query executed successfully'}
        elif query.strip().upper().startswith('DELETE'):  # Handle DELETE queries
            cur.execute(query)
            conn.commit()
            cur.close()
            conn.close()
            return {'message': 'DELETE query executed successfully'}
        else:
            return {'error': 'Unsupported query type'}

    except Exception as e:
        print("Error executing query:", e)
        return {'error': str(e)}


if __name__ == "__main__":
    query = "SELECT * FROM your_table;"
    result = execute_query(query)
    print(result)
