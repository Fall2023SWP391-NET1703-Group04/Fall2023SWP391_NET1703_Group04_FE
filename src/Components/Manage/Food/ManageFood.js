import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import dayjs from "dayjs";
import authHeader from "../../AuthHeader/AuthHeader";
import { FilterMatchMode, FilterOperator } from "primereact/api";
function ManageFood() {
  const [foods, setFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const toast = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  //Search by animals name
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
          className="p-button-primary"
          onClick={handleOpenModal}
        />
        <Button className='ml-auto' type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search by name" />
        </span>
      </div>
    );
  };

  const dateTemplate = (rowData, column) => {
    const dateValue = rowData[column.field];
    return dateValue ? dayjs(dateValue).format("MM/DD/YYYY") : "";
  };

  const statusTemplate = (rowData, column) => {
    const status = rowData[column.field];
    return status ? "Active" : "Inactive";
  };

  const actionTemplate = (rowData) => (
    < >
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success p-mr-2"
        onClick={() => handleOpenUpdateModal(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => handleDeleteFood(rowData.foodId)}
      />
    </>
  );

  useEffect(() => {
    // Make an Axios GET request to fetch the data
    axios
      .get("http://localhost:8080/zoo-server/api/v1/food/getAllFoods", { headers: authHeader() })
      .then((response) => {
        const foodsWithDateObjects = response.data.data.map((food) => ({
          ...food,
          dateStart: new Date(food.dateStart),
          dateEnd: new Date(food.dateEnd),
        }));
        setFoods(foodsWithDateObjects);
        setRefresh(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]);

  // Add DATA
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [newFood, setNewFood] = useState({
    foodName: "",
    dateStart: null, // Use null as the initial value
    dateEnd: null,
    nutriment: "",
    quantity: 1,
    unit: 1,
    status: false,
  });

  const handleInputChange = (event, name) => {
    // For non-date inputs, use the standard input handling
    if (name !== 'dateStart' && name !== 'dateEnd') {
      const { name, value } = event.target;
      setNewFood({ ...newFood, [name]: value });
    } else {
      // For date inputs, use the selected date value
      setNewFood({ ...newFood, [name]: event });
    }
  };

  //Add food
  const handleAddFood = () => {
    axios
      .post("http://localhost:8080/zoo-server/api/v1/food/createNewFood", newFood, { headers: authHeader() })
      .then((response) => {
        show(response.data.message, 'green');
        setRefresh(true)
        setIsModalOpen(false);
      })
      .catch((error) => {
        if (newFood.foodName === undefined) {
          show("Please input food name", 'red');
        }
        else if (newFood.dateStart === null) {
          show("Please input date start", 'red');
        }
        else if (newFood.dateEnd === null) {
          show("Please input date end", 'red');
        }
        else {
          show(error.response.data.message, 'red');
        }
        console.error(error);
      });
  };

  // Delete
  const handleDeleteFood = (foodId) => {
    axios
      .delete(`http://localhost:8080/zoo-server/api/v1/food/deleteFood/${foodId}`, { headers: authHeader() })
      .then((response) => {
        show(response.data.message, 'green');
        setRefresh(true)
      })
      .catch((error) => {
        show(error.response.data.message, 'red');
        console.error(error);
      });
  };

  // Update
  const [updateFood, setUpdateFood] = useState({
    foodId: null,
    foodName: "",
    dateStart: null,
    dateEnd: null,
    nutriment: "",
    quantity: 0,
    unit: 0,
    status: false,
  });

  const handleOpenUpdateModal = (food) => {
    setUpdateFood({
      foodId: food.foodId,
      foodName: food.foodName,
      dateStart: food.dateStart,
      dateEnd: food.dateEnd,
      nutriment: food.nutriment,
      quantity: food.quantity,
      unit: food.unit,
    });
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleUpdateInputChange = (event, name) => {
    if (name !== 'dateStart' && name !== 'dateEnd') {
      const { name, value } = event.target;
      setUpdateFood({ ...updateFood, [name]: value });
    } else {
      // Convert the selected date to a valid Date object or null
      const dateValue = event ? new Date(event) : null;

      // Use the formatted date value in the state
      setUpdateFood({ ...updateFood, [name]: dateValue });
    }
  };

  const handleUpdateFood = () => {
    axios
      .put(`http://localhost:8080/zoo-server/api/v1/food/updateFood/${updateFood.foodId}`, updateFood, { headers: authHeader() })
      .then((response) => {
        show(response.data.message, 'green');
        setRefresh(true)
        handleCloseUpdateModal();
      })
      .catch((error) => {
        show(error.response.data.message, 'red');
        console.error(error);
      });
  };

  const header = renderHeader();

  const show = (message, color) => {
    toast.current.show({
      summary: 'Notifications', detail: message, life: 3000,
      style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
    });
  };

  return (
    <div className="flex w-full justify-content-center align-items-center">
      <Toast ref={toast} />
      <div className="justify-self-center w-11">
        <h1>Food Management</h1>
        <DataTable value={foods} header={header} className="p-datatable-striped"
          paginator rows={5} rowsPerPageOptions={[5, 10, 20]}
          filters={filters} onFilter={(e) => setFilters(e.filters)}>
          <Column field="foodName" header="Food Name" />
          <Column field="image" header="Image" />
          <Column field="dateStart" header="Date Start" body={dateTemplate} />
          <Column field="dateEnd" header="Date End" body={dateTemplate} />
          <Column field="nutriment" header="Nutrition" />
          <Column field="quantity" header="Quantity" />
          <Column field="unit" header="Unit (g)" />
          <Column field="status" header="Status" body={statusTemplate} />
          <Column header="Interact" body={actionTemplate} />
        </DataTable>
      </div >

      {/* Add Food Modal */}
      <Dialog Dialog header="Add Food" visible={isModalOpen} onHide={handleCloseModal} >
        <div className="p-field">
          <label htmlFor="foodName">Food Name</label>
          <br />
          <InputText
            id="foodName"
            name="foodName"
            value={newFood.foodName}
            onChange={(e) => handleInputChange(e, "foodName")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="dateStart">Date Start</label>
          <br />
          <Calendar
            id="dateStart"
            name="dateStart"
            value={newFood.dateStart}
            onChange={(e) => handleInputChange(e.value, "dateStart")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="dateEnd">Date End</label>
          <br />
          <Calendar
            id="dateEnd"
            name="dateEnd"
            value={newFood.dateEnd}
            onChange={(e) => handleInputChange(e.value, "dateEnd")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="nutriment">Nutrition</label>
          <br />
          <InputText
            id="nutriment"
            name="nutriment"
            value={newFood.nutriment}
            onChange={(e) => handleInputChange(e, "nutriment")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="quantity">Quantity</label>
          <br />
          <InputText
            id="quantity"
            name="quantity"
            keyfilter="int"
            value={newFood.quantity}
            onChange={(e) => handleInputChange(e, "quantity")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="unit">Unit (g)</label>
          <br />
          <InputText
            id="unit"
            name="unit"
            keyfilter="int"
            value={newFood.unit}
            onChange={(e) => handleInputChange(e, "unit")}
          />
        </div>
        <Button label="Add Food" icon="pi pi-check" type="button" onClick={handleAddFood} />
      </Dialog >

      {/* Update Food Modal */}
      <Dialog Dialog
        header="Update Food"
        visible={isUpdateModalOpen}
        onHide={handleCloseUpdateModal}
      >
        <div className="p-field">
          <label htmlFor="foodName">Food Name</label>
          <br />
          <InputText
            id="foodName"
            name="foodName"
            value={updateFood.foodName}
            onChange={(e) => handleUpdateInputChange(e, "foodName")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="dateStart">Date Start</label>
          <br />
          <Calendar
            id="dateStart"
            name="dateStart"
            value={updateFood.dateStart}
            onChange={(e) => handleUpdateInputChange(e.value, "dateStart")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="dateEnd">Date End</label>
          <br />
          <Calendar
            id="dateEnd"
            name="dateEnd"
            value={updateFood.dateEnd}
            onChange={(e) => handleUpdateInputChange(e.value, "dateEnd")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="nutriment">Nutrition</label>
          <br />
          <InputText
            id="nutriment"
            name="nutriment"
            value={updateFood.nutriment}
            onChange={(e) => handleUpdateInputChange(e, "nutriment")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="quantity">Quantity</label>
          <br />
          <InputText
            id="quantity"
            name="quantity"
            keyfilter="int"
            value={updateFood.quantity}
            onChange={(e) => handleUpdateInputChange(e, "quantity")}
          />
        </div>
        <div className="p-field">
          <label htmlFor="unit">Unit (g)</label>
          <br />
          <InputText
            id="unit"
            name="unit"
            keyfilter="int"
            value={updateFood.unit}
            onChange={(e) => handleUpdateInputChange(e, "unit")}
          />
        </div>
        <Button
          label="Update Food"
          icon="pi pi-check"
          onClick={handleUpdateFood}
        />
      </Dialog >
      <Toast ref={toast} />
    </div>
  );
}

export default ManageFood;
