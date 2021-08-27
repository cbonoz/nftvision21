

// https://developers.circle.com/reference#payments-payments-create
import axios from 'axios'
import { CIRCLE_BASE_URL } from './constants'

// https://developers.circle.com/reference#payments-cards-create
export const createCard = (data) => {
    const url = `${CIRCLE_BASE_URL}/v1/cards`
    return axios.post(url,data)
}

https://developers.circle.com/reference#payments-payments-create
export const createPayment = (data) => {
    const url = `${CIRCLE_BASE_URL}/v1/payments`
    return axios.post(url ,data)
}