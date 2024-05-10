import axios from 'axios';
import Swal from 'sweetalert2';
import "../assets/css/sweetAlertStyle.css";

export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem('access_token'); // Get token from localStorage

        const response = await axios.get('http://localhost:8000/api/users/views/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        
        console.error('Error fetching users:', error);
        return []; // Return an empty array or handle error as appropriate
    }
};
