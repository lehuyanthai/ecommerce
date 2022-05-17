import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { ChangeEvent, useState } from "react";
import { AiOutlineCheck, AiOutlineFileImage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { db, storage } from "../../firebase";
import "./add-product.scss";

const AddProduct = () => {
  const [images, setImages] = useState<any>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent) => {
    setImages([]);
    setUrls([]);
    const target = e.target as HTMLInputElement;
    const file = target.files;
    if (file) {
      for (let i = 0; i < file.length; i++) {
        const newImage: any = file[i];
        newImage["id"] = Math.random();
        setImages((prevState: any) => [...prevState, newImage]);
      }
    }
  };

  const handleUpload = () => {
    const promises: any = [];
    images.forEach((image: any) => {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            setUrls((prevState) => [...prevState, downloadURL]);
          });
        }
      );
    });

    Promise.all(promises).catch((err) => console.log(err));
  };
  console.log(urls)
  return (
    <div className="addproduct">
      <div className="left__side">
        <div className="title">Add Product</div>
        <Formik
          initialValues={{
            name: "",
            category: "",
            gender: "men",
            price: "",
            size: "",
            color: "",
            images: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string().trim("Invalid").required("Required"),
            category: Yup.string().required("Required"),
            price: Yup.number().required("Required").moreThan(0, "More than 0"),
          })}
          onSubmit={async (values) => {
            // handleUpload();
              const docRef = await addDoc(
                collection(db, `collection_${values.gender}`),
                {
                  name: values.name,
                  category: values.category,
                  gender: values.gender,
                  price: values.price,
                  image: urls,
                  size: values.size.split(","),
                  color: values.color.split(","),
                }
              );
              console.log(docRef.id);
              setTimeout(()=>{navigate("/products")})
          }}
        >
          <Form style={{ width: "100%" }}>
            <Field className="input" name="name" placeholder="Name Product" />
            <ErrorMessage
              render={(msg) => <div className="message">{msg}</div>}
              name="name"
            />
            <Field className="input" name="category" placeholder="Category" />
            <ErrorMessage
              render={(msg) => <div className="message">{msg}</div>}
              name="category"
            />
            <Field className="input select" name="gender" as="select">
              <option value="men">Men</option>
              <option value="women">Women</option>
            </Field>
            <ErrorMessage
              render={(msg) => <div className="message">{msg}</div>}
              name="category"
            />
            <Field className="input" name="price" placeholder="Price" />
            <ErrorMessage
              render={(msg) => <div className="message">{msg}</div>}
              name="price"
            />
            <Field className="input" name="size" placeholder="Size" />
            <ErrorMessage
              render={(msg) => <div className="message">{msg}</div>}
              name="size"
            />
            <Field className="input" name="color" placeholder="Color" />
            <ErrorMessage
              render={(msg) => <div className="message">{msg}</div>}
              name="color"
            />
            <button type="submit" className="add__btn">
              Add
            </button>
          </Form>
        </Formik>
      </div>
      <div className="right__side">
        <div className="file-upload">
          <input
            className="upload__btn"
            type="file"
            accept="image/gif, image/jpeg, image/png"
            multiple
            onChange={(e) => handleChange(e)}
          />
          <AiOutlineFileImage />
        </div>
        <br />
        {images.map((url: any) => (
          <div>{url.name}<AiOutlineCheck onClick={handleUpload} color="white" style={{cursor:"pointer"}}/></div>
        ))}
      </div>
    </div>
  );
};

export default AddProduct;
