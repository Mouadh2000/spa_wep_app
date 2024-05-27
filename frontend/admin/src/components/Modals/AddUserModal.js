import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createUser } from 'Api/userApi';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddUserModal() {

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
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [deletePermission, setDeletePermission] = useState(false);
  const [viewClientPermission, setViewClientPermission] = useState(false);


  const getPermissionLevel = () => {
    if (create && update && deletePermission) {
      return 'Editor';
    } else if (create && update) {
      return 'Refine';
    } else if (create && deletePermission) {
      return 'Edit';
    } else if (update && deletePermission) {
      return 'Emend';
    } else if (create) {
      return 'Create';
    } else if (update) {
      return 'Modify';
    } else if (deletePermission) {
      return 'Delete';
    } else {
      return 'Viewer';
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newUser = await createUser({
        name,
        email,
        password,
        permission_level: getPermissionLevel(),
        view_client_permission: viewClientPermission
      });
      if (newUser) {
        console.log('User added successfully:', newUser);
        setUsername('');
        setEmail('');
        setPassword('');
        setCreate(false);
        setUpdate(false);
        setDeletePermission(false);
        setViewClientPermission(false); // Reset the new checkbox state
        toggleModal();
      } else {
        console.error('Failed to add user.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }
  
  return (
    <>
      <button className="btn-modal btn btn-primary" onClick={toggleModal}>Add User</button>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add User</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" style={inputStyle} value={name} onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
            <div>
              <label>
                <input type="checkbox" checked={create} onChange={() => setCreate(!create)} /> Create
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" checked={update} onChange={() => setUpdate(!update)} /> Update
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" checked={deletePermission} onChange={() => setDeletePermission(!deletePermission)} /> Delete
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" checked={viewClientPermission} onChange={() => setViewClientPermission(!viewClientPermission)} /> View Client Permission
              </label>
            </div>
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </Modal>
    </>
  )
}
