import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import authHeader from '../../AuthHeader/AuthHeader';
import ModalAssignTrainer from './ModalAssignTrainer';

export default function AnimalTrainingHistory(animalId) {
    const [trainingData, setTrainingData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" onClick={() => setIsModalOpen(true)} icon="pi pi-plus" text label='Add' />;

    //Get data
    useEffect(() => {
        // Fetch the list of diets from your API endpoint
        axios.get(`http://localhost:8080/zoo-server/api/v1/animal-management/getAllByAnimal/${animalId}`, { headers: authHeader() })
            .then(response => {
                setTrainingData(response.data.data);
                setRefresh(false)
            })
            .catch(error => console.error(error));
    }, [refresh, animalId]);

    const handleClose = () => {
        setIsModalOpen(false)
        setRefresh(true)
    }

    return (
        <div className='container' style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
            <div className="card">
                {ModalAssignTrainer(animalId, isModalOpen, handleClose)}
                <DataTable value={trainingData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                    <Column field="fullName" header="Trainer" style={{ width: '16%' }}></Column>
                    <Column field="animalName" header="Animal" style={{ width: '16%' }}></Column>
                    <Column field="dateStart" header="Date Start" style={{ width: '16%' }}></Column>
                    {/* {trainingData.dateEnd ? (<Column field="dateEnd" header="Date End" style={{ width: '16%' }}></Column>) : ("Now")} */}
                    <Column field="dateEnd" header="Date End" style={{ width: '16%' }}></Column>
                    <Column field="description" header="Description" style={{ width: '16%' }}></Column>
                </DataTable>
            </div>
        </div>
    )
}
