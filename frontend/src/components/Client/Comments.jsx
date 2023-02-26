import { CloseCircleOutlined } from "@ant-design/icons";
import { notification, Spin } from "antd";
import { format } from "date-fns";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { addComment, deleteComment, editComment } from "../../store/actions";
import QuestionInput from "./QuestionInputComment";

const Comments = ({ id, comments, allQuestions, setAllQuestions }) => {
  const [docInputField, setDocInputField] = useState(false);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState("");
  const [editv, setEditv] = useState("");
  const [innerModal, setInnerModal] = useState(false);
  const myRef = useRef();
  const myRef1 = useRef();

  const handleClickOutside = (e) => {
    const data = myRef.current?.contains(e.target);
    if (!data && data !== undefined) {
      setVisible(false);
    }
    const data1 = myRef1.current?.contains(e.target);
    if (!data1 && data1 !== undefined) {
      setInnerModal(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onDelete = async (id) => {
    try {
      const res = await deleteComment({ id });
      if (res.success) {
        const data = allQuestions.map((item) => {
          item.comments = item.comments.filter((data) => data.id !== id);
          return item;
        });
        setInnerModal(false);
        setAllQuestions([...data]);
      }
    } catch (error) {
      notification.warn({
        message: error.message || "Something went wrong",
        placement: "bottomRight",
      });
    }
  };
  const onChangeValue = async (payload) => {
    setEditv(payload.desc);
    try {
      const res = await editComment(payload);
      if (res.success) {
        const data = allQuestions.map((item) => {
          if (item.id === id) {
            item.comments = item.comments.map((innerItem) => {
              if (innerItem.id === payload.id) innerItem.desc = payload.desc;
              return innerItem;
            });
          }
          return item;
        });
        setAllQuestions([...data]);
      }
    } catch (error) {
      notification.warn({
        message: error.message || "Something went wrong",
        placement: "bottomRight",
      });
    }
  };
  const onAddComment = async (desc) => {
    try {
      const res = await addComment({ desc, requestQuestionId: id });
      if (res.success) {
        const data = allQuestions.map((item) => {
          if (item.id === id) {
            item.comments = [...item.comments, res.coment];
          }
          return item;
        });

        setAllQuestions([...data]);
        setDocInputField(false);
      }
    } catch (error) {
      notification.warn({
        message: error.message || "Something went wrong",
        placement: "bottomRight",
      });
    }
  };
  return (
    <div style={{ position: "" }}>
      <img src="/img/chat_icon.svg" alt="" onClick={() => setVisible(true)} />
      {visible && (
        <div className="custom_modal" ref={myRef}>
          <div className="d-flex justify-content-between">
            <h2>Comments</h2>
            <div className="suf_box">
              <div>
                <CloseCircleOutlined
                  onClick={() => setVisible(false)}
                  style={{ color: "#6767eb", fontSize: "20px" }}
                />
                {/* <img src="/img/chat_icon.svg" alt="" /> */}
              </div>
            </div>
          </div>
          <ul>
            {comments.map((item, idx) => {
              return (
                <li key={idx}>
                  <div className="d-flex">
                    <div style={{ width: "100%" }}>
                      <p>
                        {moment(new Date(item.createdAt)).format(
                          "DD MMMM, HH:mm"
                        )}
                      </p>
                      {edit === item.id ? (
                        <input
                          className="inner_item_edit"
                          value={editv}
                          onChange={(e) =>
                            onChangeValue({
                              desc: e.target.value,
                              id: item.id,
                            })
                          }
                          onBlur={() => setEdit("")}
                        />
                      ) : (
                        <p>{item.desc}</p>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <img
                        style={{ padding: "0 5px", marginTop: "20px" }}
                        src="/img/dots.png"
                        alt="dots"
                        onClick={() => {
                          setInnerModal(idx);
                        }}
                      />
                      {innerModal === idx && (
                        <ul className="inner_ul" ref={myRef1}>
                          <li
                            onClick={() => {
                              setEdit(item.id);
                              setEditv(item.desc);
                              setInnerModal(false);
                            }}
                          >
                            <img src="/img/edit.svg" alt="" />
                            Edit
                          </li>
                          <li onClick={() => onDelete(item.id)}>
                            <img src="/img/delete-red.png" alt="" />
                            <span style={{ color: "#E94614" }}>Delete</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {!docInputField && (
            <p
              style={{
                textAlign: "right",
                color: "#455ECE",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "20px",
              }}
              onClick={() => setDocInputField(true)}
            >
              Add a New Comment
            </p>
          )}
          {docInputField && (
            <Spin spinning={false}>
              <QuestionInput
                placeHolder="Write a Comment"
                // btnText="Send"
                onClose={() => {
                  setDocInputField(false);
                }}
                addQuestion={(docName) => {
                  onAddComment(docName);
                }}
              />
            </Spin>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
