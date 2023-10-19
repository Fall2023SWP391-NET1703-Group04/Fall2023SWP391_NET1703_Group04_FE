import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import axios from 'axios';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'primereact/resources/primereact.css';
// import './Users.css';

const User = () => {
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [security, setSecurity] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.userId;
  const roleName = user.role;

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



  useEffect(() => {
    // if (userId === null || userId === undefined) {
    //   window.location.href = '/signin';
    //   return;
    // }

    axios
      .get(`http://localhost:8080/zoo-server/api/v1/user/${userId}`)
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
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    axios
      .put(`http://localhost:8080/zoo-server/api/v1/updateProfile/${userId}`, editedUser)
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

  const displayWithDefault = (field, defaultValue = 'Not Provided') => {
    return isEditing ? (
      <input
        className="form-control"
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








  return (
    <div>
      <div class="container-xl px-4 mt-4">

        <nav class="nav nav-borders">
          <a class="nav-link active ms-0" href="https://www.bootdey.com/snippets/view/bs5-edit-profile-account-details" target="__blank">Profile</a>
          <a class="nav-link" href="https://www.bootdey.com/snippets/view/bs5-profile-billing-page" target="__blank">Billing</a>
          <a class="nav-link" href="https://www.bootdey.com/snippets/view/bs5-profile-security-page" target="__blank">Security</a>
          <a class="nav-link" href="https://www.bootdey.com/snippets/view/bs5-edit-notifications-page" target="__blank">Notifications</a>
        </nav>
        <hr class="mt-0 mb-4" />
        <div class="row">
          <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Profile Picture</div>
              <div className="card-body text-center">
                <div>
                  <div>
                    {isEditingImg ? (
                      <div>
                        <input
                          type="fi le"
                          accept="image/*"
                          id="file-input"
                          name="ImageStyle"
                          onChange={handleImageChange}
                          style={{ display: 'block' }}
                        />
                        <img
                          src={
                            selectedFile
                              ? URL.createObjectURL(selectedFile)
                              : editedUser.avatar
                                ? `http://localhost:3000/img/${editedUser.avatar}`
                                : defaultImageUrl
                          }
                          alt=""
                        />
                      </div>
                    ) : (
                      <img
                        src={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : editedUser.avatar
                              ? `http://localhost:3000/img/${editedUser.avatar}`
                              : defaultImageUrl
                        }
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImageUrl;
                        }}
                      />
                    )}
                  </div>
                  <div>
                    {isEditingImg ? (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          handleSaveClick();
                          setIsEditingImg(false); // Gọi handleSaveClick và sau đó setIsEditingImg(false)
                        }}

                      >
                        Save changes image
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => setIsEditingImg(true)}

                      >
                        Upload image
                      </button>
                    )}
                  </div>
                </div>

                <div className="small font-italic text-muted mb-4">
                  {editedUser.firstName && editedUser.lastName ? `${editedUser.firstName} ${editedUser.lastName}` : 'Name Not Provided'}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="card mb-4">
              <div className="card-header">Account Details</div>
              <div className="card-body">
                <form>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputFirstName">
                        First name
                      </label>
                      &nbsp; &nbsp;
                      {displayWithDefault('firstName')}
                    </div>
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputLastName">
                        Last name
                      </label>
                      &nbsp; &nbsp;
                      {displayWithDefault('lastName')}
                    </div>
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputLocation">
                        Location
                      </label>
                      &nbsp; &nbsp;
                      {displayWithDefault('address')}
                    </div>
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputGender">
                        Gender
                      </label>
                      &nbsp; &nbsp;
                      {isEditing ? (
                        <select
                          className="form-control"
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
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputPhone">
                        Phone number
                      </label>
                      &nbsp; &nbsp;
                      {security.phoneNumber || 'Not Provided'}
                    </div>
                    <div className="col-md-6">
                      <label
                        className="small mb-1"
                        htmlFor="inputEmailAddress"
                      >
                        Email
                      </label>
                      &nbsp; &nbsp;
                      {security.email || 'Not Provided'}
                    </div>
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
    </div>



  );
}

export default User;
