import React from "react";
import { Link } from "react-router-dom";
import { Select } from "antd";
const Filter = ({ filterBy, onChangeFilter }) => {
  const onChange = (value) => onChangeFilter({ name: "sortBy", value });

  const { Option } = Select;
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="d-flex align-items-center sort_by_filter">
          <p>Sort by:</p>
          <Select
            style={{ width: 270 }}
            onChange={onChange}
            value={filterBy.sortBy}
            dropdownClassName="sort_by_select_dorpdown"
            suffixIcon={<img width={"10px"} src="/img/arrow-blue.png" />}
          >
            <Option className="sort_by_option" value="lawer_completion">
              Lawyer Completetion Status
            </Option>
            <Option className="sort_by_option" value="missing_questions">
              Missing Questions
            </Option>
            <Option className="sort_by_option" value="missing_documents">
              Missing Document
            </Option>
          </Select>
        </div>
      </div>
      <div className="col-md-6 text-right">
        <Link
          to="/client/create"
          className="create_link"
          style={{ color: "#455ECE" }}
        >
          Add a New Client
        </Link>
      </div>
    </div>
  );
};

export default Filter;
