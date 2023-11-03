import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import authHeader from '../../AuthHeader/AuthHeader'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'

export default function ModalAddManageArea(areaId, isModalOpen, handleClose) {
    const [newAreaManage, setNewAreaManage] = useState({
        areaId: areaId,
        dateEnd: "",
        dateStart: "",
        userId: 0

    })
    const [staffData, setStaffData] = useState([])
    const [selectedStaff, setSelectedStaff] = useState({});


    useEffect(() => {
        axios.get(`http://localhost:8080/zoo-server/api/v1/user/getAllStaffs`, { headers: authHeader() })
            .then(response => setStaffData(response.data.data))
            .catch(error => console.error(error));
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAreaManage({
            ...newAreaManage,
            [name]: value
        });
    }

    const handleSelectedChange = (event) => {
        setSelectedStaff(event.value);
        setNewAreaManage({
            ...newAreaManage,
            userId: event.target.value.userId
        });
    }

    const handleUpdateInputChange = (event, name) => {
        if (name !== 'dateStart' && name !== 'dateEnd') {
            const { name, value } = event.target;
            console.log(value);

            setNewAreaManage({ ...newAreaManage, [name]: value });
        } else {
            // Convert the selected date to a valid Date object or null
            const dateValue = event ? new Date(event) : null;

            // Use the formatted date value in the state
            setNewAreaManage({ ...newAreaManage, [name]: dateValue });
        }
    };
    const handleAddArea = async () => {
        await axios
            .post(`http://localhost:8080/zoo-server/api/v1/area-management/createAreaManagement`, newAreaManage, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setTimeout(handleClose, 2000);

            })
            .catch((error) => {
                if (newAreaManage.userId === null) {
                    show("Please, choose staff", 'red');
                }
                else if (newAreaManage.dateStart === "") {
                    show("Please, choose date start", 'red');
                }
                else {
                    show(error.response.data.message, 'red');
                }
            });
    }
    const toast = useRef(null);

    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };
    return (
        <div>
            <Dialog
                header="Assign Staff"
                visible={isModalOpen}
                style={{ width: '800px' }}
                modal
                onHide={() => handleClose()}
            >
                <Toast ref={toast} />
                <div class="formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="fullName">Staff</label>
                        <br />
                        <Dropdown
                            value={selectedStaff}
                            onChange={handleSelectedChange}
                            options={staffData}
                            name='userId'
                            optionLabel='fullName'
                            placeholder="Select a Staff"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="dateStart">Date Start</label>
                        <br />
                        <Calendar
                            id="dateStart"
                            className='w-full'
                            name="dateStart"
                            value={newAreaManage.dateStart}
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
                            value={newAreaManage.dateEnd}
                            onChange={(e) => handleUpdateInputChange(e.value, "dateEnd")}
                        />
                    </div>
                    <Button
                        className="p-button-primary mt-5 "
                        label="Assign staff for this area"
                        icon="pi pi-pencil"
                        onClick={handleAddArea}
                    />
                </div>
            </Dialog >
        </div >
    )
}
