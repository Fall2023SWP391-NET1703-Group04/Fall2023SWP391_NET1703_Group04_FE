import { Outlet } from "react-router-dom";
import SideBar from "../Sidebar/SideBar";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../AuthHeader/AuthHeader";
import { Chart } from "primereact/chart";


const DashBoard = () => {
    const [animalList, setAnimalList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [trainerList, setTrainerList] = useState([]);
    const [dietList, setDietList] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [foodIsNotExpiredList, setFoodIsNotExpiredList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [animalCageList, setAnimalCageList] = useState([]);
    const [animalCageIsNotUseList, setAnimalCageIsNotUseList] = useState([]);

    const [chartPieData, setChartPieData] = useState({});
    const [chartPieOptions, setChartPieOptions] = useState({});

    const [chartPieFoodData, setChartPieFoodData] = useState({});
    const [chartPieFoodOptions, setChartPieFoodOptions] = useState({});

    //Get data
    useEffect(() => {
        // Fetch the list of Animal from your API endpoint
        axios
            .get("http://localhost:8080/zoo-server/api/v1/animal/getAllAnimal", {
                headers: authHeader(),
            })
            .then((response) => {
                setAnimalList(response.data.data);
            })
            .catch();
        // Fetch the list of User from your API endpoint
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/user/getAllUsers`, {
                headers: authHeader(),
            })
            .then((response) => setUserList(response.data.data))
            .catch();
        // Fetch the list of Trainer from your API endpoint
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/user/getAllTrainers`, {
                headers: authHeader(),
            })
            .then((response) => setTrainerList(response.data.data))
            .catch();

        // Fetch the list of Diet from your API endpoint
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/diet/getAllDiets`, {
                headers: authHeader(),
            })
            .then((response) => setDietList(response.data.data))
            .catch();

        // Fetch the list of Food from your API endpoint
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/food/getAllFoods`, {
                headers: authHeader(),
            })
            .then((response) => setFoodList(response.data.data))
            .catch();
        // Fetch the list of FoodIsNotExpired from your API endpoint
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/food/getAllFoodNotExpired`, {
                headers: authHeader(),
            })
            .then((response) => setFoodIsNotExpiredList(response.data.data))
            .catch();
        // Fetch the list of Diet from your API endpoint
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/diet/getAllDiets`, {
                headers: authHeader(),
            })
            .then((response) => setDietList(response.data.data))
            .catch();

        // Fetch the list of product from your API endpoint
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/product/getAllProduct`, {
                headers: authHeader(),
            })
            .then((response) => setProductList(response.data.data))
            .catch();
        // Fetch the list of AnimalCage from your API endpoint
        axios
            .get(
                `http://localhost:8080/zoo-server/api/v1/animalCage/getAllAnimalCage`,
                { headers: authHeader() }
            )
            .then((response) => setAnimalCageList(response.data.data))
            .catch();

        // Fetch the list of AnimalCageIsNotUser from your API endpoint
        axios
            .get(
                `http://localhost:8080/zoo-server/api/v1/animalCage/getAllAnimalCagesNotUse`,
                { headers: authHeader() }
            )
            .then((response) => setAnimalCageIsNotUseList(response.data.data))
            .catch();

        // Chart Animal Cage
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ["Animal Cage Used", "Animal Cage Is Not Use"],
            datasets: [
                {
                    data: [
                        animalCageList.length - animalCageIsNotUseList.length,
                        animalCageIsNotUseList.length,
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue("--blue-500"),
                        documentStyle.getPropertyValue("--yellow-500"),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue("--blue-400"),
                        documentStyle.getPropertyValue("--yellow-400"),
                    ],
                },
            ],
        };
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                },
            },
        };

        setChartPieData(data);
        setChartPieOptions(options);


        //  Chart Food
        const foodData = {
            labels: ["Food", "Food Is Not Expired"],
            datasets: [
                {
                    data: [
                        foodList.length - foodIsNotExpiredList.length,
                        foodIsNotExpiredList.length,
                    ],
                    backgroundColor: [
                        "#f54242",
                        "#0af529",
                    ],
                    hoverBackgroundColor: [
                        "#f54242",
                        "#0af529",
                    ],
                },
            ],
        };
        const foodOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                },
            },
        };

        setChartPieFoodData(foodData);
        setChartPieFoodOptions(foodOptions);
    }, [animalCageIsNotUseList.length, animalCageList.length, foodIsNotExpiredList.length, foodList.length]);
    return (<div class="col-8 ml-2">
        <div class="grid mt-3">
            <h5>DashBoard</h5>
            <div class="col-12">
                <div class="flex flex-wrap column-gap-4 row-gap-6">
                    <div class="border-round w-12rem  h-20rem  font-bold flex align-items-center justify-content-center">
                        <Card title="Total Animal" className="h-20rem w-12rem">
                            <h2 className="m-0">{animalList.length}</h2>
                            <img
                                src="http://localhost:3000/img/images.png"
                                alt="img"
                                style={{ width: "70px", height: "100px" }}
                                className="mt-5"
                            />
                        </Card>
                    </div>
                    <div class="border-round w-12rem  h-20rem  font-bold flex align-items-center justify-content-center">
                        <Card title="Total User" className="h-20rem w-12rem">
                            <h2 className="m-0">{userList.length}</h2>
                            <img
                                src="http://localhost:3000/img/666201.png"
                                alt="img"
                                style={{ width: "70px", height: "100px" }}
                                className="mt-5"
                            />
                        </Card>
                    </div>
                    <div class="border-round w-12rem h-20rem  font-bold flex align-items-center justify-content-center">
                        <Card title="Total Trainer" className="h-20rem w-12rem">
                            <h2 className="m-0">{trainerList.length}</h2>
                            <img
                                src="http://localhost:3000/img/trainer.png"
                                alt="img"
                                style={{ width: "70px", height: "100px" }}
                                className="mt-5"
                            />
                        </Card>
                    </div>
                    <div class="border-round w-12rem  h-20rem  font-bold flex align-items-center justify-content-center">
                        <Card title="Total Diet" className="h-20rem w-12rem">
                            <h2 className="m-0">{dietList.length}</h2>
                            <img
                                src="http://localhost:3000/img/6774898.png"
                                alt="img"
                                style={{ width: "70px", height: "100px" }}
                                className="mt-5"
                            />
                        </Card>
                    </div>
                    <div class="border-round w-12rem  h-20rem  font-bold flex align-items-center justify-content-center">
                        <Card title="Total Food" className="h-20rem w-12rem">
                            <h2 className="m-0">{foodList.length}</h2>
                            <img
                                src="http://localhost:3000/img/food.png"
                                alt="img"
                                style={{ width: "70px", height: "100px" }}
                                className="mt-5"
                            />
                        </Card>
                    </div>
                    <div class="border-round w-12rem  h-20rem  font-bold flex align-items-center justify-content-center">
                        <Card title="Products" className="h-20rem w-12rem">
                            <h2 className="m-0">{productList.length}</h2>
                            <img
                                src="http://localhost:3000/img/zoo_gift.jpg"
                                alt="img"
                                style={{ width: "70px", height: "100px" }}
                                className="mt-5"
                            />
                        </Card>
                    </div>
                    <div class="border-round w-12rem h-20rem  font-bold flex align-items-center justify-content-center">
                        <Card title="Total Cage" className="h-20rem w-12rem">
                            <h2 className="m-0">{animalCageList.length}</h2>
                            <img
                                src="http://localhost:3000/img/animal_cage_icon.png"
                                alt="img"
                                style={{ width: "70px", height: "100px" }}
                                className="mt-5"
                            />
                        </Card>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="text-center p-3 border-round-sm  font-bold">
                    <div className="card flex justify-content-center">
                        <Chart
                            type="pie"
                            data={chartPieData}
                            options={chartPieOptions}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="text-center p-3 border-round-sm  font-bold">
                    <div className="card flex justify-content-center">
                        <Chart
                            type="pie"
                            data={chartPieFoodData}
                            options={chartPieFoodOptions}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default DashBoard;