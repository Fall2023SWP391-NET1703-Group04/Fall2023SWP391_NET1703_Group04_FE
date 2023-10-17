import "./ManageUser.css";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "../../utils/axiosCustomize";
import authHeader from "../../AuthHeader/AuthHeader";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { InputMask } from "primereact/inputmask";
import _ from "lodash";
import { fetchUsers } from "../../services/userServices";
const ManageUser = () => {
  //Modal add
  const [visible, setVisible] = useState(false);
  const [visibleUpdateUser, setVisibleUpdateUser] = useState(false);
  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Add"
        icon="pi pi-check"
        onClick={(e) => handleBtnAdd(e)}
        autoFocus
      />
    </div>
  );
  const footerContentUpdateUser = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisibleUpdateUser(false)}
        className="p-button-text"
      />
      <Button
        label="Update"
        icon="pi pi-check"
        onClick={(e) => handleUpdateUser(e, userUpdate)}
        autoFocus
      />
    </div>
  );

  //----------------------------------------------------------------
  //Get
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("zoo-server/api/v1/user/getAllUsers", {
        headers: authHeader(),
      })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  //----------------------------------------------------------------
  //Create
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phoneNumber: "",
  });

  const handleBtnAdd = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = "/zoo-server/api/v1/user/registerNewUser";

      const postData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      };

      const response = await axios.post(apiUrl, postData, {
        headers: authHeader(),
      });
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setVisible(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //----------------------------------------------------------------
  //Delete
  const deleteUser = async (userId) => {
    try {
      const apiUrl = `/zoo-server/api/v1/user/deleteUser/${userId}`;
      await axios.delete(apiUrl, {
        headers: authHeader(),
      });
      // Remove the deleted user from the state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  //----------------------------------------------------------------
  //Update
  const [userUpdate, setUserUpdate] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newFirstName, setNewFistName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newProFileId, setNewProFileId] = useState("");
  const [newRoleId, setNewRoleId] = useState("");
  const handleClickBtnUpdate = (user) => {
    setVisibleUpdateUser(true);
    setUserUpdate(user);
  };

  useEffect(() => {
    if (!_.isEmpty(userUpdate)) {
      setNewPassword(userUpdate?.password);
      setNewAddress(userUpdate.profileDTO?.address);
      setNewFistName(userUpdate.profileDTO?.firstName);
      setNewLastName(userUpdate.profileDTO?.lastName);
      setNewPhoneNumber(userUpdate.profileDTO?.phoneNumber);
      setNewProFileId(userUpdate.profileDTO?.profileId);
      setNewRoleId(userUpdate.roleDTO?.roleId);
    }
  }, [userUpdate]);

  const handleUpdateUser = async (e, userUpdate) => {
    let data = {
      password: newPassword,
      profileDTO: {
        address: newAddress,
        avatar: "",
        firstName: newFirstName,
        lastName: newLastName,
        phoneNumber: newPhoneNumber,
        profileId: ~~newProFileId,
      },
      roleId: newRoleId,
    };
    axios
      .put(`/zoo-server/api/v1/user/updateUser/${userUpdate.userId}`, data, {
        headers: authHeader(),
      })
      .then((response) => {
        // Handle the successful response here
        console.log("User updated successfully:", response.data);
        axios
          .get("zoo-server/api/v1/user/getAllUsers", {
            headers: authHeader(),
          })
          .then((response) => {
            setUsers(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
        setVisibleUpdateUser(false);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error updating user:", error);
      });
  };

  return (
    <>
      <div className="table-user">
        <h1>User List</h1>
        <div className="card flex justify-content-center">
          <Button
            label="Add"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
          <Dialog
            header="Add User"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
            footer={footerContent}
          >
            <div className="flex flex-column gap-2">
              <label htmlFor="input_email">Email: </label>
              <input
                type="email"
                pattern="[^ @]*@[^ @]*"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="fistName">FirstName: </label>
              <InputText
                id="fistName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="lastName">LastName: </label>
              <InputText
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="passWord">PassWord: </label>
              <Password
                id="passWord"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="ssn_input_phone">Phone Number: </label>
              <InputMask
                id="ssn_input_phone"
                mask="99-9999-9990"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
          </Dialog>
          {/* Dialog or form for updating user data */}
          <Dialog
            header="Update User"
            visible={visibleUpdateUser}
            style={{ width: "50vw" }}
            onHide={() => setVisibleUpdateUser(false)}
            footer={footerContentUpdateUser}
          >
            <div className="flex flex-column gap-2">
              <label htmlFor="update_password">Password: </label>
              <Password
                id="update_password"
                name="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="update_address">Address: </label>
              <InputText
                id="update_address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="update_firstName">FirstName: </label>
              <InputText
                id="update_firstName"
                value={newFirstName}
                onChange={(e) => setNewFistName(e.target.value)}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="update_lastName">LastName: </label>
              <InputText
                id="update_lastName"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="update_phoneNumber">Phone Number: </label>
              <InputText
                id="update_phoneNumber"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="update_profileId">Profile Id: </label>
              <InputText
                value={newProFileId}
                onChange={(e) => setNewProFileId(e.target.value)}
                id="update_profileId"
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="update_RoleId">Role Id: </label>
              <InputText
                id="update_RoleId"
                value={newRoleId}
                onChange={(e) => setNewRoleId(e.target.value)}
              />
            </div>
          </Dialog>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card">
            <DataTable
              value={users}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 15]}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                field="userId"
                header="UserId"
                sortable
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="email"
                header="Email"
                sortable
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="profileDTO.firstName"
                header="First Name"
                body={(users) => {
                  return users.profileDTO?.firstName
                    ? users.profileDTO.firstName
                    : "Don't have First Name";
                }}
                sortable
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="profileDTO.lastName"
                header="Last Name"
                body={(users) => {
                  return users.profileDTO?.lastName
                    ? users.profileDTO.lastName
                    : "Don't have Last Name";
                }}
                sortable
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="profileDTO.address"
                header="Address"
                body={(users) => {
                  return users.profileDTO?.address
                    ? users.profileDTO?.address
                    : "Don't have address";
                }}
                sortable
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="roleDTO.roleName"
                header="Role"
                body={(users) => {
                  return users.roleDTO.roleName === "ROLE_ADMIN"
                    ? "ADMIN"
                    : users.roleDTO.roleName === "ROLE_CUSTOMER"
                    ? "CUSTOMER"
                    : users.roleDTO.roleName === "ROLE_STAFF"
                    ? "STAFF"
                    : users.roleDTO.roleName === "ROLE_FOODMANAGER"
                    ? "FOODMANAGER"
                    : users.roleDTO.roleName === "ROLE_TRAINER"
                    ? "TRAINER"
                    : users.roleDTO.roleName === ""
                    ? "none"
                    : "Dont' have anything";
                }}
                sortable
                style={{ width: "25%" }}
              ></Column>
              <Column
                header="Interact"
                body={(user) => {
                  return (
                    <div style={{ display: "flex" }}>
                      <Button
                        label="Delete"
                        field="userId"
                        onClick={() => deleteUser(user.userId)}
                        severity="danger"
                        rounded
                      />
                      <Button
                        label="Update"
                        onClick={() => {
                          handleClickBtnUpdate(user);
                        }}
                        severity="secondary"
                        rounded
                      />
                    </div>
                  );
                }}
              />
            </DataTable>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageUser;
