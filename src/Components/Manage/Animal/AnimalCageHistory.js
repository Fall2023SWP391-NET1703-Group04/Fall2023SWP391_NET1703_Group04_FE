import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import authHeader from '../../AuthHeader/AuthHeader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ModalAssignCage from './ModalAssignCage';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

export default function AnimalCageHistory(animalId) {
    const [cageData, setCageData] = useState([]);
    const [cages, setCages] = useState([]);
    const [cageUpdate, setCageUpdate] = useState({});
    const [refresh, setRefresh] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCage, setSelectedCage] = useState();
    var [animalCageId, setAnimalCageId] = useState(null);

    const paginatorRight = <Button type="button" onClick={() => setIsModalOpen(true)} icon="pi pi-plus" text label='Add' />;

    //Get data
    useEffect(() => {
        // Fetch the list of diets from your API endpoint
        axios.get(`http://localhost:8080/zoo-server/api/v1/AnimalCageDetail/getAllByAnimal/${animalId}`, { headers: authHeader() })
            .then(response => {
                const cageWithDateObject = response.data.data.map((data) => ({
                    ...data,
                    dateStart: new Date(data.dateStart),
                    dateEnd: new Date(data.dateEnd),
                }));
                setCageData(cageWithDateObject);
                setRefresh(false)
            })
            .catch(error => console.error(error));

        axios.get(`http://localhost:8080/zoo-server/api/v1/animalCage/getAllAnimalCage`, { headers: authHeader() })
            .then(response => setCages(response.data.data))
            .catch(error => console.error(error));
    }, [refresh, animalId]);

    const handleClose = () => {
        setIsModalOpen(false)
        setRefresh(true)
    }

    //update 
    const openUpdateModal = (rowData) => {
        setAnimalCageId(rowData.animalCageDetailId);
        setCageUpdate({
            animalId: Number(animalId),
            dateEnd: rowData.dateEnd,
            dateStart: rowData.dateStart,
            animalCageDetailName: rowData.animalCageDetailName,
            animalCageId: rowData.animalCageId
        })
        setIsUpdateModalOpen(true)
    }

    const handleUpdateInputChange = (event, name) => {
        if (name !== 'dateStart' && name !== 'dateEnd') {
            const { name, value } = event.target;
            setCageUpdate({ ...cageUpdate, [name]: value });
        } else {
            // Convert the selected date to a valid Date object or null
            const dateValue = event ? new Date(event) : null;
            // Use the formatted date value in the state
            setCageUpdate({ ...cageUpdate, [name]: dateValue });
        }
    };

    const handleUpdateTrainerChange = (event) => {
        console.log(event);
        setSelectedCage(event.value)
        setCageUpdate({ ...cageUpdate, animalCageId: event.value.animalCageId });
    };

    const handleUpdateTraining = () => {
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/AnimalCageDetail/updateAnimalCageDetail/${animalCageId}`, cageUpdate, { headers: authHeader() })
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
    const toast = useRef(null);

    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };
    return (
        <div className='container' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <div className="card">
                {ModalAssignCage(animalId, isModalOpen, handleClose)}
                <DataTable value={cageData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorRight={paginatorRight}>
                    <Column field="animalCageName" header="Cage Name" />
                    <Column field="animalName" header="Animal" />
                    <Column field="dateStart" header="Date Start" body={(rowData) => rowData.dateStart.toLocaleDateString()} />
                    <Column field="dateEnd" header="Date End" body={(rowData) => rowData.dateEnd.toLocaleDateString()} />
                    <Column field="animalCageDetailName" header="Description" />
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
            </div>

            {/* Modal Update cage */}
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
                        <label htmlFor="trainer">Cage Name</label>
                        <br />
                        <Dropdown
                            name='animalCageId'
                            className='w-full'
                            optionLabel="animalCageName"
                            value={selectedCage}
                            options={cages}
                            onChange={handleUpdateTrainerChange}
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="dateStart">Date Start</label>
                        <br />
                        <Calendar
                            id="dateStart"
                            className='w-full'
                            name="dateStart"
                            value={cageUpdate.dateStart}
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
                            value={cageUpdate.dateEnd}
                            onChange={(e) => handleUpdateInputChange(e.value, "dateEnd")}
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="animalCageDetailName">Description</label>
                        <br />
                        <InputTextarea
                            id="animalCageDetailName"
                            className='w-full min-h-full'
                            name="animalCageDetailName"
                            value={cageUpdate.animalCageDetailName}
                            onChange={handleUpdateInputChange}
                        />
                    </div>
                    <Button
                        label="Update Training"
                        icon="pi pi-pencil"
                        onClick={handleUpdateTraining}
                        className="p-button-primary mt-5"
                    />
                </div>
            </Dialog>
        </div>
    )
}

