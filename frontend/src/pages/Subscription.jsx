import React, { useEffect } from "react";
import { useState } from "react";
import { DrossierButton } from "../components";
import SettingsLayout from "../components/Settings/SettingsLayout";
import {
  getCurrentSubscription,
  createPaymentSession,
} from "../store/actions/subscription";
import { useDispatch } from "react-redux";
import { getAuthData } from "../util/session";
import { fetchCategories } from "../store/actions";
import subscription from "../store/reducers/subscription";
import { stringify } from "postcss";
import QuestionInput from "../components/Category/QuestionInput";
import {Spin} from "antd";
import moment from 'moment'

const Subscription = () => {
  const [changeSubscription, setChangeSubscription] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(async () => {
    setLoading(true);
    let subscription = await getSubscription(
      getAuthData().stripe_subscription_id
    );
    setCurrentSubscription(subscription);
    setLoading(false);
  }, []);

  const includedArr = [
    "Unlimited tasks",
    "Unlimited projects",
    "Unlimited messages",
    "Unlimited activity log",
    "Unlimited file storage (100MB per file)",
  ];

  const getSubscription = async (subscriptionId) => {
    return await dispatch(getCurrentSubscription(subscriptionId));
  };

  return (
    <Spin spinning={loading}>
      <SettingsLayout navbar="Back to Settings">
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
            Subscription
          </div>
          <div className="d-flex align-items-center" style={{ gap: 4 }}>
            <img src="/img/arrow_left.svg" style={{ width: 13, height: 6 }} />
            <p style={{ color: "#455ECE", fontSize: 16 }}>Back to Settings</p>
          </div>
        </div>
        <h1 className="sub_title">
          {changeSubscription ? "You Current Subscription" : "Information"}
        </h1>
        {/* Container 1 */}
        <div className="container_sub">
          {/* Shape */}
          <img src="/img/shape_circle.svg" className="shape_circle" />

                    <div>
                        <p className="free_trial_title">{currentSubscription.plan_name} {currentSubscription.trial_end ? " - Free Trail" : ""}</p>
                        <p className="amount_title">
            <span className="amount_title_first">
              US$ {currentSubscription?.price}{" "}
            </span>
                            <span className="amount_title_second"> / {currentSubscription.interval}</span>
                        </p>
                        <p className="more_info_title">
                            <span className="more_info_title_first">Maximum Team Size:</span>
                            <span className="more_info_title_second"> {currentSubscription.team_size}</span>
                        </p>
                    </div>
                    <div className="second_container_sub">
                        <div>
                            <h1 className="included_sub_title">Included:</h1>
                            {includedArr.map((item, index) => (
                                <div key={index} className="listItem_sub">
                                    <img src="/img/check.svg" style={{width: 10}}/>
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="third_container_sub">
                        <span style={{color: "#1F295A"}}>Expires: </span>
                        <span style={{fontWeight: "700", color: "#1F295A"}}>
                            {moment(currentSubscription.expires_in).format("Do MMMM YYYY")}
          </span>
                    </div>
                </div>
                {!changeSubscription ? (
                    <div className="button_sub_container">
                        <div className="button_sub_container_button">
                            <DrossierButton
                                text="Change Subscription"
                                style={{height: 52, minWidth: 220, fontSize: 16}}
                                onClick={() => setChangeSubscription(true)}
                            />
                        </div>
                        <div className="button_sub_container_text">
                            <p>Subscription may be cancelled anytime.</p>
                            <p>There are no refunds.</p>
                            <p>Subscription auto-renews each month.</p>
                        </div>
                    </div>
                ) : (
                    <ChangeSubscription/>
                )}
            </SettingsLayout>
        </Spin>
    );
};

export default Subscription;

const ChangeSubscription = () => {
  const [openPlan, setOpenPlan] = useState(false);
  const [openBilling, setOpenBilling] = useState(false);

  const [plan, setPlan] = useState("Business");
  const [billing, setBilling] = useState("Yearly");
  const [teamSize, setTeamSize] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    setTeamSize(1);
  }, [plan]);

  const createCheckoutSession = async () => {
    let subscriptionPlan = `${plan.toLocaleLowerCase()}_${billing.toLocaleLowerCase()}`;
    await dispatch(createPaymentSession(subscriptionPlan, teamSize));
  };

    const getExpiryDate = () => {
        if (billing === "Yearly") {
            return moment().add(365, 'days').format("Do MMMM YYYY");
        } else if (billing === "Monthly") {
            return moment().add(30, 'days').format("Do MMMM YYYY");
        }
    }

    return (
        <div className="change_sub_container">
            <h1 className="title_new_sub">Choose New Subscription</h1>
            <div className="choose_sub">
                <div className="dropdowns_subs">
                    <DropDown
                        open={openPlan}
                        setOpen={setOpenPlan}
                        value={plan}
                        setValue={setPlan}
                        title="Choose Plan"
                        Options={["Business", "Individual"]}
                    />
                    {plan === "Business" && (
                        <Counter
                            value={teamSize}
                            setValue={setTeamSize}
                            title="Choose Team Size"
                        />
                    )}
                    <DropDown
                        open={openBilling}
                        setOpen={setOpenBilling}
                        value={billing}
                        setValue={setBilling}
                        title="Choose Billing"
                        Options={["Yearly", "Monthly"]}
                    />
                </div>
                <h1
                    style={{cursor: "pointer"}}
                    className="discard_changes"
                    onClick={() => {
                        setPlan("Business");
                        setBilling("Yearly");
                        setTeamSize(1);
                    }}
                >
                    Discard Changes
                </h1>
            </div>
            {/* Container 2 */}
            <div className="summary_sub_container">
                {/* Shape */}
                <img src="/img/shape_circle_2.svg" className="shape_circle"/>
                <div className="summary_sub_sub_container">
                    <p className="free_trial_title_second">Summary of New Subscription</p>
                    <div className="title_summary_container">
                        <p className="title_summary_new_sub_first">Your Plan:</p>
                        <p className="title_summary_new_sub_second">{plan}</p>
                    </div>
                    <div className="title_summary_container">
                        <p className="title_summary_new_sub_first">Features:</p>
                        <p className="title_summary_new_sub_second">
                            All business features available
                        </p>
                    </div>
                    <div className="title_summary_container">
                        <p className="title_summary_new_sub_first">Team size:</p>
                        <p className="title_summary_new_sub_second">{teamSize} seats</p>
                    </div>
                    <div className="title_summary_container">
                        <p className="title_summary_new_sub_first">Billing:</p>
                        <p className="title_summary_new_sub_second">{billing}</p>
                    </div>
                </div>
                <div className="second_container_sub_second">
                    <div className="title_summary_container">
                        <p className="title_summary_new_sub_first">Expires:</p>
                        <div className="title_summary_new_second">
                            <p className="title_summary_new_sub_second">
                                {getExpiryDate()}
                            </p>
                            <p
                                className="title_summary_new_sub_second"
                                style={{color: "#9D9D9D"}}
                            >
                                (365 days left)
                            </p>
                        </div>
                    </div>
                    <div className="title_summary_container">
                        <p className="title_summary_new_sub_first">Payment:</p>
                        <p className="title_summary_new_sub_second">
                            US${billing === "Yearly" ? 40 * teamSize * 12 : 40 * teamSize} / {billing === "Yearly" ? "year" : "month"}
                        </p>
                    </div>
                    <div className="title_summary_container_margin_top">
                        <p className="title_summary_new_sub_first">Total Price:</p>
                        <p
                            className="title_summary_new_sub_second"
                            style={{fontSize: 24, fontWeight: "700"}}
                        >
                            US${billing === "Yearly" ? 40 * teamSize * 12 : 40 * teamSize}
                        </p>
                    </div>
                </div>
                <div className="third_container_sub">
                    <div className="button_sub_container_second">
                        <div className="button_sub_container_text_second">
                            <p>Subscription may be cancelled anytime.</p>
                            <p>There are no refunds.</p>
                            <p>Subscription auto-renews each month.</p>
                        </div>
                        <div className="button_sub_container_button">
                            <DrossierButton
                                onClick={createCheckoutSession}
                                text="Buy Now"
                                style={{height: 52, minWidth: 220, fontSize: 16}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DropDown = ({ value, setValue, open, setOpen, title, Options }) => {
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
          }}
          className="dropdown_element"
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
            className="dropdown_element"
          >
            {Options.map((item, index) => (
              <div
                key={index}
                style={{
                  cursor: "pointer",
                  height: 56,
                  padding: "4px 20px",
                  flexWrap: "wrap",
                }}
                className="dropdown_item_months d-flex align-items-center justify-content-between"
                onClick={() => {
                  setValue(item);
                  setOpen(!open);
                }}
              >
                <div className="d-flex align-items-center" style={{ gap: 8 }}>
                  {/*      <img
                    src="/img/checkbox.svg"
                    style={{ height: 16, width: 16 }}
                  /> */}
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

const Counter = ({ value, setValue, title }) => {
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
            padding: "16px 12px 16px 12px",
          }}
          className="counter_element"
        >
          <div
            className="d-flex align-items-center icon_hover"
            style={{
              height: 30,
              width: 30,
              borderRadius: "50%",
              padding: 5,
            }}
            onClick={() => {
              if (value === 1) return;
              setValue(value - 1);
            }}
          >
            <img src="/img/minus.svg" style={{ width: 20 }} />
          </div>
          <p>{value}</p>
          <div
            className="d-flex align-items-center icon_hover"
            style={{
              height: 30,
              width: 30,
              borderRadius: "50%",
              padding: 5,
            }}
            onClick={() => setValue(value + 1)}
          >
            <img src="/img/plus.svg" style={{ width: 20 }} />
          </div>
        </div>
      </div>
    </div>
  );
};
