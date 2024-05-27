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

export const getAllClients = async () => {
    try {
        const token = localStorage.getItem('access_token'); // Get token from localStorage

        const response = await axios.get('http://localhost:8000/api/clients/views/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        return []; // Return an empty array or handle error as appropriate
    }
};

export const createUser = async (userData) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post('http://localhost:8000/api/users/create', userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User added successfully!',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        }
        
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data;
            if (error.response.status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Permission Denied',
                    text: 'You do not have permission to perform this action',
                    customClass: {
                        container: 'custom-swal-container' // Use custom class
                    }
                });
            } else if (errorMessage.errors && errorMessage.errors.email) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage.errors.email[0], // Access the email error message
                    customClass: {
                        container: 'custom-swal-container' // Use custom class
                    }
                });
            } else if (errorMessage.errors && errorMessage.errors.password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Password should be at least 8 characters long.",
                    customClass: {
                        container: 'custom-swal-container' // Use custom class
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while adding the user',
                    customClass: {
                        container: 'custom-swal-container' // Use custom class
                    }
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while adding the user',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        }
        throw error;
    }
};


export const updateUser = async (userId, userData) => {
    try {
        const token = localStorage.getItem('access_token');
        console.log(userData);
        const response = await axios.put(`http://localhost:8000/api/users/edit/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });        
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User updated successfully!',
            customClass: {
                container: 'custom-swal-container' // Use custom class
            }
        });
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            // Handle 403 error
            Swal.fire({
                icon: 'error',
                title: 'Forbidden',
                text: 'You do not have permission to update this user.',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        } else if (error.response) {
            console.error('Error updating user:', error.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || 'An error occurred while updating user',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        } else {
            console.error('Error updating user:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating user',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        }
        return null; // Handle error as appropriate
    }
};

export const deleteUser = async (userId) => {
    try {
        const token = localStorage.getItem('access_token');
        
        const response = await axios.delete(`http://localhost:8000/api/users/delete/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            // Handle 403 error
            Swal.fire({
                icon: 'error',
                title: 'Forbidden',
                text: 'You do not have permission to delete this user.'
            });
        } else {
            // Handle other errors
            throw error;
        }
    }
};

