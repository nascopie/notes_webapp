# Notes Management API

This guide will help you set up, deploy, and secure the Notes Management API built with FastAPI. It will also explain how to interact with the API.

## Installation Requirements

1. Clone the repository to your local machine.
   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Create a virtual environment (optional but recommended):
   ```sh
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required dependencies from `requirements.txt`:
   ```sh
   pip install -r requirements.txt
   ```

## Deploying the Server

### On Linux

1. Ensure Python 3 and `pip` are installed.
2. Run the server using `uvicorn`:
   ```sh
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - Replace `main` with the name of your Python file if different.
   - The `--reload` flag is useful for development; omit it for production.

3. To keep the server running continuously, consider using a process manager like `systemd` or `supervisord`.

#### Using systemd to Deploy the Server

1. Create a `systemd` service file to manage the server. Open a terminal and create a new file:
   ```sh
   sudo nano /etc/systemd/system/notes-api.service
   ```

2. Add the following configuration to the file:
   ```ini
   [Unit]
   Description=Notes Management API
   After=network.target

   [Service]
   User=<your_username>
   Group=www-data
   WorkingDirectory=/path/to/your/repository
   ExecStart=/path/to/your/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000

   [Install]
   WantedBy=multi-user.target
   ```
   - Replace `<your_username>` with your Linux username.
   - Replace `/path/to/your/repository` with the absolute path to the project directory.
   - Replace `/path/to/your/venv/bin/uvicorn` with the path to the `uvicorn` executable inside your virtual environment.

3. Reload the `systemd` daemon to recognize the new service:
   ```sh
   sudo systemctl daemon-reload
   ```

4. Start the Notes Management API service:
   ```sh
   sudo systemctl start notes-api
   ```

5. To enable the service to start on boot:
   ```sh
   sudo systemctl enable notes-api
   ```

6. Check the status of the service:
   ```sh
   sudo systemctl status notes-api
   ```

### On Windows

1. Open PowerShell or Command Prompt.
2. Run the server using `uvicorn`:
   ```cmd
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - Replace `main` with the name of your Python file if different.
3. For long-term deployment, you can use tools like NSSM (Non-Sucking Service Manager) to run the server as a Windows service.

## Securing the Server

1. **Use HTTPS**: Ensure your API is served over HTTPS. This can be achieved by using a reverse proxy like Nginx or Apache, which can handle SSL certificates.
2. **Environment Variables**: Store sensitive information like `SECRET_KEY` in environment variables rather than hardcoding them.
3. **Rate Limiting**: Use tools like `fastapi-limiter` to prevent abuse by rate-limiting the number of requests.
4. **Authentication**: Make sure all endpoints that modify data are protected using OAuth2 or other authentication methods.
5. **CORS**: If your API is accessed by other domains, ensure you use appropriate CORS settings to restrict access.
6. **Firewall**: Use a firewall to allow only trusted IP addresses to connect to your server.
7. **Update Dependencies**: Regularly update Python packages to mitigate vulnerabilities.

## Consuming the API

### Accessing the API Documentation

1. Once the server is running, you can access the interactive API documentation (Swagger UI) at:
   - [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
2. You can also use the ReDoc documentation at:
   - [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Authentication

1. To interact with secured endpoints, you need to obtain an access token.
2. Use the `/token` endpoint by sending a POST request with `username` and `password`.
   Example with `curl`:
   ```sh
   curl -X POST "http://127.0.0.1:8000/token" -d "username=<your_username>&password=<your_password>"
   ```
3. The response will include an `access_token`, which needs to be included in the Authorization header for subsequent requests:
   ```sh
   -H "Authorization: Bearer <access_token>"
   ```

### CRUD Operations

- **Create a Note**: Send a POST request to `/notes` with the `title`, `content`, and `is_private` fields.
- **Get Notes**: Send a GET request to `/notes` to retrieve notes. Only public notes or notes belonging to the authenticated user will be returned.
- **Update a Note**: Use the PUT request to `/notes/{note_id}` with the fields you want to update.
- **Delete a Note**: Use the DELETE request to `/notes/{note_id}` to delete a note.

### Admin Access

- If you are an admin, you can access the logs by sending a GET request to `/logs` to monitor activities.

## Additional Notes

- Make sure the server is protected with appropriate firewalls and security settings when deployed in production.
- Consider using tools like Docker to containerize the application for easier deployment and scalability.

