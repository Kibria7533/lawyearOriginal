import React, { useState } from "react";
import { fileUploadDoc } from "../../store/actions";
import SingleDocument from "./SingleDocument";

const Documents = ({
  docState,
  setDocState,
  docFillupCount,
  setDocFillupCount,
}) => {
  const [loadingId, setLoadingId] = useState('')
  const fileUpload = async (info, idx) => {
    setLoadingId(idx);
    const formData = new FormData();
    formData.append("singleFile", info);
    const res = await fileUploadDoc(formData);
    const documentUpdate = [...docState];
    if(!documentUpdate[idx]?.link){
      setDocFillupCount(docFillupCount + 1);
    }
    documentUpdate[idx] = {...documentUpdate[idx], link:res.fileName}
    setDocState(documentUpdate);
    setLoadingId('')
  };

  const deleteDoc = (idx) => {
    const data = [...docState];
    data[idx].link = null;
    setDocState(data);
    if (docFillupCount > 0) {
      setDocFillupCount(docFillupCount - 1);
    }
  };

  return (
    <div>
      <div className="title">Documents</div>
      <div className="mt-3"></div>
      <div className="upload-input">
        {docState?.map((doc, idx) => (
          <SingleDocument
            key={doc.id}
            loadingId={loadingId}
            data={doc}
            idx={idx}
            onChange={fileUpload}
            deleteDoc={deleteDoc}
          />
        ))}
      </div>
    </div>
  );
};

export default Documents;
