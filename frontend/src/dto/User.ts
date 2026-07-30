export interface User{
	email: string;
	username: string;
	password: string;
    role: 'customer' | 'admin';
}

export interface LoginResponse{
	access_token: string;
	refresh_token: string;
	user: User;
}

export interface RegisterResponse{
	message: string;
}

