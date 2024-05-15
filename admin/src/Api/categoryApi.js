import axios from 'axios';
import Swal from 'sweetalert2';
import "../assets/css/sweetAlertStyle.css";

export const getAllCategories = async () => {
    try {
        const token = localStorage.getItem('access_token'); // Get token from localStorage

        const response = await axios.get('http://localhost:8000/api/category/views', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return []; // Return an empty array or handle error as appropriate
    }
};

export const createCategory = async (categoryData) => {
    try {
        const token = localStorage.getItem('access_token');
        
        const response = await axios.post('http://localhost:8000/api/category/create', categoryData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Category added successfully!',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        }
        
        return response.data;
    } catch (error) {
        if (error.response.status === 403) {
            Swal.fire({
                icon: 'error',
                title: 'Permission Denied',
                text: 'You do not have permission to perform this action.',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        }
        
        throw error;
    }
};



export const updateCategory = async (categoryId, categoryData) => {
    try {
        const token = localStorage.getItem('access_token');
        console.log(userData);
        const response = await axios.put(`http://localhost:8000/api/category/edit/${categoryId}`, categoryData, {
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
                text: 'You do not have permission to update this category.',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        } else if (error.response) {
            console.error('Error updating category:', error.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || 'An error occurred while updating category',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        } else {
            console.error('Error updating category:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating category',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        }
        return null; // Handle error as appropriate
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        const token = localStorage.getItem('access_token');
        
        const response = await axios.delete(`http://localhost:8000/api/category/delete/${categoryId}`, {
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
                text: 'You do not have permission to delete this category.'
            });
        } else {
            // Handle other errors
            throw error;
        }
    }
};

