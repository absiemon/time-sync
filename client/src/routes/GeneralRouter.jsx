import React, { lazy, Suspense } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import { Home } from "../pages";
import "../App.css";
import { Spin } from "antd";
import Profile2 from "../pages/profile/Profile2";

import Pipeline from "../pages/pipelines/Pipeline";
import PipelineForm from "../pages/pipelines/PipelineForm";
import Sales_pipelines from "../pages/pipeline view/Sales_pipelines";
import NotFound from "../pages/404.jsx";

const Persons = lazy(() => import("../pages/persons/Persons"));
const PersonsForm = lazy(() => import("../pages/persons/PersonsForm"));
const Organization = lazy(() =>
  import("../pages/organization/Person_Organization")
);
const OrganizationForm = lazy(() =>
  import("../pages/organization/OrganizationForm")
);
const Proposal = lazy(() => import("../pages/proposal/Proposal"));
const ProposalForm = lazy(() => import("../pages/proposal/ProposalForm"));

const GeneralRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/persons"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <Persons />
            </Suspense>
          }
        />
        <Route
          path="/persons/create"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <PersonsForm />
            </Suspense>
          }
        />
        <Route
          path="/persons/create/:id"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <PersonsForm />
            </Suspense>
          }
        />

        <Route
          path="/organization"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <Organization />
            </Suspense>
          }
        />
        <Route
          path="/organization/create"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <OrganizationForm />
            </Suspense>
          }
        />
        <Route
          path="/organization/create/:id"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <OrganizationForm />
            </Suspense>
          }
        />

        <Route
          path="/proposal"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <Proposal />
            </Suspense>
          }
        />
        <Route
          path="/proposal/create"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <ProposalForm />
            </Suspense>
          }
        />
        <Route
          path="/proposal/create/:id"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <ProposalForm />
            </Suspense>
          }
        />

        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/pipeline/create" element={<PipelineForm />} />
        <Route path="/pipeline/create/:id" element={<PipelineForm />} />
        <Route path="/pipeline/view" element={<Sales_pipelines />} />

        <Route path="/user/my_profile" element={<Profile2 />} />

        <Route element={<NotFound />} />
      </Routes>
    </>
  );
};

export default GeneralRoutes;
