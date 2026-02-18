interface LoginResponse {
  token: string;
}

class AuthService {
  async login(password: string) {
    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (response.status === 401) {
      throw new Error("Invalid password");
    }

    if (!response.ok) {
      throw new Error("Login failed. Please try again.");
    }

    const payload = (await response.json()) as Partial<LoginResponse>;

    if (!payload.token || typeof payload.token !== "string") {
      throw new Error("Invalid login response");
    }

    return payload.token;
  }
}

export const authService = new AuthService();
