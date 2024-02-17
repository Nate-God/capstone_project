import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

interface User {
    username: string;
    email: string;
}

class AuthService {
    static async register(username: string, email: string, password: string): Promise<User> {
        console.log(username, email, password)
        try {
            const response = await axios.post<User>(
                `${API_URL}/register`,
                {
                    username: username,
                    email: email,
                    password: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',  
                    },
                }
            );
            localStorage.setItem('accessToken', response.data.access_token);
            console.log("I'm the register response\n",response.data)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async login(username: string, password: string): Promise<User> {
        console.log(username, password)
        try {
            const response = await axios.post<User>(
                `${API_URL}/login`,
                {
                    username: username,
                    password: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response.data)
            localStorage.setItem('accessToken', response.data.access_token);
            console.log(localStorage.getItem('accessToken'))
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static logout(): void {
        localStorage.removeItem('accessToken');
    }
}

export default AuthService;