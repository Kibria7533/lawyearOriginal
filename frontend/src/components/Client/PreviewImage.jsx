import React, { useState } from "react";
import { getImage } from "../../util";

const PreviewImage = ({ link }) => {
  const [imageCheck, setImageCheck] = useState(true);
    return imageCheck ? (
      <img
        src={getImage(link)}
        // alt={`${item?.request_document_answer?.link}`}
        onError={() => setImageCheck(false)}
        width="50"
        height="35"
      />
    ) : (
      <p></p>
    );
};

export default PreviewImage;
