
export const authService = {
  login: (username: string) => {
    localStorage.setItem('varp_active_user', username);
  },
  logout: () => {
    localStorage.removeItem('varp_active_user');
  },
  getCurrentUser: () => {
    return localStorage.getItem('varp_active_user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('varp_active_user');
  }
};
