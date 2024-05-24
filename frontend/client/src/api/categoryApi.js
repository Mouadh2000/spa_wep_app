import axios from "axios";

export const getAllCategories = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/category/views');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return []; // Return an empty array or handle error as appropriate
    }
};