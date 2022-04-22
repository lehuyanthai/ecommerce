import "./edit-product.scss";
import React, { ChangeEvent, useEffect, useState } from "react";
import { IDetailProduct } from "../detail-product/DetailProduct";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { BiImageAdd } from "react-icons/bi";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { IoMdCloseCircle } from "react-icons/io";

const EditProduct = () => {
  const [data, setData] = useState<IDetailProduct>();
  const [name, setName] = useState<string | undefined>("");
  const [category, setCategory] = useState<string | undefined>("");
  const [price, setPrice] = useState<number | undefined>(0);
  const [gender, setGender] = useState<string | undefined>("men");
  const [size, setSize] = useState<string | undefined>("");
  const [color, setColor] = useState<string | undefined>("");
  const [images, setImages] = useState<string[] | undefined>([]);
  const [newImages, setNewImages] = useState<any>([]);
  const [urls, setUrls] = useState<string[]>([]);
  let { id } = useParams();
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent) => {
    setNewImages([]);
    const target = e.target as HTMLInputElement;
    const file = target.files;
    if (file) {
      for (let i = 0; i < file.length; i++) {
        const newImage: any = file[i];
        newImage["id"] = Math.random();
        setNewImages((prevState: any) => [...prevState, newImage]);
      }
    }
  };

  const handleImageUpload = () => {
    const promises: any = [];
    newImages.forEach((image: any) => {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      promises.push(uploadTask);
      uploadTask.on("state_changed", () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setUrls((prevState) => [...prevState, downloadURL]);
        });
      });
    });

    Promise.all(promises).catch((err) => console.log(err));
  };

  const deleteOldImage = (id: number) => {
    const newImageList = images?.filter((image, index) => index !== id);

    setImages(newImageList);
  };

  const deleteNewImage = (id: number) => {
    const imageList = newImages?.filter((image: any) => image.id !== id);
    setNewImages(imageList);
  };

  useEffect(() => {
    const getProductData = async (): Promise<IDetailProduct> => {
      let data: any = {};
      const menRef = doc(db, "collection_men", `${id}`);
      const womenRef = doc(db, "collection_women", `${id}`);

      if ((await getDoc(menRef)).exists()) {
        data = { ...(await getDoc(menRef)).data() };
        setData(data);
        setGender("men");
        return data;
      } else if ((await getDoc(womenRef)).exists()) {
        data = { ...(await getDoc(womenRef)).data() };
        setData(data);
        setGender("women");
        return data;
      } else {
        console.log("No such document!");
      }
      return data;
    };
    getProductData();
  }, [id]);

  useEffect(() => {
    setName(data?.name);
    setCategory(data?.category);
    setPrice(data?.price);
    setSize(data?.size.toString());
    setColor(data?.color.toString());
    setImages(data?.image);
  }, [data]);

  const handleUpdate = () => {
    // handleImageUpload();
    console.log({ images: images as string[], urls: urls });
      updateDoc(doc(db, `collection_${gender}`, `${id}`), {
        name: name,
        category: category,
        gender: gender,
        price: price,
        image: urls.concat(images as string[]),
        size: (size as string).split(","),
        color: (color as string).split(","),
      });
    setTimeout(()=>{navigate("/products")},1000)
  };

  return (
    <div className="editproduct">
      <div className="left__side">
        <div className="title">Edit Product</div>
        <input
          type={"text"}
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
          }}
        />
        <input
          type={"text"}
          value={category}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setCategory(e.target.value);
          }}
        />
        <select
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setGender(e.target.value);
          }}
        >
          <option value="men">Men</option>
          <option selected={gender === "women" ? true : false} value="women">
            Women
          </option>
        </select>
        <input
          type="number"
          value={price}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPrice(parseInt(e.target.value));
          }}
        />
        <input
          type={"text"}
          value={size}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSize(e.target.value);
          }}
        />
        <input
          type={"text"}
          value={color}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setColor(e.target.value);
          }}
        />
        <button className="upload__btn" onClick={handleUpdate}>
          Update
        </button>
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
          <BiImageAdd />
        </div>
        {newImages.map((image: any) => (
          <div>
            {image.name}{" "}
            <button
              style={{
                outline: "none",
                border: "none",
                background: "transparent",
              }}
              onClick={() => deleteNewImage(image.id)}
            >
              <IoMdCloseCircle size={25} style={{ cursor: "pointer" }} />
            </button>
          </div>
        ))}
        <br />
        <div className="list__img">
          {images?.map((url, index) => (
            <div className="img">
              <button
                className="delete__btn"
                onClick={() => deleteOldImage(index)}
              >
                <IoMdCloseCircle size={25} style={{ cursor: "pointer" }} />
              </button>
              <img
                style={{ width: "100%", objectFit: "cover" }}
                src={url}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
