import {useState} from "react";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import {useSelector} from "react-redux";

import {selectCartTotal} from "../../store/cart/cart.selector.js";
import {selectCurrentUser} from "../../store/user/user.selector.js";

import {BUTTON_TYPE_CLASSES} from "../button/button.component.jsx";

import {PaymentFormContainer, FormContainer, PaymentButton} from "./payment-form.styles.jsx";

const PaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const amount = useSelector(selectCartTotal);
	const currentUser = useSelector(selectCurrentUser);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	
	const paymentHandler = async (e) => {
		e.preventDefault();
		
		if(!stripe || !elements) {
			return;
		}
		
		setIsProcessingPayment(true);
		
		const response = await fetch("/.netlify/functions/create-payment-intent", {
			method: "post",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({amount: amount * 100})
		}).then(response => response.json());
		
		const clientSecret = response.paymentIntent.client_secret;
		
		const paymentResult = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: {
					name: currentUser ? currentUser.displayName : "Sample User"
				}
			}
		});
		
		setIsProcessingPayment(false);
		
		if(paymentResult.error) {
			alert(paymentResult.error);
		} else {
			if(paymentResult.paymentIntent.status == "succeeded") {
				alert("The payment was successful.");
			}
		}
	};
	
	return(
	<PaymentFormContainer>
		<FormContainer onSubmit={paymentHandler}>
			<h2>Credit card</h2>
			<CardElement />
			<PaymentButton isLoading={isProcessingPayment} buttontype={BUTTON_TYPE_CLASSES.inverted}>
				Make a payment
			</PaymentButton>
		</FormContainer>
	</PaymentFormContainer>
	);
};

export default PaymentForm;