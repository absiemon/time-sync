import { Divider, Select, Spin } from 'antd';
import React from 'react'

function ChartBG({selectedYear, setSelectedYear, years, loading, element, header, width}) {
  return (
    <div
          className="cardbg rounded-sm info_tab_one"
          style={{ width: width, minHeight:'580px' }}
        >
          <header className="px-4 py-3 text-xl"> {header}</header>
          <Divider className="bg-secondary" />
          <div className="px-4 py-3">
            <Select
              style={{
                width: 150,
                marginBottom: "10px",
              }}
              value={selectedYear}
              // defaultValue={selectedYear}
              onChange={(val) => setSelectedYear(val)}
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
            {!loading ? (
              <div className="py-2">
                {element}
              </div>
            ) : (
              <Spin
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "100px"
                }}
              />
            )}
          </div>
        </div>
  )
}

export default ChartBG