const endpoint = process.env.REACT_APP_IMAGE_URL || "https://dossierdirectspace.nyc3.digitaloceanspaces.com/";
const noImage = "/img/no-image.jpg";
export const getImage = image => {
  if (!image) return noImage;
  return endpoint + image;
};
