import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "../../utils/axiosCustomize";
import authHeader from "../../AuthHeader/AuthHeader";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";

const ManageCatalogue = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'catalogueName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  });

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const fetchCatalogues = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/catalogue/getAllCatalogues");
      setCatalogues(response.data); // Ensure this is an array of catalogues
    } catch (error) {
      console.error("Error fetching catalogues:", error);
    }
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      catalogueName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
        <Button label="Add" icon="pi pi-plus" onClick={() => setVisibleAdd(true)} />
        <Button className='ml-auto' type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search by name" />
        </span>
      </div>
    );
  };

  const [visibleAdd, setVisibleAdd] = useState(false);
  const footerContent = (
    <div>
      <Button label="No" icon="pi pi-times" onClick={() => setVisibleAdd(false)} className="p-button-text" />
      <Button label="Add" icon="pi pi-check" onClick={handleBtnAdd} autoFocus />
    </div>
  );
  const [formData, setFormData] = useState({ catalogueName: "" });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBtnAdd = async () => {
    try {
      const apiUrl = "http://localhost:8080/api/v1/catalogue/createNewCatalogue";
      const postData = { catalogueName: formData.catalogueName, status: true };
      await axios.post(apiUrl, postData);
      fetchCatalogues();
    } catch (error) {
      console.error("Error creating catalogue:", error);
    } finally {
      setVisibleAdd(false);
    }
  };

  const handleClickBtnDelete = async (catalogueId) => {
    try {
      const apiUrl = `http://localhost:8080/api/v1/catalogue/deleteCatalogue/${catalogueId}`;
      await axios.delete(apiUrl);
      fetchCatalogues();
    } catch (error) {
      console.error("Error deleting catalogue:", error);
    }
  };

  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [catalogueUpdate, setCatalogueUpdate] = useState({});
  const [newCatalogueName, setNewCatalogueName] = useState("");

  const handleClickBtnUpdate = (catalogue) => {
    setVisibleUpdate(true);
    setCatalogueUpdate(catalogue);
  };

  useEffect(() => {
    if (catalogueUpdate?.catalogueName) {
      setNewCatalogueName(catalogueUpdate.catalogueName);
    }
  }, [catalogueUpdate]);

  const footerContentUpdate = (
    <div>
      <Button label="No" icon="pi pi-times" onClick={() => setVisibleUpdate(false)} className="p-button-text" />
      <Button label="Update" icon="pi pi-check" onClick={(e) => handleUpdateCataglogue(e, catalogueUpdate)} autoFocus />
    </div>
  );

  const handleUpdateCataglogue = async (e, catalogueUpdate) => {
    try {
      const apiUrl = `http://localhost:8080/api/v1/catalogue/updateCatalogue/${catalogueUpdate.catalogueId}`;
      const data = { catalogueName: newCatalogueName, status: true };
      await axios.put(apiUrl, data);
      fetchCatalogues();
      setVisibleUpdate(false);
    } catch (error) {
      console.error("Error updating catalogue:", error);
    }
  };

  const header = renderHeader();

  return (
    <div className="card container">
      <h1>Catalogues List</h1>
      <Dialog header="Add Catalogs" visible={visibleAdd} style={{ width: "50vw" }} onHide={() => setVisibleAdd(false)} footer={footerContent}>
        <div className="flex flex-column gap-2">
          <label htmlFor="catalogueName">Catalogue Name: </label>
          <InputText id="catalogueName" name="catalogueName" onChange={handleInputChange} />
        </div>
      </Dialog>
      <Dialog header="Update Catalogue" visible={visibleUpdate} style={{ width: "50vw" }} onHide={() => setVisibleUpdate(false)} footer={footerContentUpdate}>
        <div className="flex flex-column gap-2">
          <label htmlFor="catalogueName">Catalogue Name: </label>
          <InputText id="catalogueName" name="catalogueName" value={newCatalogueName} onChange={(e) => setNewCatalogueName(e.target.value)} />
        </div>
      </Dialog>
      <DataTable header={header} filters={filters} onFilter={(e) => setFilters(e.filters)} value={catalogues} paginator rows={5} rowsPerPageOptions={[5, 10, 15]} removableSort tableStyle={{ minWidth: "50rem" }}>
        <Column field="catalogueId" header="Catalogue Id" sortable style={{ width: "10%" }}></Column>
        <Column field="catalogueName" header="Catalogue Name" sortable style={{ width: "40%" }}></Column>
        <Column header="Action" body={(catalogue) => (
          <div style={{ display: "flex" }}>
            <Button severity="danger" onClick={() => handleClickBtnDelete(catalogue.catalogueId)} rounded>
              Delete
            </Button>
            <Button className="ml-3" rounded onClick={() => handleClickBtnUpdate(catalogue)}>
              Update
            </Button>
          </div>
        )} style={{ width: "30%" }}></Column>
      </DataTable>
    </div>
  );
};

export default ManageCatalogue;
