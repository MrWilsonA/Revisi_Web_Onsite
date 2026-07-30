const BASE_URL = 'http://127.0.0.1:8080/api';

const getHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const req = async <T>(path: string, body?: object): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: getHeaders(),
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.err || "Error");
    return data as T;
};

export const reqGet = async <T>(path: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.err || "Error");
    return data as T;
};

export const reqPatch = async <T>(path: string, body: object): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.err || "Error");
    return data as T;
};

export const reqDelete = async <T>(path: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.err || "Error");
    return data as T;
};