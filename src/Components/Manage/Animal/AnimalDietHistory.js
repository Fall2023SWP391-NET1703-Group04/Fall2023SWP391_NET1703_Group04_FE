import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import authHeader from '../../AuthHeader/AuthHeader';
import ModalAssignDiet from './ModalAssignDiet';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useRef } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar';
import dayjs from 'dayjs';

export default function AnimalDietHistory(animalId) {
    const [dietData, setDietData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [diets, setDiets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dietUpdate, setDietUpdate] = useState({})
    const [selectedDiet, setSelectedDiet] = useState();

    var [animalDietManagementId, setAnimalDietManagementId] = useState(null);
    const toast = useRef(null);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" onClick={() => setIsModalOpen(true)} icon="pi pi-plus" text label='Add' />;

    //get Data and show
    useEffect(() => {
        axios.get(`http://localhost:8080/zoo-server/api/v1/animal-diet-management/getAllByAnimalId/${animalId}`, { headers: authHeader() })
            .then(response => {
                const dietWithDateObject = response.data.data.map((data) => ({
                    ...data,
                    dateStart: new Date(data.dateStart),
                    dateEnd: data.dateEnd ? new Date(data.dateEnd) : null,
                }));
                setDietData(dietWithDateObject);
                setRefresh(false);
            })
            .catch(error => console.error(error));

        axios.get(`http://localhost:8080/zoo-server/api/v1/diet/getAllDiets`, { headers: authHeader() })
            .then(response => setDiets(response.data.data))
            .catch(error => console.error(error));

    }, [refresh, animalId]);

    const dateTemplate = (rowData, column) => {
        const dateValue = rowData[column.field];
        if (!dateValue) {
            return "Now...";
        }
        return dayjs(dateValue).format("MM/DD/YYYY");
    };

    //update
    const openUpdateModal = (rowData) => {
        setAnimalDietManagementId(rowData.animalDietManagementId);
        setDietUpdate({
            animalId: Number(animalId),
            dateEnd: rowData.dateEnd,
            dateStart: rowData.dateStart,
            animalDietManagementName: rowData.animalDietManagementName,
            dietId: rowData.dietId
        })
        setIsUpdateModalOpen(true)
    }


    const handleClose = () => {
        setIsModalOpen(false)
        setRefresh(true)
    }

    //update
    const handleUpdateInputChange = (event, name) => {
        if (name !== 'dateStart' && name !== 'dateEnd') {
            const { name, value } = event.target;
            setDietUpdate({ ...dietUpdate, [name]: value });
        } else {
            // Convert the selected date to a valid Date object or null
            const dateValue = event ? new Date(event) : null;
            // Use the formatted date value in the state
            setDietUpdate({ ...dietUpdate, [name]: dateValue });
        }
    };

    const handleUpdateDietChange = (event) => {
        console.log(event);
        setSelectedDiet(event.value)
        setDietUpdate({ ...dietUpdate, animalDietManagementId: event.value.animalDietManagementId });
    };

    const handleUpdateTraining = () => {
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/animal-diet-management/updateAnimalDietManagement/${animalDietManagementId}`, dietUpdate, { headers: authHeader() })
            .then(() => {
                setRefresh(true)
                setIsUpdateModalOpen(false)
            })
            .catch((error) => {
                show(error.response.data.message, 'red');
                console.error(error);
            });
    }

    //notifications
    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };

    return (
        <div className='container' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <Toast ref={toast} />
            <div className="card">
                {ModalAssignDiet(animalId, isModalOpen, handleClose)}
                <DataTable value={dietData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                    <Column field="dietName" header="Diet Name" />
                    <Column field="animalName" header="Animal" />
                    <Column field="dateStart" header="Date Start" body={dateTemplate} />
                    <Column field="dateEnd" header="Date End" body={dateTemplate} />
                    <Column field="animalDietManagementName" header="Description" />
                    <Column header="Action" body={(rowData) => (
                        <div>
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-info"
                                onClick={() => {
                                    openUpdateModal(rowData);
                                }}
                            />

                        </div>
                    )} />
                </DataTable>

                {/*  update diet */}
                <Dialog
                    header="Update Cage History"
                    visible={isUpdateModalOpen}
                    style={{ width: '800px' }}
                    modal
                    onHide={() => setIsUpdateModalOpen(false)}
                >
                    <Toast ref={toast} />
                    <div className="formgrid grid">
                        <div className="field col-12">
                            <label htmlFor="diet">Diet Name</label>
                            <br />
                            <Dropdown
                                name='dietId'
                                className='w-full'
                                optionLabel="dietName"
                                value={selectedDiet}
                                options={diets}
                                onChange={handleUpdateDietChange}
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="dateStart">Date Start</label>
                            <br />
                            <Calendar
                                id="dateStart"
                                className='w-full'
                                name="dateStart"
                                value={dietUpdate.dateStart}
                                onChange={(e) => handleUpdateInputChange(e.value, "dateStart")}
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="dateEnd">Date End</label>
                            <br />
                            <Calendar
                                id="dateEnd"
                                className='w-full'
                                name="dateEnd"
                                value={dietUpdate.dateEnd}
                                onChange={(e) => handleUpdateInputChange(e.value, "dateEnd")}
                            />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="animalDietManagementName">Description</label>
                            <br />
                            <InputTextarea
                                id="animalDietManagementName"
                                className='w-full min-h-full'
                                name="animalDietManagementName"
                                value={dietUpdate.animalDietManagementName}
                                onChange={handleUpdateInputChange}
                            />
                        </div>
                        <Button
                            label="Update Diet Management"
                            icon="pi pi-pencil"
                            onClick={handleUpdateTraining}
                            className="p-button-primary mt-5"
                        />
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
