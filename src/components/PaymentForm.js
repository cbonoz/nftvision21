import { Button, Input } from "antd";
import React, { useState } from "react";
import Cards from "react-credit-cards";

const FIELDS = ["Address", "Zip", "City", "State", "County", "Email"];

const PaymentForm = ({ data, setData, address }) => {
  const [step, setStep] = useState(0);

  const handleInputFocus = (e) => {
    setData({ ...data, focus: e.target.name });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const getBody = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <Cards
              cvc={data.cvc}
              expiry={data.expiry}
              focused={data.focus}
              name={data.name}
              number={data.number}
            />
            <br />
            <form>
              <Input
                type="tel"
                value={data.number}
                name="number"
                placeholder="Card Number"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
              <Input
                type="text"
                name="name"
                value={data.name}
                placeholder="Name"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />

              <br />

              <div className="columns">
                <div className="column is-half">
                  <Input
                    type="text"
                    name="cvc"
                    placeholder="CVC"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                  />
                </div>
                <div className="column is-half">
                  <Input
                    type="text"
                    name="expiry"
                    value={data.expiry}
                    placeholder="Expiration"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                  />
                </div>
              </div>
            </form>
          </div>
        );
      case 1:
        return (
          <div>
            <p>Demo</p>
          </div>
        );
    }
  };

  return (
    <div id="PaymentForm" className="payment-form">
      <h1>
        <b>Payment information:</b>
        <p>
          You can pay for your pass above with USDC using your credit card
          instead of a cryptocurrency wallet. Enter information below:
        </p>
      </h1>
      <br />
      {getBody()}
      <br />
      <br />
      {address && <p>Address: {address}</p>}
      {false && (
        <div>
          {step === 0 && <Button onClick={() => setStep(1)}>Next</Button>}
          {step === 1 && (
            <div>
              <Button onClick={() => setStep(0)}>Back</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default PaymentForm;
