import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "../../utils/axiosCustomize";
import authHeader from "../../AuthHeader/AuthHeader";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import _ from "lodash";
import { FilterMatchMode, FilterOperator } from "primereact/api";
const ManageArea = () => {
  //----------------------------------------------------------------
  //Get
  const [areas, setAreas] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    axios
      .get("zoo-server/api/v1/area/getAllAreas", {
        headers: authHeader(),
      })
      .then((response) => {
        setAreas(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //----------------------------------------------------------------
  //Search by name
  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'animalName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

  });

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      animalName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

    });
    setGlobalFilterValue('');
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          label="Add"
          icon="pi pi-plus"
          onClick={() => setVisibleAdd(true)}
        />
        <Button className='ml-auto' type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search by name" />
        </span>
      </div>
    );
  };

  //Add
  const [visibleAdd, setVisibleAdd] = useState(false);
  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisibleAdd(false)}
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
  const [formData, setFormData] = useState({
    areaName: "",
    description: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleBtnAdd = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = "/zoo-server/api/v1/area/createNewArea";

      const postData = {
        areaName: formData.areaName,
        description: formData.description,
      };

      const response = await axios.post(apiUrl, postData, {
        headers: authHeader(),
      });
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setVisibleAdd(false);
      await axios
        .get("zoo-server/api/v1/area/getAllAreas", {
          headers: authHeader(),
        })
        .then((response) => {
          setAreas(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  //----------------------------------------------------------------
  //Delete
  const handleClickBtnDelete = async (areaId) => {
    try {
      const apiUrl = `/zoo-server/api/v1/area/deleteArea/${areaId}`;
      await axios.delete(apiUrl, {
        headers: authHeader(),
      });
      // Remove the deleted user from the state
      setAreas((prevAreas) =>
        prevAreas.filter((area) => area.areaId !== areaId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  //----------------------------------------------------------------
  //Update
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [areaUpdate, setAreaUpdate] = useState({});
  const [newAreaName, setNewAreaName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const handleClickBtnUpdate = (area) => {
    setVisibleUpdate(true);
    setAreaUpdate(area);
  };
  console.log(areaUpdate);
  useEffect(() => {
    if (!_.isEmpty(areaUpdate)) {
      setNewAreaName(areaUpdate?.areaName);
      setNewDescription(areaUpdate?.description);
    }
  }, [areaUpdate]);
  const footerContentUpdate = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisibleAdd(false)}
        className="p-button-text"
      />
      <Button
        label="Update"
        icon="pi pi-check"
        onClick={(e) => handleUpdateUser(e, areaUpdate)}
        autoFocus
      />
    </div>
  );
  let data = {
    areaName: newAreaName,
    description: newDescription,
    status: true,
  };
  console.log(data);
  const handleUpdateUser = async (e, areaUpdate) => {
    axios
      .put(`/zoo-server/api/v1/area/updateArea/${areaUpdate.areaId}`, data, {
        headers: authHeader(),
      })
      .then((response) => {
        // Handle the successful response here
        console.log("User updated successfully:", response.data);
        axios
          .get("/zoo-server/api/v1/area/getAllAreas", {
            headers: authHeader(),
          })
          .then((response) => {
            setAreas(response);
          })
          .catch((error) => {
            console.error(error);
          });
        setVisibleUpdate(false);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error updating user:", error);
      });
  };

  const header = renderHeader();

  return (
    <div className="card container">
      <h1>Areas List</h1>
      <div className="card flex justify-content-center">

      </div>

      <Dialog
        header="Add Areas"
        visible={visibleAdd}
        style={{ width: "50vw" }}
        onHide={() => setVisibleAdd(false)}
        footer={footerContent}
      >
        <div className="flex flex-column gap-2">
          <label htmlFor="areaName">Area Name: </label>
          <InputText
            id="areaName"
            name="areaName"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="flex flex-column gap-2" style={{ marginTop: "1rem" }}>
          <label htmlFor="areaId">Description: </label>
          <InputText
            id="Description"
            name="description"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </Dialog>
      <Dialog
        header="Update Area"
        visible={visibleUpdate}
        style={{ width: "50vw" }}
        onHide={() => setVisibleUpdate(false)}
        footer={footerContentUpdate}
      >
        {" "}
        <div className="flex flex-column gap-2">
          <label htmlFor="areaName">Area Name: </label>
          <InputText
            id="areaName"
            name="areaName"
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
          />
        </div>
        <div className="flex flex-column gap-2" style={{ marginTop: "1rem" }}>
          <label htmlFor="areaId">Description: </label>
          <InputText
            id="Description"
            name="description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>
      </Dialog>

      <DataTable
        header={header}
        filters={filters} onFilter={(e) => setFilters(e.filters)}
        value={areas}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 15]}
        removableSort
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          field="areaId"
          header="Area Id"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="areaName"
          header="Area Name"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="description"
          header="Description"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          header="Action"
          body={(area) => (
            <div style={{ display: "flex" }}>
              <Button
                severity="danger"
                onClick={() => {
                  handleClickBtnDelete(area.areaId);
                }}
                rounded
              >
                Delete
              </Button>
              <Button
                rounded
                onClick={() => {
                  handleClickBtnUpdate(area);
                }}
              >
                Update
              </Button>
            </div>
          )}
          style={{ width: "25%" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default ManageArea;
