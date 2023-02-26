import { Select, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SET_SUBCATEGORY } from "../../store/constants";
import SubcategoryDocTable from "./SubcategoryDocTable";
import SubcategoryQuesTable from "./SubcategoryQuesTable";
import { MinusOutlined } from "@ant-design/icons";
import { DrossierButton } from "..";
import ProcessBar from "./ProcessBar";
import ModalAttachment from "./ModalAttachment";

const SubcategoryList = ({ subcategories, step, setStep }) => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    subcategories || []
  );
  const [attachmentModalVisible, setAttachmentModalVisible] = useState(false);
  const onChangeSubcategory = (_, { subcategory }) => {
    if (!subcategory) {
      setSelectedSubcategories([...subcategories]);
    } else {
      setSelectedSubcategories([subcategory]);
    }
  };
  useEffect(() => {
    dispatch({ type: SET_SUBCATEGORY, payload: selectedSubcategories });
  }, [selectedSubcategories]);

  const { Option } = Select;

  return (
    <div className="subcategory_list">
      {/* Modal */}
      <ModalAttachment
        visible={attachmentModalVisible}
        setVisible={setAttachmentModalVisible}
        step={step}
        setStep={setStep}
      />
      <ProcessBar step={1} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #CDCDCD",
        }}
      >
        <Select
          className="subcategory_selector"
          onChange={onChangeSubcategory}
          defaultValue=""
          dropdownClassName="subcategory_select_dorpdown"
          suffixIcon={<img width={"10px"} src="/img/arrow-blue.png" />}
        >
          <Option value="" className="subcategory_select_option">
            All Sub-Categories
          </Option>
          {subcategories?.map((item) => (
            <Option
              key={item.id}
              subcategory={item}
              className="subcategory_select_option"
            >
              {item.name}
            </Option>
          ))}
        </Select>
        <DrossierButton
          text="Continue"
          onClick={() => {
            setAttachmentModalVisible(true);
          }}
          style={{ marginBottom: 20 }}
        />
      </div>

      <Collapse
        // defaultActiveKey={['1']}
        // onChange={callback}
        bordered={false}
        className="subcatgory_collapse"
        expandIconPosition="right"
        expandIcon={({ isActive }) =>
          isActive ? (
            <img className="header_logo" src="/img/arrow_up.svg" />
          ) : (
            <img className="header_logo" src="/img/arrow_down.svg" />
          )
        }
      >
        {selectedSubcategories.map((item) => (
          <Panel
            header={
              <h2
                style={{
                  fontSize: 18,
                  lineHeight: "45px",
                  margin: "8px 0",
                  fontWeight: "700",
                  color: "#1F295A",
                }}
              >
                {item.name}
              </h2>
            }
            style={{ borderBottom: "1px solid #CDCDCD" }}
            key={item.id}
          >
            <div className="single_subcategory">
              <div className="grid-new-file">
                <div>
                  <SubcategoryQuesTable
                    {...item}
                    selectedSubcategories={selectedSubcategories}
                    setSelectedSubcategories={setSelectedSubcategories}
                    step={step}
                  />
                </div>
                <div>
                  <SubcategoryDocTable
                    {...item}
                    selectedSubcategories={selectedSubcategories}
                    setSelectedSubcategories={setSelectedSubcategories}
                  />
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default SubcategoryList;
