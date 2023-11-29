import { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Button, Input, message, Drawer } from "antd";
import { } from "react-router-dom";
import { Select } from 'antd';
// import '../../assets/styles/principal.css'
import '../../assets/styles/home.css'

import axios from 'axios';
import moment from 'moment';
import { useStateContext } from '../../contexts/ContextProvider';

// import TextArea from 'antd/lib/input/TextArea';


function TakeBreakModal({ setIsOpen, isOpen, todayAtten }) {

    const { punchOut, setPunchOut } = useStateContext();

    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isOnBreak, setIsOnBreak] = useState(false);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {

        const storedTimer = localStorage.getItem('breakTimer');
        const storedStartTime = localStorage.getItem('breakStartTime');
    
        if (storedTimer && storedStartTime) {
          const elapsedTime = Math.floor((Date.now() - parseInt(storedStartTime, 10)) / 1000);
          setTimer(parseInt(storedTimer, 10) + elapsedTime);
          setStartTime(parseInt(storedStartTime, 10));
          setIsOnBreak(true);
        }
    }, []);

    useEffect(() => {
        let interval;
    
        if (isOnBreak) {
          interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
          }, 1000);
        }
        return () => {
          clearInterval(interval);
        };
      }, [isOnBreak]);


    const formatTime = (time) => {
        const hours = Math.floor(time / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const handleFinish = async (onBreak) => {
        setLoading(true)
        const currentTime = moment();
        try {
            if (!onBreak) {
                const break_time = formatTime(timer);
                await axios.put(`http://localhost:8000/api/attendance/update-employee-attendance/${todayAtten[0].id}`, {
                    on_break: 0, break_time: break_time, break_end_time: currentTime
                }).then((res) => {
                    setLoading(false)
                    setIsOpen(false);
                    setPunchOut(!punchOut)
                    setIsOnBreak(false);
                    localStorage.removeItem('breakStartTime')
                    message.success('Break time ended');
                }).catch((err) => {
                    setLoading(false)
                    message.error('Error submitting form');
                })
            } else {

                await axios.put(`http://localhost:8000/api/attendance/update-employee-attendance/${todayAtten[0].id}`, {
                    on_break: 1, break_start_time: currentTime
                }).then((res) => {
                    setLoading(false)
                    setIsOpen(false);
                    setPunchOut(!punchOut)

                    const currentStartTime = Date.now();
                    setStartTime(currentStartTime);
                    setIsOnBreak(true);
                    localStorage.setItem('breakStartTime', currentStartTime);
                    message.success('Break time started');

                }).catch((err) => {
                    setLoading(false)
                    message.error('Error submitting form');
                })
            }
        } catch (err) {
            message.error('Error submitting form');
        }
    };


    return (
        <Drawer
            placement="top"
            mask={false}
            onClose={() => setIsOpen(false)}
            visible={isOpen}
            width={100}
            height={300}
            rootClassName='attandance-drawer'
            bodyStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            title="Start Break"
            footer={
                <div className="form-buttons" style={{ display: "flex", justifyContent: "center" }}>
                    {todayAtten && todayAtten.length>0 && todayAtten[0].on_break === 1 ?
                        <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "#fc6510" }} className='punch' loading={loading} onClick={() => handleFinish(false)}>
                            End
                        </Button>
                        : <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "limegreen" }} className='punch' loading={loading} onClick={() => handleFinish(true)}>
                            Start
                        </Button>
                    }
                    <Button type="default" className='punch' style={{ backgroundColor: '#dbdbdb' }} onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                </div>
            }
        >
            {todayAtten && todayAtten.length>0 && todayAtten[0].on_break === 0 ?
                <div className='text-lg text-primary'>Lunch Break ( 1h )</div>
                :
                <div className='text-center'>
                    <div className='text-2xl text-primary mb-2'>Lunch break</div>
                    <div className='text-4xl' style={{color:'#FC6510'}}>{formatTime(timer)}</div>
                </div>
            }
        </Drawer>

    );
}

export default TakeBreakModal;
