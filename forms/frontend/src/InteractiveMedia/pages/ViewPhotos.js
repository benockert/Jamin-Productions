import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { getData } from "../../api";
import { useLoaderData, useParams, redirect } from "react-router-dom";

export async function viewPhotosPageLoader({ params, request }) {
  const eventId = params.eventId;
  return await getData(`media/${eventId}/photo_mosaic?pageSize=${10}`).then(
    (res) => {
      if (res.statusCode === 404) {
        return redirect("/");
      } else {
        return res.data ?? {};
      }
    }
  );
}

const ImageGalleryList = styled("ul")(({ theme }) => ({
  display: "grid",
  padding: 0,
  margin: theme.spacing(4),
  gap: 20,
  maxWidth: "80%",
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(1, 1fr)",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(4, 1fr)",
  },
}));

const ViewPhotos = () => {
  const { eventId } = useParams();
  const { items, lek } = useLoaderData();
  const [nextKey, setNextkey] = useState(lek);
  const [images, setImages] = useState(items);
  console.log("Starting:", { images, nextKey });

  const getNextPage = async () => {
    await getData(
      `media/${eventId}/photo_mosaic?lek=${nextKey}&pageSize=${5}`
    ).then((res) => {
      const { items, lek } = res.data;
      setNextkey(lek);
      setImages([items, ...images]); // keep existing and perserve order
      console.log("New:", images);
    });
  };

  // event listending handler for reaching the bottom of the page
  // request the next page of data
  const handleScroll = (event) => {
    if (
      Math.abs(
        event.target.scrollingElement.scrollHeight -
          (event.target.scrollingElement.scrollTop +
            event.target.scrollingElement.clientHeight)
      ) <= 1
    ) {
      getNextPage();
    }
  };

  useEffect(() => {
    // only add an event listener if there is more data to retrieve
    if (nextKey) {
      console.log("Mounting");
      window.addEventListener("scroll", (event) => handleScroll(event));
      return () => {
        console.log("Unmounting");
        window.removeEventListener(
          "scroll",
          console.log("Removing scroll listener")
        );
      };
    }
  }, [nextKey]); // only cleanup/add another listening if the key has changed, otherwise we will get the same data

  return (
    <Box sx={{ backgroundColor: "#171717", minHeight: "100vh" }}>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <ImageGalleryList>
          {images.map((image, index) => (
            <ImageListItem key={index} sx={{ border: "solid white 1px" }}>
              <img
                srcSet={`${image.thumbnail_image} 100w, ${image.full_image} 400w`}
                sizes="(max-width: 600px) 100px, 400px"
                src={image.full_image}
                loading="lazy"
                alt=""
              />
              <ImageListItemBar
                title={`Message: ${image.message}`}
                subtitle={<span>Name: {image.submitted_by}</span>}
                position="bottom"
              />
            </ImageListItem>
          ))}
        </ImageGalleryList>
      </Stack>
    </Box>
  );
};

export default ViewPhotos;
