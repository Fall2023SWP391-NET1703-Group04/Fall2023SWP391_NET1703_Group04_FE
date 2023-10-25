
import { Link, useNavigate } from "react-router-dom";

import './Users.css';
import axios from "axios";
import '/node_modules/primeflex/primeflex.css';
import authHeader from "../AuthHeader/AuthHeader";
import { InputMask } from 'primereact/inputmask';

import React, { useState, useEffect, useRef } from 'react';
import { Tree } from 'primereact/tree';
import Header from "../Header/Header";




export default function Trainer() {
  const navigate = useNavigate();

  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [security, setSecurity] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  const userId = user.data.userId;
  const roleName = user.data.role;

  // img save
  const [isEditingImg, setIsEditingImg] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const defaultImageUrl = "http://localhost:3000/img/default.jpg";

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageName = file.name;
      setEditedUser({ ...editedUser, avatar: imageName });
      setSelectedFile(file);
      setShowSaveButton(true);
    }
  }
  console.log('check page')

  const handleInputChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowSaveButton(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setEditedUser({ ...editedUser, avatar: imageData });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setShowSaveButton(false);
    }
  };


  const apiUrl = `http://localhost:8080/zoo-server/api/v1/user/getUserById/${userId}`;
  useEffect(() => {
    // if (userId === null || userId === undefined) {
    //     window.location.href = '/signin';
    //     return;
    // }

    axios.get(apiUrl, { headers: authHeader() })
      .then((response) => {
        const profileDTO = response.data.data.profileDTO;
        if (profileDTO) {
          setEditedUser(profileDTO);
        }
        setSecurity(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, []);


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {

    axios
      .put(`http://localhost:8080/zoo-server/api/v1/user/updateProfile/${userId}`, editedUser, { headers: authHeader() })
      .then((response) => {
        const updatedProfileDTO = response.data.data.profileDTO;
        if (updatedProfileDTO) {
          setEditedUser(updatedProfileDTO);
        }
        setIsEditing(false);
        alert('Profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };


  const onUpload = (event) => {
    console.log(event.target.files[0].name)
    const name = event.target.name;
    setEditedUser({
      ...editedUser,
      avatar: event.target.files[0].name
    });
  }

  const displayWithDefault = (field, defaultValue = 'Not Provided') => {
    return isEditing ? (
      <input
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-8"
        name={field}
        type="text"
        placeholder={`Enter your ${field}`}
        value={editedUser[field] || ''}
        onChange={handleInputChange}
      />
    ) : (
      <span>{editedUser[field] || defaultValue}</span>
    );
  };


  const displayWithAvatar = (field, defaultValue = 'Not Provided') => {
    return isEditing ? (

      <input
        type="file"
        accept="image/*"
        name="image"
        id="image"
        onChange={onUpload}
      />
    ) : (""
    );

  };

  const displayWithDefaultPhone = (field, defaultValue = 'Not Provided') => {
    const phoneNumber = editedUser[field];

    if (isEditing) {
      return (
        <InputMask
          className="form-control w-8"
          name={field}
          mask="(999) 999-9999"
          value={(phoneNumber !== null && typeof phoneNumber === 'string') ? phoneNumber : ''}
          placeholder="(999) 999-9999"
          onChange={handleInputChange}
        />
      );
    } else {
      return <span>{(phoneNumber !== null && typeof phoneNumber === 'string') ? phoneNumber : defaultValue}</span>;
    }
  };




  const [expandedKeys, setExpandedKeys] = useState({});
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const toast = useRef(null);

  const treeData = [
    {
      key: '1',
      label: 'Events',
      data: 'events', // Thay đổi giá trị data để đại diện cho trang Events
      icon: 'pi pi-fw pi-calendar',
      children: [
        {
          key: '1-0',
          label: (
            <Link to="/training">Manage Animal</Link>
          ),
          data: 'manage-animal',
          icon: 'pi pi-fw pi-calendar-plus',
        },
        {
          key: '1-1',
          label: (
            <Link to="/managediet">Manage Diet</Link>
          ),
          data: 'manage-diet',
          icon: 'pi pi-fw pi-calendar-plus',
        },
        {
          key: '1-2',
          label: (
            <Link to="/animals">View List Animal</Link>
          ),
          data: 'list-animal',
          icon: 'pi pi-fw pi-calendar-plus',
        },
      ],
    },
  ];




  const menu = [
    {
      label: 'View Key',
      icon: 'pi pi-search',
      command: () => {
        toast.current.show({ severity: 'success', summary: 'Node Key', detail: selectedNodeKey });
      },
    },
    {
      label: 'Toggle',
      icon: 'pi pi-cog',
      command: () => {
        let _expandedKeys = { ...expandedKeys };
        if (_expandedKeys[selectedNodeKey]) {
          delete _expandedKeys[selectedNodeKey];
        } else {
          _expandedKeys[selectedNodeKey] = true;
        }

        setExpandedKeys(_expandedKeys);
      },
    },
  ];










  return (

    <div>
      <Header />
      <div className="container-xl px-4 mt-4">

        <hr className="mt-0 mb-4" />
        <div className="grid">
          <div className="col-6">
            <div className="w-full">
              <div className="card ">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center">
                  <div>
                    <img alt="Card" style={{ width: '200px', height: '200px' }} src={`http://localhost:3000/img/${editedUser.avatar}`} />
                    <br />
                    <label htmlFor="updateAnimalImage">Avatar</label>
                    <br />
                    {displayWithAvatar('avatar')}
                  </div>


                </div>


                <div className="small font-italic text-muted mb-4">
                  {editedUser.firstName && editedUser.lastName ? `${editedUser.firstName} ${editedUser.lastName}` : 'Name Not Provided'}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Tree
                value={treeData}
                expandedKeys={expandedKeys}
                onToggle={(e) => setExpandedKeys(e.value)}
                selectionMode="single"
                selectionKeys={selectedNodeKey}
                onSelectionChange={(e) => setSelectedNodeKey(e.value)}
                contextMenuSelectionKey={selectedNodeKey}
                onContextMenuSelectionChange={(e) => setSelectedNodeKey(e.value)}
                onContextMenu={menu}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="card mb-4">
              <div className="card-header">Account Details</div>
              <div className="card-body">
                <form>
                  <div className="field flex align-items-stretch flex-wrap card-container">
                    <label className="mb-1 mr-2 font-bold" htmlFor="inputFirstName">
                      First name:
                    </label>
                    {displayWithDefault('firstName')}
                  </div>
                  <div className="field flex">
                    <label className="mb-1 mr-2 font-bold" htmlFor="inputLastName">
                      Last name:
                    </label>
                    {displayWithDefault('lastName')}
                  </div>
                  <div className="field flex">
                    <label className="mb-1 mr-2 font-bold" htmlFor="inputLocation">
                      Location:
                    </label>
                    {displayWithDefault('address')}
                  </div>

                  <div className="field flex">
                    <label className="mb-1 mr-2 font-bold" htmlFor="inputGender">
                      Gender:
                    </label>
                    {isEditing ? (
                      <select
                        className="form-control w-8"
                        name="gender"
                        value={editedUser.gender || ''}
                        onChange={handleInputChange}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : (
                      <span>{editedUser.gender || 'Not Provided'}</span>
                    )}
                  </div>


                  <div className="field flex">
                    <label className="mb-1 mr-2 font-bold" htmlFor="inputPhone">
                      Phone number:
                    </label>

                    {displayWithDefaultPhone('phoneNumber')}
                  </div>

                  <div className="field flex">
                    <label
                      className="mb-1 mr-2 font-bold"
                      htmlFor="inputEmailAddress"
                    >
                      Email:
                    </label>
                    {security.email || 'Not Provided'}
                  </div>

                  {isEditing ? (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSaveClick}
                    >
                      Save changes
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleEditClick}
                    >
                      Edit Profile
                    </button>
                  )}
                </form>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div >





  );
};


