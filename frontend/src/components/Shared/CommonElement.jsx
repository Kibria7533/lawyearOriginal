import { DatePicker, Input } from "antd";
import React from "react";
import {
  EyeFilled,
  EyeInvisibleFilled,
  LoadingOutlined,
} from "@ant-design/icons";

export const DrossierInput = ({
  placeHolder = "input",
  onEnter,
  value = "",
  onChange,
  style = {},
  className,
  name = "email",
  type = "text",
  onFocus,
  onBlur,
  onClick,
  obj = {},
  suffix,
  prefix,
  labelShow,
  readOnly = false,
  disabled = false,
}) => {
  const onClickInput = (e) => {
    if (typeof onClick === "function") {
      onClick(obj);
    }
    e.stopPropagation();
  };
  const onEnterInput = (e) => {
    if (e.key === "Enter" && typeof onEnter === "function") {
      onEnter();
    }
  };
  return (
    <section id="common-element" style={{ width: "100%" }}>
      {!labelShow && (
        <label style={value ? { opacity: "1" } : { opacity: "0" }}>
          {placeHolder}
        </label>
      )}
      {type === "password" ? (
        <Input.Password
          iconRender={(visible) =>
            visible ? <EyeInvisibleFilled /> : <EyeFilled />
          }
          style={style}
          type="password"
          onChange={onChange}
          className="custom-input"
          placeholder={placeHolder}
          value={value}
          name={name}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      ) : (
        <Input
          onKeyPress={onEnterInput}
          onClick={onClickInput}
          style={style}
          className={`custom-input ${className}`}
          placeholder={placeHolder}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          value={value}
          name={name}
          type={type}
          suffix={suffix || ""}
          prefix={prefix || ""}
          readOnly={readOnly}
          disabled={disabled}
          autoComplete="new-password"
        />
      )}
    </section>
  );
};

export const DrosserDatePicker = ({
  placeHolder = "input",
  onEnter,
  value = "",
  format,
  onChange,
  style = {},
  className,
  name = "email",
  type = "text",
  onFocus,
  onBlur,
  onClick,
  obj = {},
  suffix,
  prefix,
  labelShow,
  readOnly = false,
}) => {
  const onClickInput = () => {
    if (typeof onClick === "function") {
      onClick(obj);
    }
  };
  const onEnterInput = (e) => {
    if (e.key === "Enter" && typeof onEnter === "function") {
      onEnter();
    }
  };
  return (
    <section id="common-element">
      {!labelShow && (
        <label style={value ? { opacity: "1" } : { opacity: "0" }}>
          {placeHolder}
        </label>
      )}
      {type === "picker" ? (
        <DatePicker
          style={style}
          format={format}
          onChange={onChange}
          className="custom-input"
          placeholder={placeHolder}
          value={value}
          name={name}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      ) : (
        <Input
          onKeyPress={onEnterInput}
          onClick={onClickInput}
          style={style}
          className={`custom-input ${className}`}
          placeholder={placeHolder}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          value={value}
          name={name}
          type={type}
          suffix={suffix || ""}
          prefix={prefix || ""}
          readOnly={readOnly}
        />
      )}
    </section>
  );
};

export const DrossierButton = ({
  text,
  style = {},
  onClick,
  loading,
  disabled,
  className = "",
}) => {
  return (
    <section id="common-element">
      <button
        disabled={disabled}
        style={style}
        onClick={onClick}
        className={`custom-button ${className}`}
      >
        {loading && <LoadingOutlined spin className="mr-3" />} {text}
      </button>
    </section>
  );
};
