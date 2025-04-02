import { compose, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
// import {thunk} from "redux-thunk";
import createSagaMiddleware from "redux-saga";

import {rootSaga} from "./root-saga.js";

import { rootReducer } from './root-reducer';

const sagaMiddleware = createSagaMiddleware();

const middleWares = [process.env.NODE_ENV === "development" && logger, sagaMiddleware].filter(Boolean);

const composedEnhancers = compose(applyMiddleware(...middleWares));

export const store = createStore(rootReducer, undefined, composedEnhancers);

sagaMiddleware.run(rootSaga);