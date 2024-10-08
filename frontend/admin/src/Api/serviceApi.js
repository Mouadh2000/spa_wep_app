import axios from 'axios';
import Swal from 'sweetalert2';
import "../assets/css/sweetAlertStyle.css";

export const getAllServices = async () => {
    try {
        const token = localStorage.getItem('access_token'); // Get token from localStorage

        const response = await axios.get('http://localhost:8000/api/service/views', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return []; // Return an empty array or handle error as appropriate
    }
};

export const createService = async (serviceData) => {
    try {
        const token = localStorage.getItem('access_token');
        
        const response = await axios.post('http://localhost:8000/api/service/create', serviceData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Service added successfully!',
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



export const updateService = async (serviceId, serviceData) => {
    try {
        const token = localStorage.getItem('access_token');
        console.log(serviceData);
        const response = await axios.put(`http://localhost:8000/api/service/edit/${serviceId}`, serviceData, {
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
                text: 'You do not have permission to update this service.',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        } else if (error.response) {
            console.error('Error updating service:', error.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || 'An error occurred while updating service',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        } else {
            console.error('Error updating service:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating service',
                customClass: {
                    container: 'custom-swal-container' // Use custom class
                }
            });
        }
        return null; // Handle error as appropriate
    }
};

export const deleteService = async (serviceId) => {
    try {
        const token = localStorage.getItem('access_token');
        
        const response = await axios.delete(`http://localhost:8000/api/service/delete/${serviceId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            Swal.fire({
                icon: 'error',
                title: 'Forbidden',
                text: 'You do not have permission to delete this service.'
            });
        } else {
            throw error;
        }
    }
};

