import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import face from "../../assets/images/face-2.jpg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import "../employees/style.css";
import { Button, Card } from "antd";
import { CardContent, CardMedia } from "@mui/material";

const ProfileEmployeeCard = () => {
  const path = useParams();
  const id = path.id;
  const [employee, setEmployee] = useState([]);
  const [empImage, setEmpImage] = useState();
  const [empPhone, setEmpPhone] = useState();
  const [downloadLoading, setDownloadLoading]  = useState(false)
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        "http://localhost:8000/api/employee/get-single-employee/" + id
      );
      setEmployee(result.data[0]);
      setEmpImage(
        result.data[0]?.emp_image && JSON.parse(result.data[0]?.emp_image)[0]
      );
      setEmpPhone(
        result.data[0]?.phone && JSON.parse(result.data[0]?.phone).key
      );
    };
    fetchData();
  }, []);

  const handleDownloadPDF = async () => {
    setDownloadLoading(true)
    // const cardElement = document.getElementById('employee-card');
    const cardElement = cardRef.current;
    const contentWidth = 400; // Custom content width in millimeters (mm)
    const contentHeight = 300; // Custom content height in millimeters (mm)
    const scale = 2; // Custom scaling factor

    const scaledWidth = contentWidth * scale;
    const scaledHeight = contentHeight * scale;
    const pdfWidth = scaledWidth + 20; // Add extra padding for PDF width
    const pdfHeight = scaledHeight + 20; // Add extra padding for PDF height

    html2canvas(cardElement, {
      width: scaledWidth,
      height: scaledHeight,
      scale: scale,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, "PNG", 10, 10, contentWidth, contentHeight);
      setDownloadLoading(false)
      pdf.save("employee-card.pdf");
    });
  };

  return (
    <>
      <Card
        style={{ width: "70%", marginTop: "2rem" }}
        className="details-card"
      >
        <CardMedia
          sx={{
            height: 60,
            backgroundColor: "#ecf7ff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px",
          }}
          className="card-media"
        >
          <h5 className="mt-3">Employee Badge</h5>
        </CardMedia>

        <CardContent className="mt-4">
          <Button onClick={handleDownloadPDF} loading={downloadLoading}>Download PDF</Button>
          <div className="root" id="employee-card" ref={cardRef}>
            <div className="body">
              <div className="header">Degital Ipsum</div>
              <div class="card1">
                <div className="img">
                  <img className="image" src={face} alt="img" />
                </div>

                <div class="title">{employee?.emp_name}</div>
                <div class="subtitle">{employee?.designation}</div>
                <div className="break"></div>
                <div class="content">
                  <div>Employee ID: {employee?.id}</div>
                  <div>Email: {employee?.login_email}</div>
                  <div>Phone: {empPhone}</div>
                </div>
              </div>
              <div className="bottom"></div>
            </div>

            <div className="body">
              <div className="header"></div>
              <div class="card2">
                <div class="content">
                  <h5>TERMS & CONDITIONS</h5>
                  <p className="back">
                    This card is non-transferable and is the property of
                    Xxxxxxxxx University. It is intended to last the duration of
                    your stay at Creighton. It is the cardholder’s
                    responsibility to protect and maintain the condition of the
                    card. This card is for the purposes of identification and
                    transaction of Xxxxxxxxx University business. It should be
                    carried when on Creighton property and must be presented on
                    request.
                  </p>
                </div>
              </div>
              <div className="bottom"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileEmployeeCard;
