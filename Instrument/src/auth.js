export function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token; // Renvoie true si le token existe, sinon false
}

export function login(token) {
    localStorage.setItem('authToken', token);
}

export function logout() {
    localStorage.removeItem('authToken');
}