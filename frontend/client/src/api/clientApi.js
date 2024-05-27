import axios from "axios";

export const getAllClients = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/client/views');
        return response.data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        return []; // Return an empty array or handle error as appropriate
    }
};