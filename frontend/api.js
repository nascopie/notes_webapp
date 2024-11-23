class API {
    constructor() {
        this.baseUrl = "http://localhost:8000";
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.baseUrl}/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username,
                    password,
                }),
            });
            if (!response.ok) {
                throw new Error("Invalid username or password");
            }
            const data = await response.json();
            this.accessToken = data.access_token;
            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    async register(username, fullName, email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    full_name: fullName,
                    email,
                    password,
                    role: "user",
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to register user");
            }
            return await response.json();
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    }

    async createNote(title, content, isPrivate) {
        try {
            const response = await fetch(`${this.baseUrl}/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.accessToken}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    is_private: isPrivate,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to create note");
            }
            return await response.json();
        } catch (error) {
            console.error("Create note error:", error);
            throw error;
        }
    }

    async getNotes() {
        try {
            const response = await fetch(`${this.baseUrl}/notes`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch notes");
            }
            return await response.json();
        } catch (error) {
            console.error("Get notes error:", error);
            throw error;
        }
    }

    async deleteNote(noteId) {
        try {
            const response = await fetch(`${this.baseUrl}/notes/${noteId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete note");
            }
            return await response.json();
        } catch (error) {
            console.error("Delete note error:", error);
            throw error;
        }
    }

    async fetchLogs() {
        try {
            const response = await fetch(`${this.baseUrl}/logs`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch logs");
            }
            return await response.json();
        } catch (error) {
            console.error("Fetch logs error:", error);
            throw error;
        }
    }
}

export default API;
