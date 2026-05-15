import { PayPalButtons } from "@paypal/react-paypal-js";

const PaypalButton = ({ amount, onSuccess, onError }) => {
    return (
        <PayPalButtons
            style={{ layout: "vertical" }}
            forceReRender={[amount]}
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                currency_code: "EUR",
                                value: parseFloat(amount).toFixed(2)
                            }
                        }
                    ]
                });
            }}
            onApprove={(data, actions) => {
                return actions.order.capture().then(onSuccess);
            }}
            onError={onError}
        />
    );
};

export default PaypalButton;

// in Checkout.jsx add PaypalButton