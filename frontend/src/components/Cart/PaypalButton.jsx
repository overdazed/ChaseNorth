import { PayPalButtons } from "@paypal/react-paypal-js";

const PaypalButton = ({ amount, shippingAddress, onSuccess, onError }) => {
    return (
        <PayPalButtons
            style={{ layout: "vertical" }}
            forceReRender={[amount, shippingAddress]}
            createOrder={(data, actions) => {
                const purchaseUnit = {
                    amount: {
                        currency_code: "EUR",
                        value: parseFloat(amount).toFixed(2)
                    }
                };

                if (shippingAddress) {
                    purchaseUnit.shipping = {
                        name: {
                            full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim()
                        },
                        address: {
                            address_line_1: shippingAddress.address,
                            admin_area_2: shippingAddress.city,
                            postal_code: shippingAddress.postalCode,
                            country_code: shippingAddress.country ? shippingAddress.country.substring(0, 2).toUpperCase() : "DE"
                        }
                    };
                }

                return actions.order.create({
                    purchase_units: [purchaseUnit]
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