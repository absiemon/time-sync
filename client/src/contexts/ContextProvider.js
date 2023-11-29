import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [punchOut, setPunchOut] = useState(false);

  const [user, setUser] = useState();

  const [pipelines, setPipelines] = useState([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState();
  const [selectedPipelineName, setSelectedPipelineName] = useState();

  const [selectedPipeline, setSelectedPipeline] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:8000/api/pipeline/get`);
      const data = res.data?.data;
      setSelectedPipelineName(data[0]?.name)
      setPipelines(data);
      setSelectedPipeline(data[0])
      setSelectedPipelineId(data[0]?.pip_id)
    };
    fetchData();
  }, []);

  const [selectedYear_one, setSelectedYear_one] = useState();
  const [selectedYear_two, setSelectedYear_two] = useState();
  const [selectedYear_three, setSelectedYear_three] = useState();
  const [years, setYears] = useState();
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from(
      { length: 6 },
      (_, index) => currentYear - index
    );
    setSelectedYear_one(currentYear);
    setSelectedYear_two(currentYear);
    setSelectedYear_three(currentYear);
    setYears(yearsArray);
  }, []);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      value={{
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
        punchOut,
        setPunchOut,
        user,
        setUser,
        pipelines,
        setPipelines,
        selectedPipelineId,
        setSelectedPipelineId,
        selectedPipelineName,
        setSelectedPipelineName,
        selectedPipeline, setSelectedPipeline,
        selectedYear_one, setSelectedYear_one,
        selectedYear_two, setSelectedYear_two,
        selectedYear_three, setSelectedYear_three,
        years, setYears
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
