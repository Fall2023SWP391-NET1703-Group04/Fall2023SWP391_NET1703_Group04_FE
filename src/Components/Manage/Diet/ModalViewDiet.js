import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import axios from 'axios'
import authHeader from '../../AuthHeader/AuthHeader'
import { MultiSelect } from 'primereact/multiselect'

export default function ModalViewDiet(data, isModalOpen, handleClose) {
    const [foodDTOS, setFoodDTOS] = useState([])

    console.log(data);
    useEffect(() => {
        axios
            .get('http://localhost:8080/zoo-server/api/v1/food/getAllFoods', { headers: authHeader() })
            .then((response) => {
                const foodsWithDateObjects = response.data.data.map((food) => ({
                    ...food,
                    dateStart: new Date(food.dateStart),
                    dateEnd: new Date(food.dateEnd),
                }));
                setFoodDTOS(foodsWithDateObjects);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    return (
        <div>
            <Dialog
                header="Diet Detail"
                visible={isModalOpen}
                style={{ width: '500px' }}
                modal
                onHide={() => handleClose()}
            >
                <div className="p-field">
                    <label htmlFor="updateDietName">Diet Name</label>
                    <br />
                    <p
                        id="dietName"
                        className='w-full'
                        name="dietName"
                    >
                        {data.dietName}
                    </p>
                </div>
                <div className="p-field">
                    <label htmlFor="updateFoodItems">Food</label>
                    <br />
                    <ul>
                        {data.dietFoodResponses?.map((food) => (
                            <p key={food.foodId}>Name: {food.foodName}, Quantity: {food.dietFoodQuantity}</p>
                        ))}
                    </ul>

                </div>
                <Button
                    label="Close"
                    icon="pi pi-times"
                    onClick={handleClose}
                    className="p-button-primary mt-5"
                />
            </Dialog>
        </div >
    )
}
