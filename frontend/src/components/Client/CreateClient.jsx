import React, { useEffect, useState } from "react";
import { DrossierButton } from "..";
import CategoryTable from "./CategoryTable";
import FinalOverview from "./FinalOverview";
import SubcategoryList from "./SubcategoryList";
import { PageHeader } from "..";
import { useSelector } from "react-redux";
import SetReminderModal from "./SetReminderModal";
import { addClient, AddDraft } from "../../store/actions";
import OverviewCategoryTable from "./OverviewCategoryTable";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ProcessBar from "./ProcessBar";
import ModalAttachment from "./ModalAttachment";
import AttachmentScreen from "./AttachmentScreen";

const CreateClient = ({ location }) => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [attachmentModalVisible, setAttachmentModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const draftData = useSelector((state) =>
    Array.isArray(state?.client?.draftData) ? state?.client?.draftData : []
  );
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const data = draftData.find(
      (item) => String(item.id) === String(params.id)
    );
    // console.log({ data });
    try {
      const parsedValue = JSON.parse(data.value);
      if (parsedValue && Object.keys(parsedValue)) {
        parsedValue.questions = parsedValue?.questions?.map((item) => {
          if (
            item.ques === "First name" ||
            item.ques === "Last name" ||
            item.ques === "Email"
          ) {
            item.selected = true;
          }
          return item;
        });
        setSelectedCategory(parsedValue || {});
        setStep(2);
      }
      console.log(parsedValue);
    } catch (error) {}
  }, []);

  const subcategoryList = useSelector(
    (state) => state?.client?.subcategoryList || []
  );

  const onCreateClient = async () => {
    setCreateLoading(true);
    const categoryAsnwer = [],
      allQuestions = [],
      allDocuments = [];
    const categoryQuestions = selectedCategory?.questions || [];
    let count = 1,
      count1 = 1;

    console.log("aaaa", categoryQuestions);

    categoryQuestions.map(({ ques, selected, type, options }) => {
      if (selected === true) {
        allQuestions.push({
          ques,
          questionType: type,
          options: options.map((item) => item.value),
          type: "category",
          position: count,
        });
        count = count + 1;
        if (selectedCategory[ques])
          categoryAsnwer.push({ name: ques, ans: selectedCategory[ques] });
      }
    });

    console.log(subcategoryList);

    subcategoryList.map(({ id, questions = [], documents = [] }) => {
      questions.map(({ ques, selected, type, options }) => {
        if (selected === true) {
          allQuestions.push({
            ques,
            options: options.map((item) => item.value),
            questionType: type,
            subcategoryId: id,
            position: count,
          });
          count = count + 1;
        }
      });
      documents.map(({ name, selected }) => {
        if (selected === true) {
          allDocuments.push({ name, subcategoryId: id, position: count1 });
          count1 = count1 + 1;
        }
      });
    });

    const client = await addClient({
      categoryId: selectedCategory.id,
      email: selectedCategory["Email"],
      first_name: selectedCategory["First name"],
      last_name: selectedCategory["Last name"],
      categoryAsnwer,
      questions: allQuestions,
      documents: allDocuments,
    });

    setCreateLoading(false);

    if (client?.request?.id) setVisible(client?.request?.id);
  };

  const onSaveAsDraft = async () => {
    // console.log(selectedCategory);
    await AddDraft({ value: selectedCategory });
  };

  return (
    <>
      {/* Modals */}
      <SetReminderModal visible={visible} setVisible={setVisible} />
      <ModalAttachment
        visible={attachmentModalVisible}
        setVisible={setAttachmentModalVisible}
        step={step}
        setStep={setStep}
      />
      {/* Header */}
      <PageHeader title={step === 3 ? "Overview" : "Add a Client"} />

      <div>
        {step !== 0 && (
          <p
            style={{
              ...btnStyle,
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
              marginBottom: 20,
            }}
            onClick={() => {
              if (step === 3) {
                setStep(step - 2);
              } else {
                setStep(step - 1);
              }
            }}
          >
            <ArrowLeftOutlined style={{ marginRight: "10px" }} /> Back
          </p>
        )}
      </div>
      <div className="create_client">
        {step === 0 && (
          <CategoryTable
            step={step}
            setStep={setStep}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            disabled={
              !selectedCategory["First name"] ||
              !selectedCategory["Last name"] ||
              !selectedCategory["Email"]
            }
          />
        )}
        {step === 1 && (
          <SubcategoryList
            {...selectedCategory}
            setSelectedCategory={setSelectedCategory}
            step={step}
            setStep={setStep}
          />
        )}
        {step === 2 && (
          <AttachmentScreen
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            step={step}
            setStep={setStep}
          />
        )}
        {step === 3 && (
          <>
            <OverviewCategoryTable
              setStep={setStep}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              createLoading={createLoading}
              onCreateClient={onCreateClient}
            />
            <FinalOverview
              {...selectedCategory}
              subcategories={subcategoryList}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </>
        )}
        {Object.keys(selectedCategory).length > 1 && (
          <div>
            <div>
              {step === 3 ? (
                <div style={{ display: "flex", gap: 40 }} className="mt-4">
                  <DrossierButton
                    loading={createLoading}
                    text="Send"
                    onClick={onCreateClient}
                  />
                  <p style={btnStyle} onClick={onSaveAsDraft}>
                    Save as Draft
                  </p>
                </div>
              ) : (
                <DrossierButton
                  text="Continue"
                  disabled={
                    !selectedCategory["First name"] ||
                    !selectedCategory["Last name"] ||
                    !selectedCategory["Email"]
                  }
                  className="mt-4"
                  onClick={() => {
                    if (step === 1) {
                      setAttachmentModalVisible(true);
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  style={{
                    opacity:
                      (!selectedCategory["First name"] ||
                        !selectedCategory["Last name"] ||
                        !selectedCategory["Email"]) &&
                      "50%",
                  }}
                />
              )}
            </div>
            <div>
              {step !== 0 && (
                <p
                  style={{
                    ...btnStyle,
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeftOutlined style={{ marginRight: "10px" }} /> Back
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateClient;

const btnStyle = {
  color: "#455ECE",
  fontWeight: 700,
  fontSize: "1rem",
  marginTop: "16px",
  cursor: "pointer",
};
