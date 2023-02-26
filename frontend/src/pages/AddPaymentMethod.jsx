import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { DrossierButton, DrossierInput } from "../components";
import {
  createPaymentMethod,
  getPaymentMethods,
} from "../store/actions/subscription";
import SettingsLayout from "../components/Settings/SettingsLayout";
import { useDispatch } from "react-redux";
import { Spin } from "antd";

const AddPaymentMethod = () => {
  const [state, setState] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolderName: "",
    country: "",
    postalCode: "",
    city: "",
    address: "",
    province: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useHistory();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const submitData = async () => {
    setLoading(true);
    let response = await dispatch(createPaymentMethod(state));
    setLoading(false);
    if (response.success) {
      router.push("/billing");
    }
  };

  return (
    <SettingsLayout navbar="Back to Billing" titleTop="Billing">
      <div className="billing_back">
        <div
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#1F295A",
            lineHeight: 1.4,
            marginBottom: 8,
            fontWeight: "700",
          }}
        >
          Settings
        </div>
        <div className="d-flex align-items-center" style={{ gap: 4 }}>
          <img src="/img/arrow_left.svg" style={{ width: 13, height: 6 }} />
          <p style={{ color: "#455ECE", fontSize: 16 }}>Back to Settings</p>
        </div>
      </div>
      <h1 className="sub_title">Add New Payment Method</h1>
      <div className="input_container">
        <DrossierInput
          className="create_category_input"
          placeHolder="Card Number"
          type="text"
          onChange={handleInput}
          value={state.cardNumber}
          name={"cardNumber"}
          style={{ marginBottom: 12, fontSize: 18, height: 56 }}
        />
        <div className="cvv">
          <DrossierInput
            className="create_category_input"
            placeHolder="MM/YY"
            type="text"
            onChange={handleInput}
            value={state.expiry}
            name={"expiry"}
            style={{ marginBottom: 12, fontSize: 18, height: 56 }}
          />
          <DrossierInput
            className="create_category_input"
            placeHolder="CVV"
            type="text"
            onChange={handleInput}
            value={state.cvv}
            name={"cvv"}
            style={{ marginBottom: 12, fontSize: 18, height: 56 }}
          />
        </div>
        <DrossierInput
          className="create_category_input"
          placeHolder="Cardholder Name"
          type="text"
          onChange={handleInput}
          value={state.cardHolderName}
          name={"cardHolderName"}
          style={{ marginBottom: 12, fontSize: 18, height: 56 }}
        />
        <DrossierInput
          className="create_category_input"
          placeHolder="Country"
          type="text"
          onChange={handleInput}
          value={state.country}
          name={"country"}
          style={{ marginBottom: 12, fontSize: 18, height: 56 }}
        />
        <DrossierInput
          className="create_category_input"
          placeHolder="City"
          type="text"
          onChange={handleInput}
          value={state.city}
          name={"city"}
          style={{ marginBottom: 12, fontSize: 18, height: 56 }}
        />
        <DrossierInput
          className="create_category_input"
          placeHolder="Address"
          type="text"
          onChange={handleInput}
          value={state.address}
          name={"address"}
          style={{ marginBottom: 12, fontSize: 18, height: 56 }}
        />
        <DrossierInput
          className="create_category_input"
          placeHolder="Province"
          type="text"
          onChange={handleInput}
          value={state.province}
          name={"province"}
          style={{ marginBottom: 12, fontSize: 18, height: 56 }}
        />
        <DrossierInput
          className="create_category_input"
          placeHolder="Postal Code"
          type="text"
          onChange={handleInput}
          value={state.postalCode}
          name={"postalCode"}
          style={{ marginBottom: 34, fontSize: 18, height: 56 }}
        />
        <Spin spinning={loading}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "5rem",
            }}
          >
            <DrossierButton
              onClick={submitData}
              text="Add New Payment Method"
              style={{ height: 52, minWidth: 264, fontSize: 16 }}
            />
          </div>
        </Spin>
      </div>
    </SettingsLayout>
  );
};

export default AddPaymentMethod;

const DropDown = ({ value, setValue, open, setOpen, title, placeholder }) => {
  const Subs = ["Business", "Individual"];

  return (
    <div>
      <p style={{ marginLeft: 11, color: "#9D9D9D", fontSize: 14 }}>{title}</p>
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          position: "relative",
        }}
        onClick={() => setOpen(!open)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#black",
            cursor: "pointer",
            height: 56,
            border: "1px solid #AFD2E9",
            borderRadius: 10,
            padding: "16px 11px 16px 11px",
            width: "100%",
            marginBottom: 12,
            fontSize: 18,
            height: 56,
          }}
        >
          <p>{value}</p>
          <img src="/img/arrow_down.svg" style={{ width: 10 }} />
        </div>
        {open && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              background: "white",
              zIndex: "999",
              border: "1px solid #AFD2E9",
              fontSize: 16,
              color: "#1F295A",
              overflow: "hidden",
              fontWeight: "400",
              borderRadius: 10,
              marginBottom: 50,
              minWidth: 172,
            }}
          >
            {Subs.map((item, index) => (
              <div
                key={index}
                style={{
                  cursor: "pointer",
                  height: 40,
                  padding: "4px 20px",
                  flexWrap: "wrap",
                }}
                className="dropdown_item_months d-flex align-items-center justify-content-between"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <div className="d-flex align-items-center" style={{ gap: 8 }}>
                  <img
                    src="/img/checkbox.svg"
                    style={{ height: 16, width: 16 }}
                  />
                  <p>{item}</p>
                </div>
                {index === 0 && (
                  <img
                    src="/img/arrow_up.svg"
                    style={{ height: 8, width: 12 }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
