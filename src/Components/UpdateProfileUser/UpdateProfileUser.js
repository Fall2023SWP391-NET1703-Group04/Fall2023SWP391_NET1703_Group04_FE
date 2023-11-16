import { Container } from "react-bootstrap";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import axios from "axios";
import authHeader from "../AuthHeader/AuthHeader";
import { Tree } from "primereact/tree";
import { Link, useNavigate } from "react-router-dom";
import { InputMask } from "primereact/inputmask";
import "./UpdateProfileUser.css";
const UpdateProfileUser = () => {
  const [validated, setValidated] = useState(false);
  const [userData, setUserData] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.data.userId;
  console.log(userId);
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `http://localhost:8080/zoo-server/api/v1/user/getUserById/${userId}`,
          {
            headers: authHeader(),
          }
        );
        // Assuming the API returns user data as JSON
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);
  console.log(userData);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <>
      <ProFileUser userData={userData} />
      <Footer />
    </>
  );
};

const ProFileUser = (props) => {
  const navigate = useNavigate();

  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [security, setSecurity] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

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
  };
  console.log("check page");

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

    axios
      .get(apiUrl, { headers: authHeader() })
      .then((response) => {
        const profileDTO = response.data.data.profileDTO;
        if (profileDTO) {
          setEditedUser(profileDTO);
        }
        setSecurity(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  const [originalUserData, setOriginalUserData] = React.useState({});
  const handleEditClick = () => {
    setOriginalUserData(editedUser);
    setIsEditing(true);

  };

  const handleSaveClick = () => {
    axios
      .put(
        `http://localhost:8080/zoo-server/api/v1/user/updateProfile/${userId}`,
        editedUser,
        { headers: authHeader() }
      )
      .then((response) => {
        const updatedProfileDTO = response.data.data.profileDTO;
        if (updatedProfileDTO) {
          setEditedUser(updatedProfileDTO);
        }
        setIsEditing(false);
        alert("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile");
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
    const name = event.target.name;
    setEditedUser({
      ...editedUser,
      avatar: event.target.files[0].name,
    });
  };
  const handleCancelClick = () => {
    // Khôi phục dữ liệu về trạng thái ban đầu
    setEditedUser(originalUserData);
    setIsEditing(false);
  };
  const displayWithDefault = (field, defaultValue = 'Not Provided') => {
    return isEditing ? (
      <input
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
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

  const displayWithAvatar = (field, defaultValue = "Not Provided") => {
    return isEditing ? (
      <input
        type="file"
        accept="image/*"
        name="image"
        id="image"
        onChange={onUpload}
      />
    ) : (
      ""
    );
  };

  const displayWithDefaultPhone = (field, defaultValue = "Not Provided") => {
    const phoneNumber = editedUser[field];

    if (isEditing) {
      return (
        <InputMask
          className="form-control w-8"
          name={field}
          mask="(999) 999-9999"
          value={
            phoneNumber !== null && typeof phoneNumber === "string"
              ? phoneNumber
              : ""
          }
          placeholder="(999) 999-9999"
          onChange={handleInputChange}
        />
      );
    } else {
      return (
        <span>
          {phoneNumber !== null && typeof phoneNumber === "string"
            ? phoneNumber
            : defaultValue}
        </span>
      );
    }
  };

  const [expandedKeys, setExpandedKeys] = useState({});
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const toast = useRef(null);

  const menu = [
    {
      label: "View Key",
      icon: "pi pi-search",
      command: () => {
        toast.current.show({
          severity: "success",
          summary: "Node Key",
          detail: selectedNodeKey,
        });
      },
    },
    {
      label: "Toggle",
      icon: "pi pi-cog",
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

                    <img
                      src={`http://localhost:3000/img/${editedUser.avatar}`}
                      onError={(e) => (e.target.src = 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-1024.png')}
                      alt={editedUser.avatar}
                      style={{ width: '200px', height: '200px%', objectFit: 'cover' }}
                    />

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
            {/* <div className="mt-2">
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
    </div> */}
          </div>
          <div className="col-6">

            <div className="card mb-4">
              <div className="card-header">Account Details</div>
              <div className="card-body">
                <form>
                  <div className="field flex" style={{ display: 'flex' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <label className="mb-1 mr-2 font-bold" htmlFor="inputFirstName">
                        First name:
                      </label>
                    </div>
                    <div style={{ flex: 2 }} className={isEditing ? '' : 'not-editing-text'}>
                      {displayWithDefault('firstName')}
                    </div>
                  </div>

                  <div className="field flex" style={{ display: 'flex' }} >
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <label className="mb-1 mr-2 font-bold" htmlFor="inputLastName">
                        Last name:
                      </label>
                    </div>
                    <div style={{ flex: 2 }} className={isEditing ? '' : 'not-editing-text'}>
                      {displayWithDefault('lastName')}
                    </div>
                  </div>

                  <div className="field flex" style={{ display: 'flex' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <label className="mb-1 mr-2 font-bold" htmlFor="inputLocation">
                        Location:
                      </label>
                    </div>
                    <div style={{ flex: 2 }} className={isEditing ? '' : 'not-editing-text'}>
                      {displayWithDefault('address')}
                    </div>
                  </div>

                  <div className="field flex" style={{ display: 'flex' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <label className="mb-1 mr-2 font-bold" htmlFor="inputGender">
                        Gender:
                      </label>
                    </div>
                    <div style={{ flex: 2 }} className={isEditing ? '' : 'not-editing-text'}>
                      {isEditing ? (
                        <select
                          className="form-control w-full"
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
                  </div>

                  <div className="field flex" style={{ display: 'flex' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <label className="mb-1 mr-2 font-bold" htmlFor="inputPhone">
                        Phone number:
                      </label>
                    </div>
                    <div style={{ flex: 2 }} className={isEditing ? '' : 'not-editing-text'}>
                      {displayWithDefaultPhone('phoneNumber')}
                    </div>
                  </div>

                  <div className="field flex" style={{ display: 'flex' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <label className="mb-1 mr-2 font-bold" htmlFor="inputEmailAddress">
                        Email:
                      </label>
                    </div>
                    <div style={{ flex: 2 }} className={isEditing ? '' : 'not-editing-text'}>
                      {security.email || 'Not Provided'}
                    </div>
                  </div>

                  {isEditing ? (
                    <div class="flex justify-content-center flex-wrap">
                      <button
                        className="btn btn-secondary mr-2 flex align-items-center justify-content-center"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary ml-2 flex align-items-center justify-content-center"
                        type="button"
                        onClick={handleSaveClick}
                      >
                        Save changes
                      </button>
                    </div>
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
    </div>
  );
};
export default UpdateProfileUser;
