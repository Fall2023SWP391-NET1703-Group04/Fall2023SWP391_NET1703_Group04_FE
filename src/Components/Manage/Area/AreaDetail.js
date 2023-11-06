import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Fieldset } from 'primereact/fieldset';
import authHeader from '../../AuthHeader/AuthHeader';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ModalUpdateManageArea from './ModalUpdateManageArea';
import ModalAddManageArea from './ModalAddManageArea';

export default function CageDetail() {
    const { areaId } = useParams();
    const [areaData, setAreaData] = useState([]);
    const [cageData, setCageData] = useState([]);
    const [areaManageData, setAreaManageData] = useState([]);
    const [historyManage, setHistoryManage] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const toast = useRef(null);
    const defaultImage = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";

    useEffect(() => {
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/area/getAreaById/${areaId}`, { headers: authHeader() })
            .then((response) => {
                setAreaData(response.data);
                setCageData(response.data.animalCageResponseList);
                setRefresh(false);
            })
            .catch((error) => console.error(error));

        // axios.get(`http://localhost:8080/zoo-server/api/v1/area-management/getAreaManagementResponse/${areaId}`, { headers: authHeader() })
        //     .then(response => {
        //         setAreaManageData(response.data.data)
        //     })
        //     .catch(error => {
        //         show(error.response.data.message, 'red');
        //         console.error(error);
        //     });

        //get area history data
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/area-management/getAllByArea/${areaId}`, { headers: authHeader() })
            .then((response) => {
                setHistoryManage(response.data.data);
                var areaManagement = response.data.data.find(data => {
                    return data.managing === true
                });
                setAreaManageData(areaManagement);
            })
            .catch((error) => console.error(error));

    }, [areaId, refresh]);


    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };

    const header = () => {
        const imageUrl = `http://localhost:3000/img/${areaManageData.image}`;
        const fallbackImageUrl = defaultImage;

        return (
            <img
                src={imageUrl || fallbackImageUrl}
                alt="Animal"
                onError={(e) => {
                    e.target.src = fallbackImageUrl;
                }}
            />
        );
    };

    const footer = (
        <>
            <Button label="Update" onClick={() => { setIsModalOpen(true) }} icon="pi pi-pencil" />
        </>
    );

    const footerForAdd = (
        <>
            <Button label="Assign Staff" onClick={() => { setIsAddModalOpen(true) }} icon="pi pi-pencil" />
        </>
    );


    const handleClose = () => {
        setIsModalOpen(false);
        setIsAddModalOpen(false);
        setRefresh(true)
    }

    return (
        <div className='grid ' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <Toast ref={toast} />

            {
                ModalUpdateManageArea(Number(areaId), areaManageData ? areaManageData : {}, isModalOpen, handleClose)}
            {ModalAddManageArea(Number(areaId), isAddModalOpen, handleClose)}
            <div className="card col-4">
                {areaManageData?.managing ?
                    <Fieldset legend={areaManageData?.areaName}>
                        <Card title="Manager" subTitle={areaManageData?.fullName} footer={footer} header={header}>
                            <p className="m-0">
                                Start date: {areaManageData?.dateStart}
                            </p>
                            <p className="m-0">
                                End date: {areaManageData?.dateEnd}
                            </p>

                        </Card>
                    </Fieldset>
                    :
                    <Fieldset legend="No one manage this area">
                        <Card title="Manager" footer={footerForAdd}>
                        </Card>
                    </Fieldset>
                }

            </div>
            <div class="col-7">
                <div className='card'>
                    <Fieldset legend={areaData.areaName} toggleable collapsed>
                        <DataTable value={cageData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}" stripedRows>
                            <Column field="animalCageName" header="Cage Name" />
                            <Column field="description" header="Description" />
                        </DataTable>
                    </Fieldset>
                    <Fieldset legend="Manage History" toggleable collapsed>
                        <DataTable value={historyManage} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}" stripedRows>
                            <Column field="areaName" header="Area Name" />
                            <Column field="fullName" header="Staff" />
                            <Column field="dateStart" header="Start Date" />
                            <Column field="dateEnd" header="End Date" />
                            <Column field="managing" header="Work or not" />
                        </DataTable>
                    </Fieldset>
                </div>
            </div>


        </div>
    )
}