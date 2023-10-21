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

const ManageCatalogue = () => {
  //----------------------------------------------------------------
  //Get
  const [catalogues, setCatalogues] = useState([]);
  const [areas, setAreas] = useState([]);
  useEffect(() => {
    axios
      .get("/zoo-server/api/v1/catalogue/getAllCatalogues", {
        headers: authHeader(),
      })
      .then((response) => {
        setCatalogues(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //----------------------------------------------------------------
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
    catalogueName: "",
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
      const apiUrl = "/zoo-server/api/v1/catalogue/createNewCatalogue";

      const postData = {
        catalogueName: formData.catalogueName,
        status: true,
      };

      console.log(postData);
      const response = await axios.post(apiUrl, postData, {
        headers: authHeader(),
      });
    } catch (error) {
      console.error("Error creating catalogues:", error);
    } finally {
      setVisibleAdd(false);
      await axios
        .get("/zoo-server/api/v1/catalogue/getAllCatalogues", {
          headers: authHeader(),
        })
        .then((response) => {
          setCatalogues(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  //----------------------------------------------------------------
  //Delete
  const handleClickBtnDelete = async (catalogueId) => {
    try {
      const apiUrl = `/zoo-server/api/v1/catalogue/deleteCatalogue/${catalogueId}`;
      await axios.delete(apiUrl, {
        headers: authHeader(),
      });
      // Remove the deleted user from the state
      setCatalogues((prevCatalogues) =>
        prevCatalogues.filter(
          (catalogues) => catalogues.catalogueId !== catalogueId
        )
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  //----------------------------------------------------------------
  //Update
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [catalogueUpdate, setCatalogueUpdate] = useState({});
  const [newCatalogueName, setNewCatalogueName] = useState("");
  const handleClickBtnUpdate = (catalogues) => {
    setVisibleUpdate(true);
    setCatalogueUpdate(catalogues);
  };

  useEffect(() => {
    if (!_.isEmpty(catalogueUpdate)) {
      setNewCatalogueName(catalogueUpdate?.catalogueName);
    }
  }, [catalogueUpdate]);
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
        onClick={(e) => handleUpdateCataglogue(e, catalogueUpdate)}
        autoFocus
      />
    </div>
  );
  let data = {
    catalogueName: newCatalogueName,
    status: true,
  };
  const handleUpdateCataglogue = async (e, catalogueUpdate) => {
    axios
      .put(
        `/zoo-server/api/v1/catalogue/updateCatalogue/${catalogueUpdate.catalogueId}`,
        data,
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        // Handle the successful response here
        console.log("catalogue updated successfully:", response.data);
        axios
          .get("/zoo-server/api/v1/catalogue/getAllCatalogues", {
            headers: authHeader(),
          })
          .then((response) => {
            setCatalogues(response);
          })
          .catch((error) => {
            console.error(error);
          });
        setVisibleUpdate(false);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error updating catalogue:", error);
      });
  };
  return (
    <div>
      {" "}
      <div className="card">
        <h1>Catalogues List</h1>
        <div className="card flex justify-content-center">
          <Button
            label="Add"
            icon="pi pi-plus"
            onClick={() => setVisibleAdd(true)}
          />
        </div>

        <Dialog
          header="Add Catalogs"
          visible={visibleAdd}
          style={{ width: "50vw" }}
          onHide={() => setVisibleAdd(false)}
          footer={footerContent}
        >
          <div className="flex flex-column gap-2">
            <label htmlFor="catalogueName">Catalogue Name: </label>
            <InputText
              id="catalogueName"
              name="catalogueName"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </Dialog>
        <Dialog
          header="Update Catalogue"
          visible={visibleUpdate}
          style={{ width: "50vw" }}
          onHide={() => setVisibleUpdate(false)}
          footer={footerContentUpdate}
        >
          {" "}
          <div className="flex flex-column gap-2">
            <label htmlFor="areaName">Catalogue Name: </label>
            <InputText
              id="catalogueName"
              name="catalogueName"
              value={newCatalogueName}
              onChange={(e) => setNewCatalogueName(e.target.value)}
            />
          </div>
        </Dialog>
        <DataTable
          value={catalogues}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 15]}
          removableSort
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="catalogueId"
            header="Catalogue Id"
            sortable
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="catalogueName"
            header="Catalogue Name"
            sortable
            style={{ width: "25%" }}
          ></Column>
          <Column
            header="Action"
            body={(catalogue) => (
              <div style={{ display: "flex" }}>
                <Button
                  severity="danger"
                  onClick={() => {
                    handleClickBtnDelete(catalogue.catalogueId);
                  }}
                  rounded
                >
                  Delete
                </Button>
                <Button
                  rounded
                  onClick={() => {
                    handleClickBtnUpdate(catalogue);
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
    </div>
  );
};

export default ManageCatalogue;
