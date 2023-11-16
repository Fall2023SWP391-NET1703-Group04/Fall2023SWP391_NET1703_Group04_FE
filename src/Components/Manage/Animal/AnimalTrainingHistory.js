import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import authHeader from '../../AuthHeader/AuthHeader';
import ModalAssignTrainer from './ModalAssignTrainer';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import dayjs from 'dayjs';
import { InputTextarea } from 'primereact/inputtextarea';

export default function AnimalTrainingHistory(animalId) {
    const [trainingData, setTrainingData] = useState([]);
    const [trainingUpdate, setTrainingUpdate] = useState({});
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState();
    const [refresh, setRefresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    var [animalTrainingId, setAnimalTrainingId] = useState(null);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" onClick={() => setIsModalOpen(true)} icon="pi pi-plus" text label='Add' />;

    //Get data
    useEffect(() => {
        // Fetch the list of diets from your API endpoint
        axios.get(`http://localhost:8080/zoo-server/api/v1/animal-management/getAllByAnimal/${animalId}`, { headers: authHeader() })
            .then(response => {
                const trainingWithDateObject = response.data.data.map((data) => ({
                    ...data,
                    dateStart: new Date(data.dateStart),
                    dateEnd: data.dateEnd ? new Date(data.dateEnd) : null,
                }));
                setTrainingData(trainingWithDateObject);
                setRefresh(false)
            })
            .catch(error => console.error(error));

        axios.get(`http://localhost:8080/zoo-server/api/v1/user/getAllTrainers`, { headers: authHeader() })
            .then(response => setTrainers(response.data.data))
            .catch(error => console.error(error));
    }, [refresh, animalId]);

    const dateTemplate = (rowData, column) => {
        const dateValue = rowData[column.field];
        if (!dateValue) {
            return "Now...";
        }
        return dayjs(dateValue).format("MM/DD/YYYY");
    };

    const handleClose = () => {
        setIsModalOpen(false)
        setRefresh(true)
    }

    //update 
    const openUpdateModal = (rowData) => {
        setAnimalTrainingId(rowData.animalTrainingId);
        // console.log(animalTrainingId);
        setTrainingUpdate({
            animalId: animalId,
            dateEnd: rowData.dateEnd,
            dateStart: rowData.dateStart,
            description: rowData.description,
            userId: rowData.userId
        })
        setIsUpdateModalOpen(true)
    }

    const handleUpdateInputChange = (event, name) => {
        if (name !== 'dateStart' && name !== 'dateEnd') {
            const { name, value } = event.target;
            setTrainingUpdate({ ...trainingUpdate, [name]: value });
        } else {
            // Convert the selected date to a valid Date object or null
            const dateValue = event ? new Date(event) : null;
            // Use the formatted date value in the state
            setTrainingUpdate({ ...trainingUpdate, [name]: dateValue });
        }
    };

    const handleUpdateTrainerChange = (event) => {
        console.log(event);
        setSelectedTrainer(event.value)
        setTrainingUpdate({ ...trainingUpdate, userId: event.value.userId });
    };

    const handleUpdateTraining = () => {
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/animal-management/updateAnimalManagement/${animalTrainingId}`, trainingUpdate, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
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
        <div className='container' style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
            <div className="card">
                {ModalAssignTrainer(animalId, isModalOpen, handleClose)}
                <DataTable value={trainingData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                    <Column field="fullName" header="Trainer" />
                    <Column field="animalName" header="Animal" />
                    <Column field="dateStart" header="Date Start" body={dateTemplate} />
                    <Column field="dateEnd" header="Date End" body={dateTemplate} />
                    <Column field="description" header="Description" />
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

            {/* Modal Update training */}
            <Dialog
                header="Update Training History"
                visible={isUpdateModalOpen}
                style={{ width: '800px' }}
                modal
                onHide={() => setIsUpdateModalOpen(false)}
            >
                <Toast ref={toast} />
                <div className="field col-12">
                    <label htmlFor="trainer">Trainer</label>
                    <br />
                    <Dropdown
                        name='userId'
                        className='w-full'
                        optionLabel="fullName"
                        value={selectedTrainer}
                        options={trainers}
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
                        value={trainingUpdate.dateStart}
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
                        value={trainingUpdate.dateEnd}
                        onChange={(e) => handleUpdateInputChange(e.value, "dateEnd")}
                    />
                </div>
                <div className="field col-12">
                    <label htmlFor="description">Description</label>
                    <br />
                    <InputTextarea
                        id="description"
                        className='w-full min-h-full'
                        name="description"
                        value={trainingUpdate.description}
                        onChange={handleUpdateInputChange}
                    />
                </div>
                <Button
                    label="Update Training"
                    icon="pi pi-pencil"
                    onClick={handleUpdateTraining}
                    className="p-button-primary mt-5"
                />
            </Dialog>
        </div >
    )
}
