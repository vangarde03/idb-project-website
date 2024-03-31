import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database connection details from environment variables
DB_USERNAME = os.getenv("DATABASE_USERNAME")
DB_PASSWORD = os.getenv("DATABASE_PASSWRD")
DB_HOST = os.getenv("DATABASE_HOST")
DB_NAME = "proj1part2"

# Function to execute SQL query


def execute_query(query):
    try:
        # Connect to the database
        conn = psycopg2.connect(
            dbname=DB_NAME, user=DB_USERNAME, password=DB_PASSWORD, host=DB_HOST
        )

        # Create a cursor object
        cur = conn.cursor()

        # Execute the query
        cur.execute(query)

        # Fetch all rows
        rows = cur.fetchall()

        # Close cursor and connection
        cur.close()
        conn.close()

        return rows
    except Exception as e:
        print("Error executing query:", e)
        return None


# Example usage
if __name__ == "__main__":
    # Example query
    query = "SELECT * FROM your_table;"

    # Execute the query
    result = execute_query(query)

    # Print the result
    print(result)
