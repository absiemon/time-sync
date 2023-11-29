import { useEffect, useState } from "react";
import { } from "react-router-dom";

import {
  EditOutlined,
  HomeOutlined,
  UserOutlined,
  UserDeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "../assets/styles/home.css";
import "./employees/style.css";

// import EChart from "../components/chart/EChart";
import axios from "axios";
import DealLineChart from "./LineChart";
import { useStateContext } from "../contexts/ContextProvider";
import ChartBG from "./ChartBG";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Divider, Select, Spin } from "antd";
import Card from "./pipeline view/Card";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const { selectedYear_one, setSelectedYear_one, selectedYear_two, setSelectedYear_two, years , selectedYear_three, setSelectedYear_three } = useStateContext();
  const [loading_one, setLoading_one] = useState(false);
  const [loading_two, setLoading_two] = useState(false);
  const [loading_three, setLoading_three] = useState(false);
  const [data_one, setData_one] = useState();
  const [data_two, setData_two] = useState();
  const [data_three, setData_three] = useState();


  useEffect(() => {
    setLoading_one(true);
    axios
      .get("http://localhost:8000/api/deal/get_deal?year=" + selectedYear_one)
      .then((res) => {
        setData_one(res.data.data);
        setLoading_one(false);
      })
      .catch((err) => { });
  }, [selectedYear_one]);

  useEffect(() => {
    setLoading_two(true);
    axios
      .get("http://localhost:8000/api/deal/get_deal_status?year=" + selectedYear_two)
      .then((res) => {
        setData_two(res.data.data);
        setLoading_two(false);
      })
      .catch((err) => { });
  }, [selectedYear_two]);

  const data2 = {
    labels: ['Lost', 'Won'],
    datasets: [
      {
        label: 'deals',
        data: data_two,
        backgroundColor: [
          'rgb(223, 71, 54)',
          'rgb(92, 222, 100)',
        ],
        borderWidth: 0,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false, // Set to false to allow explicit control over height and width
    responsive: true, // Set to false to prevent automatic resizing
  };

  useEffect(() => {
    setLoading_three(true);
    axios
      .get("http://localhost:8000/api/deal/get_won-loss_deals?year=" + selectedYear_three)
      .then((res) => {
        setData_three(res.data.data);
        setLoading_three(false);
      })
      .catch((err) => { });
  }, [selectedYear_three]);

  return (
    <main className="p-8">
      <div className="flex gap-4">
        <ChartBG
          selectedYear={selectedYear_one}
          setSelectedYear={setSelectedYear_one}
          years={years}
          element={<DealLineChart data={data_one} />}
          loading={loading_one}
          header={"Deals created"}
          width={"750px"}
        />

        <ChartBG
          selectedYear={selectedYear_two}
          setSelectedYear={setSelectedYear_two}
          years={years}
          element={<Doughnut data={data2} height="400px"
            width="400px" options={options} />}
          loading={loading_two}
          header={"Won/Lost deals"}
          width={"320px"}
        />
      </div>

      <div
        className="cardbg rounded-sm info_tab_one mt-5"
        style={{ width: "100%", minHeight: '400px' }}
      >
        <header className="px-4 py-3 text-xl flex gap-5">
          <p> Won/Lost deals over the year </p>
          <Select
            style={{
              width: 150,
              marginBottom: "10px",
            }}
            value={selectedYear_three}
            // defaultValue={selectedYear}
            onChange={(val) => setSelectedYear_three(val)}
            options={
              years &&
              years.map((val) => {
                return {
                  value: val,
                  label: val,
                };
              })
            }
          />
        </header>
        <Divider className="bg-secondary" />
        <div className="px-4" 
          style={{
            backgroundColor: "#20232A",
            height: "320px",
            minHeight: "320px",
            width: "100%",
            overflowX: "scroll",
            overflowY: 'hidden'
          }}
        >

          {!loading_three ? (
            <div className="py-2 flex gap-3">
              {data_three &&
               data_three.map((obj)=>{
                return (
                  <Card details={obj}/>
             
                )
                })}
            </div>
          ) : (
            <Spin
              style={{
                position:'relative',
                top:'50%',
                left: "50%"
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
