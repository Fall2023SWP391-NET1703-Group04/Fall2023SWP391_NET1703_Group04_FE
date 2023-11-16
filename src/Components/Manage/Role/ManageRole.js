import "./ManageRole.css";
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
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../services/userServices";
const ManageRole = () => {
  const navigate = useNavigate();

  if (
    !JSON.parse(localStorage.getItem("user")) ||
    (
      JSON.parse(localStorage.getItem("user"))?.data?.role !== 'ROLE_ADMIN'

    )
  ) {
    navigate("/notfound");
  }
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
        label="Canel"
        icon="pi pi-times"
        onClick={() => setVisibleUpdateUser(false)}
        className="mr-2 p-button p-button-danger"
      />

      <Button
        label="Update"
        icon="pi pi-check"
        onClick={(e) => handleUpdateUser(e, roleUpdate)}
        autoFocus
      />
    </div>
  );

  //----------------------------------------------------------------
  //Get
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/zoo-server/api/v1/role/getAllRoles", {
        headers: authHeader(),
      })
      .then((response) => {
        setRoles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);
  console.log(roles);
  //----------------------------------------------------------------
  //Create
  const [formData, setFormData] = useState({
    roleName: "",
  });

  const handleBtnAdd = async (e) => {
    e.preventDefault();
    try {
      const apiUrl =
        "http://localhost:8080/zoo-server/api/v1/role/createNewRole";

      const postData = {
        roleName: formData.roleName,
      };

      const response = await axios.post(apiUrl, postData, {
        headers: authHeader(),
      });
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      axios
        .get("http://localhost:8080/zoo-server/api/v1/role/getAllRoles", {
          headers: authHeader(),
        })
        .then((response) => {
          setRoles(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
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
  const deleteUser = async (roleId) => {
    try {
      const apiUrl = `/zoo-server/api/v1/role/deleteRole/${roleId}`;
      await axios.delete(apiUrl, {
        headers: authHeader(),
      });
      // Remove the deleted user from the state
      setRoles((prevRoles) =>
        prevRoles.filter((role) => role.roleId !== roleId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  //----------------------------------------------------------------
  //Update
  const [roleUpdate, setRoleUpdate] = useState({});
  const [newRoleName, setNewRoleName] = useState("");
  const handleClickBtnUpdate = (role) => {
    setVisibleUpdateUser(true);
    setRoleUpdate(role);
  };

  useEffect(() => {
    if (!_.isEmpty(roleUpdate)) {
      setNewRoleName(roleUpdate?.roleName);
    }
  }, [roleUpdate]);

  const handleUpdateUser = async (e, roleUpdate) => {
    let data = {
      roleName: newRoleName,
    };
    axios
      .put(
        `http://localhost:8080/zoo-server/api/v1/role/updateRole/${roleUpdate.roleId}`,
        data,
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        // Handle the successful response here
        console.log("Role updated successfully:", response.data);
        axios
          .get("http://localhost:8080/zoo-server/api/v1/role/getAllRoles", {
            headers: authHeader(),
          })
          .then((response) => {
            setRoles(response.data);
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
      <div className="table-user ml-4">
        <h1>Role List</h1>
        <div class="flex flex-row-reverse flex-wrap mb-4 ">
          <Button
            className="mr-2"
            label="Add"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        </div>


        <div className="card flex justify-content-center">

          <Dialog
            header="Add Role"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
            footer={footerContent}
          >
            <div className="flex flex-column gap-2">
              <label htmlFor="roleName">Role Name: </label>
              <InputText
                id="roleName"
                name="roleName"
                value={formData.roleName}
                onChange={handleInputChange}
              />
            </div>
          </Dialog>
          {/* Dialog or form for updating user data */}
          <Dialog
            header="Update Role"
            visible={visibleUpdateUser}
            style={{ width: "50vw" }}
            onHide={() => setVisibleUpdateUser(false)}
            footer={footerContentUpdateUser}
          >
            <div className="flex flex-column gap-2">
              <label htmlFor="update_roleName">Role Name: </label>
              <InputText
                id="update_roleName"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />{" "}
            </div>
          </Dialog>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card">
            <DataTable
              size={{ label: "Small", value: "small" }}
              value={roles}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 15]}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column

                style={{ width: "25%" }}
              ></Column>

              <Column
                field="roleId"
                header="Role Id"
                sortable
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="roleName"
                header="Role Name"
                body={(roles) => {
                  return roles.roleName === "ROLE_ADMIN"
                    ? "ADMIN"
                    : roles.roleName === "ROLE_CUSTOMER"
                      ? "CUSTOMER"
                      : roles.roleName === "ROLE_STAFF"
                        ? "STAFF"
                        : roles.roleName === "ROLE_FOODMANAGER"
                          ? "FOODMANAGER"
                          : roles.roleName === "ROLE_TRAINER"
                            ? "TRAINER"
                            : roles.roleName === ""
                              ? "none"
                              : roles.roleName;
                }}
                sortable
                style={{ width: "25%" }}
              ></Column>
              <Column
                header="Interact"
                body={(role) => {
                  return (
                    <div style={{ display: "flex" }}>
                      <Button
                        icon="pi pi-trash"
                        className="p-button-danger"
                        field="userId"
                        onClick={() => deleteUser(role.roleId)}
                        severity="danger"
                        rounded
                      />
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-pencil"
                        onClick={() => {
                          handleClickBtnUpdate(role);
                        }}
                        severity="success"
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

export default ManageRole;
