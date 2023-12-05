import express from "express";
import cors from "cors";
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import employee from './router/employee_router.js'

import authRoute from './router/authRoute.js'

import DealRoute from './router/deal_router.js'
import PipelineRoute from './router/pipeline_router.js'

import personsRoute from './router/persons_router.js'
import organizationRoute from './router/organization_router.js'

import proposalRoute from './router/proposal_router.js'

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({
  parameterLimit: 100000,
  limit: '50mb'
}))
app.use(morgan());
app.disable('etag')

const allowedOrigins = ['http://localhost:3000'];
const corsOptions = {
    credentials: true,
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization, Cookie'
};

app.use(cors(corsOptions));


app.use('/api/employee', employee);

app.use('/api/auth', authRoute);


app.use('/api/deal', DealRoute);
app.use('/api/pipeline', PipelineRoute);

app.use('/api/persons', personsRoute);
app.use('/api/organization', organizationRoute);

app.use('/api/proposal', proposalRoute);

const port = process.env.PORT || 8000;

const server = app.listen(port);
