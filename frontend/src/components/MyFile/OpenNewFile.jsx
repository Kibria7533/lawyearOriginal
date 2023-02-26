import React from "react";
import { PageHeader } from "..";
import NewFileDetails from "./NewFileDetails";

const OpenNewFile = () => {
  return (
    <div className="my-file">
      {/* <PageHeader title="My File" /> */}
      <NewFileDetails />
    </div>
  );
};

export default OpenNewFile;
