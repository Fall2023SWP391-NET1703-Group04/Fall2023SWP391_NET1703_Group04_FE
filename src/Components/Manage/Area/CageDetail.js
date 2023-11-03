import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Fieldset } from 'primereact/fieldset';
import authHeader from '../../AuthHeader/AuthHeader';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { Countries } from "../../Data/Countries"
import { Gender } from '../../Data/Gender';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function CageDetail() {
    const { areaId } = useParams();
    const [cageData, setCageData] = useState([{}]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/area/getAreaById/${areaId}`, { headers: authHeader() })
            .then((response) => {
                console.log(response.data.data);
                setCageData(response.data);
            })
            .catch((error) => console.error(error));

        //catalogues
        // axios.get('http://localhost:8080/zoo-server/api/v1/catalogue/getAllCatalogues', { headers: authHeader() })
        //     .then(response => {
        //         setCatalogues(response.data)
        //     })
        //     .catch(error => console.error(error));
    }, [areaId, refresh]);


    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" onClick={() => setIsModalOpen(true)} icon="pi pi-plus" text label='Add' />;

    return (
        <div className='grid ' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <Toast ref={toast} />
            <div className="card col-4">
                <Fieldset legend={cageData?.areaName} >
                    <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}">
                        <Column
                            header="Name"
                            field="animalCageResponseList"
                            body={(rowData) => (
                                <ul>
                                    {rowData.animalCageResponseList.map((cage) => (
                                        <p key={cage.animalCageId}>{cage.animalCageName}</p>
                                    ))}
                                </ul>
                            )}
                        />
                        {/* <Column field="animalName" header="Animal" style={{ width: '16%' }}></Column>
                        <Column field="dateStart" header="Date Start" style={{ width: '16%' }}></Column>
                        <Column field="dateEnd" header="Date End" style={{ width: '16%' }}></Column>
                        <Column field="description" header="Description" style={{ width: '16%' }}></Column> */}
                    </DataTable>
                </Fieldset>
            </div>


        </div>
    )
}