import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createCategory } from "Api/categoryApi";

export default function AddCategoryModal() {
    const inputStyle = {
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        borderRight: 'none',
        borderTop: 'none',
        borderLeft: 'none',
        outline: 'none',
        '&:hover': {
            borderColor: 'rgba(0, 0, 0, 0.1)'
        },
        marginBottom: '20px'
    };

    const [modal, setModal] = useState(false);
    const [categoryData, setCategoryData] = useState({
        category_name: '',
        description: '',
        image: null
    });

    const toggleModal = () => {
        setModal(!modal);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('category_name', categoryData.category_name);
            formData.append('description', categoryData.description);
            formData.append('image', categoryData.image);

            const newCategory = await createCategory(formData);
            setCategoryData({
                category_name: '',
                description: '',
                image: null
            });
            toggleModal();
        } catch (error) {
            console.error('Error adding category:', error);
        }
    }

    const handleImageChange = (event) => {
        const uploadedImage = event.target.files[0];
        setCategoryData({ ...categoryData, image: uploadedImage });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCategoryData({ ...categoryData, [name]: value });
    }

    return (
        <>
            <button className="btn-modal btn btn-primary" onClick={toggleModal}>Add Category</button>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Add Category</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Category Name"
                            style={inputStyle}
                            name="category_name"
                            value={categoryData.category_name}
                            onChange={handleChange}
                        />
                        <textarea
                            type="text"
                            placeholder="Description"
                            style={inputStyle}
                            name="description"
                            value={categoryData.description}
                            onChange={handleChange}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </form>
                </ModalBody>
                <ModalFooter>
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Add</button>
                </ModalFooter>
            </Modal>
        </>
    )
}
