import {all, call} from "redux-saga/effects";

import {categoriesSaga} from "./categories/category.saga.js";

export function* rootSaga() {
	yield all([call(categoriesSaga)]);
}