import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getProductDetails,
  updateProduct,
  uploadProduct,
} from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import { useForm, useFieldArray } from "react-hook-form";

const ProductEditScreen = ({ match, history }) => {
  //#region variable
  const productId = match.params.id;
  const dispatch = useDispatch();

  const { control, register, handleSubmit, reset, setValue } = useForm();

  const {
    fields: fieldsProductItems,
    append: appendProductItems,
    remove: removeProductItems,
  } = useFieldArray({
    control,
    name: "fieldsProductItems",
  });

  const {
    fields: fieldsImages,
    append: appendImages,
    remove: removeImages,
  } = useFieldArray({
    control,
    name: "fieldsImages",
  });

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const productUpload = useSelector((state) => state.productUpload);
  const {
    loading: loadingUpload,
    success: successUpload,
    upload,
  } = productUpload;
  //#endregion

  //#region function
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productlist");
    }
  }, [dispatch, history, successUpdate]);

  useEffect(() => {
    if (successUpload) {
      setValue(upload.fieldName, upload.url);
    }
  }, [setValue, successUpload, upload.fieldName, upload.url]);

  useEffect(() => {
    if (!product) {
      dispatch(getProductDetails(productId));
    } else {
      reset({
        name: product.name,
        price: product.price,
        brand: product.brand,
        category: product.category,
        description: product.description,
        fieldsProductItems: product.productItems ?? [],
        fieldsImages: product.images ?? [],
      });
    }
  }, [dispatch, reset, productId, product]);

  const uploadFileHandler = async (e, index, fieldName) => {
    dispatch(uploadProduct(e, product._id, fieldName));
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name: data.name,
        price: data.price,
        brand: "",
        category: data.category,
        description: data.description,
        images: data.fieldsImages,
        productItems: data.fieldsProductItems,
      })
    );
  };
  //#endregion

  //#region content
  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>

      <h1>Edit Product</h1>

      {errorUpdate && <Message>{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                {...register("name")}
                placeholder="Name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                className="form-control"
                {...register("category")}
                placeholder="Category"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                rows="10"
                className="form-control"
                {...register("description")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                className="form-control"
                {...register("price")}
                placeholder="Price"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Specification</label>
            </div>
            {fieldsProductItems.map((field, index) => {
              return (
                <div className="input-group mb-3" key={field.id}>
                  <input
                    {...register(`fieldsProductItems.${index}.color`)}
                    defaultValue={field.color}
                    placeholder="color"
                    className="form-control"
                  />

                  <input
                    {...register(`fieldsProductItems.${index}.size`)}
                    defaultValue={field.size}
                    placeholder="size"
                    className="form-control"
                  />

                  <input
                    {...register(`fieldsProductItems.${index}.countInStock`)}
                    defaultValue={field.countInStock}
                    placeholder="countInStock"
                    className="form-control"
                  />

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => removeProductItems(index)}
                  >
                    <i className="far fa-trash-alt"></i>
                  </button>
                </div>
              );
            })}

            <div className="mb-3">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  appendProductItems({ color: "", size: "", countInStock: "" })
                }
              >
                Add Specification
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">Images</label>
            </div>
            {fieldsImages.map((field, index) => {
              return (
                <div className="input-group mb-3" key={field.id}>
                  <input
                    {...register(`fieldsImages.${index}.url`)}
                    defaultValue={field.url}
                    placeholder="url"
                    className="form-control"
                  />

                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      uploadFileHandler(e, index, `fieldsImages.${index}.url`)
                    }
                  />

                  {loadingUpload && <div className="col">Uploading...</div>}
                  <button
                    className="btn-danger"
                    type="button"
                    onClick={() => removeImages(index)}
                  >
                    <i className="far fa-trash-alt"></i>
                  </button>
                </div>
              );
            })}

            <div className="mb-3">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => appendImages({ url: "" })}
              >
                Add Image
              </button>
            </div>

            <button
              type="submit"
              className={
                loadingUpdate ? "btn btn-primary disabled" : "btn btn-primary"
              }
            >
              Submit
            </button>
          </form>
        </>
      )}
    </>
  );
  //#endregion
};

export default ProductEditScreen;
