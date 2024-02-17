import axios from 'axios';

const API_URL = 'http://localhost:5000';

class DataBaseService  {
  static async getPuzzles(minRating: number, maxRating: number, numPuzzles: number): Promise<any[]> {
    try {
      const token = localStorage.getItem('accessToken');
      console.log(token)
      if (!token) {
        throw new Error('Access token not found');
      }

      const requestData = {
        min_rating: minRating,
        max_rating: maxRating,
        num_puzzles: numPuzzles
      };

      const response = await axios.post(`${API_URL}/puzzles`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to fetch puzzles');
    }
  }


  static async getUser(): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Access token not found');
      }
  
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to fetch user');
    }
  }

  static async editPassword(oldPassword: string, newPassword: string): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Access token not found');
      }
  
      const response = await axios.post(`${API_URL}/editpassword`, {
        oldPassword,
        newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to update password');
    }
  }

  static async editEmail(oldEmail: string, newEmail: string): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Access token not found');
      }
  
      const response = await axios.post(`${API_URL}/editemail`, {
        oldEmail,
        newEmail
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to update email');
    }
  }

  static async deleteUser(password: string): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Access token not found');
      }
  
      const response = await axios.delete(`${API_URL}/deleteuser`, {
        data: { password }, // Pass password directly here
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to delete user');
    }
  }
  


};



export default DataBaseService;