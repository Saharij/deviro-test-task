import { makeAutoObservable, runInAction } from "mobx";

import { authService } from "../services/authService";

const AUTH_TOKEN_KEY = "auth_token";

export class AuthStore {
  token: string | null = localStorage.getItem(AUTH_TOKEN_KEY);
  isSubmitting = false;
  errorMessage = "";

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return Boolean(this.token);
  }

  async login(password: string) {
    this.isSubmitting = true;
    this.errorMessage = "";

    try {
      const token = await authService.login(password);

      runInAction(() => {
        this.token = token;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      });
    } catch (error) {
      runInAction(() => {
        this.errorMessage =
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.";
      });
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  }

  logout() {
    this.token = null;
    this.errorMessage = "";
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export const authStore = new AuthStore();
