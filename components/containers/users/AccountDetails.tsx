"use client";
import "react-toastify/dist/ReactToastify.css";

import { toast } from "react-toastify";
import Image from "next/image";
import userProfile from "@/public/images/users/user.png";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/components/context/StoreContext";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import UserProductShow from "./UserProductShow";
import Link from "next/link";

const AccountDetails = () => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [applicationData, setApplicationData] = useState([]);
  const [app_Id, setApp_Id] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [appImage, setImage] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []); // Convert FileList to Array

    if (files.length + selectedFiles.length > 3) {
      alert("You can only select up to 3 images.");
      return;
    }

    // Validate file types (only images)
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      alert("Only image files are allowed.");
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const toggleAddNew = () => {
    setShowEdit(false);
    setApp_Id("");
    setdata({
      appName: "",
      appDescription: "",
      appUrl: "",
      appDetails: "",
      selectedFiles: "",
      appImage: "",
    });
    setShowAddNew((prev) => !prev);
  };
  const toggleEdit = (id: any) => {
    setShowEdit(true);
    setShowAddNew((prev) => !prev);
    fetchApplicationDatabyId(id);
  };
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("Component must be wrapped with StoreContextProvider");
  }
  const { user_data, logOut, token } = context;

  const [data, setdata] = useState({
    appName: "",
    appDescription: "",
    appUrl: "",
    appDetails: "",
    selectedFiles: "",
    appImage: "",
  });

  const onChangeHandler = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setdata((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", user_data ? user_data._id : "");
    formData.append("appName", data.appName);
    formData.append("appDescription", data.appDescription);
    formData.append("appUrl", data.appUrl);
    formData.append("appDetails", data.appDetails);

    if (appImage) {
      formData.append("image", appImage);
    }
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append("appImages", file);
      });
    }
    if (app_Id) {
      formData.append("app_id", app_Id);
    }

    try {
      const response = await fetch("/api/user/applications/add-edit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        toast(result.message);
        setdata({
          appName: "",
          appDescription: "",
          selectedFiles: "",
          appUrl: "",
          appDetails: "",
          appImage: "",
        });
        setSelectedFiles([]);
        setImage(null);
        setImagePreview(null);
      } else {
        toast.error(result.message);
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fetchApplicationDatabyId = async (id: string) => {
    try {
      let response;
      response = await fetch(
        `/api/user/applications/list?appId=${id}&userId=${user_data?._id}`,
        {
          method: "GET",
        }
      );

      const result = await response.json();
      if (result.success) {
        setdata(result.application_Data);
        console.log(setdata);
        setApp_Id(result.application_Data._id);
      } else {
        toast.error("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error Loading form:", error);
    }
  };

  const fetchApplicationData = async () => {
    try {
      // Pass user ID as a query parameter
      let response;

      response = await fetch(
        `/api/user/applications/list?userId=${user_data?._id}`,
        {
          method: "GET",
        }
      );

      const result = await response.json();
      if (result.success) {
        // Handle successful data fetch
        // Maybe set the applications in state
        setApplicationData(result.application_Data);
        console.log(result.application_Data);
      } else {
        toast.error("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error Loading form:", error);
    }
  };

  const removeApplication = async (appId: string) => {
    const confirmDelete = () => {
      return new Promise<boolean>((resolve) => {
        toast(
          <div className="bg-white text-white p-4 rounded">
            <h5 className="text-center text-dark mb-3">Are you sure?</h5>
            <p className="text-center text-secondary mb-4">
              Do you really want to delete this item? This process cannot be
              undone.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-outline-secondary px-4"
                onClick={() => {
                  toast.dismiss(); // Close the toast
                  resolve(false); // Cancel the action
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger px-4"
                onClick={() => {
                  toast.dismiss(); // Close the toast
                  resolve(true); // Confirm deletion
                }}
              >
                Delete
              </button>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
          }
        );
      });
    };

    const proceedWithDeletion = async (appId: string) => {
      try {
        const response = await fetch(
          `/api/user/applications/delete?appId=${appId}`,
          { method: "DELETE" }
        );
        const result = await response.json();

        if (result.success) {
          toast.success(result.message);
          await fetchApplicationData(); // Refresh data
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error removing application:", error);
        toast.error("Failed to remove application");
      }
    };

    const userConfirmed = await confirmDelete();
    if (userConfirmed) {
      proceedWithDeletion(appId);
    } else {
      toast.info("Deletion canceled.");
    }
  };

  useEffect(() => {
    // Only fetch if user_data exists
    if (user_data?._id) {
      fetchApplicationData();
    }
  }, [user_data?._id, showAddNew, setShowAddNew]);

  return (
    <section className="container section b-details sticky-parent">
      <div className="row">
        <div className="col-12 col-md-4 col-lg-3">
          <div className="bg-dark p-3 rounded text-light">
            <div className="d-flex align-items-center mb-4">
              <Image
                src={userProfile}
                alt="Profile Picture"
                className="rounded-circle me-2 w-25"
                priority
              />
              <div>
                <h6 className="mb-0">Hello,</h6>
                <p className="mb-0">{user_data ? user_data.name : ""}</p>
              </div>
            </div>

            <ul className="nav  mb-4" role="tablist">
              <li
                className="nav-item w-100 text-light"
                role="presentation"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F5FAFF")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <a
                  className="nav-link active"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="true"
                >
                  Profile Information
                </a>
              </li>
              <li
                className="nav-item w-100"
                role="presentation"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F5FAFF")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <a
                  className="nav-link"
                  id="myApplications-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#myApplications"
                  type="button"
                  role="tab"
                  aria-controls="myApplications"
                  aria-selected="false"
                >
                  {user_data
                    ? user_data.roles.includes("admin")
                      ? "Applications"
                      : "My Applications"
                    : ""}
                </a>
              </li>
            </ul>

            <button
              onClick={logOut}
              className="btn btn--quaternary d-flex w-100 justify-content-center"
            >
              <p>Logout</p>
            </button>
          </div>
        </div>

        <div className="col-12 col-md-8 col-lg-9">
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div className="bg-dark p-4 rounded border text-light">
                <h3 className="mb-4">Personal Information</h3>

                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="firstName"
                        className="form-label text-light"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="form-control bg-dark text-light border-secondary"
                        value={user_data ? user_data.name : ""}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="lastName"
                        className="form-label text-light"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="form-control bg-dark text-light border-secondary"
                        value={user_data ? user_data.email : ""}
                        disabled
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="myApplications"
              role="tabpanel"
              aria-labelledby="myApplications-tab"
            >
              <div className="bg-dark p-4 rounded border text-light">
                <div className="d-flex justify-content-between">
                  <h3 className="mb-4">My Applications</h3>
                  <button
                    onClick={toggleAddNew}
                    className="btn btn--quaternary"
                  >
                    {!showAddNew ? "Submit App" : "Your Apps"}
                  </button>
                </div>

                {/* Conditionally Render Add New Section */}
                {showAddNew ? (
                  <div className="bg-dark p-4 text-light">
                    {showEdit ? (
                      <>
                        <h3 className="mb-4">Edit App</h3>
                        <p className="text-white">
                          <strong>Note</strong>
                          <span className="text-danger">*</span> The uploaded
                          image cannot be displayed because this site is
                          deployed on a free instance. <Link href="contact-us" className="text-primary">Contact Me </Link> if u want to show those images i will add manually 
                        </p>
                        <form onSubmit={handleSubmit}>
                          <div className="mb-3 mt-2">
                            <label htmlFor="appName" className="form-label">
                              App Name *
                            </label>
                            <input
                              type="text"
                              name="appName"
                              id="appName"
                              onChange={onChangeHandler}
                              className="form-control bg-dark text-light border-secondary"
                              placeholder="Enter app name"
                              value={data.appName}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="appDescription"
                              className="form-label"
                            >
                              Description *
                            </label>
                            <textarea
                              id="appDescription"
                              name="appDescription"
                              onChange={onChangeHandler}
                              value={data.appDescription}
                              className="form-control bg-dark text-light border-secondary"
                              placeholder="Enter description"
                              required
                            ></textarea>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="appUrl" className="form-label">
                              URL *
                            </label>
                            <input
                              type="text"
                              id="appUrl"
                              name="appUrl"
                              onChange={onChangeHandler}
                              value={data.appUrl}
                              required
                              className="form-control bg-dark text-light border-secondary"
                              placeholder="Enter app URL"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="appImage">
                              <p>Featured Image *</p>
                              {imagePreview ? (
                                <Image
                                  src={imagePreview}
                                  alt="Preview"
                                  width={100} // Replace with desired dimensions
                                  height={100}
                                  style={{ objectFit: "cover" }}
                                />
                              ) : data.appImage ? (
                                <Image
                                  src={data.appImage}
                                  alt="Preview"
                                  width={100}
                                  height={100}
                                  style={{ objectFit: "cover" }}
                                />
                              ) : (
                                <Image
                                  src={userProfile}
                                  alt="Default Profile"
                                  width={100}
                                  height={100}
                                  style={{ objectFit: "cover" }}
                                />
                              )}
                            </label>
                            <input
                              type="file"
                              id="appImage"
                              name="appImg"
                              onChange={handleImageChange}
                              className="form-select bg-dark text-light border-secondary"
                              accept="image/*"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="appDetails" className="form-label">
                              Details *
                            </label>
                            <textarea
                              id="appDetails"
                              name="appDetails"
                              onChange={onChangeHandler}
                              value={data.appDetails}
                              required
                              className="form-control bg-dark text-light border-secondary"
                              placeholder="Enter app description"
                              rows={4} // Adjust the number of rows as needed
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="appImages" className="form-label">
                              Select Images (Max 3)
                            </label>
                            <input
                              type="file"
                              id="appImages"
                              name="appImages"
                              className="form-control bg-dark text-light border-secondary"
                              onChange={onFileChange}
                              multiple
                              accept="image/*"
                            />
                            {selectedFiles.length > 0 && (
                              <div className="mt-3">
                                <h6>Selected Images:</h6>
                                <ul className="list-group">
                                  {selectedFiles.map(
                                    (file: any, index: number) => (
                                      <li
                                        key={index}
                                        className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center"
                                      >
                                        {file.name}
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-danger"
                                          onClick={() => removeImage(index)}
                                        >
                                          Remove
                                        </button>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          <button type="submit" className="btn btn-success">
                            Submit
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        <h3 className="mb-4">List Your App</h3>
                        <p className="text-white">
                          <strong>Note</strong>
                          <span className="text-danger">*</span> The uploaded
                          image cannot be displayed because this site is
                          deployed on a free instance. <Link href="contact-us" className="text-primary">Contact Me </Link> if u want to show those images i will add manually 
                        </p>

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3 mt-4">
                            <label htmlFor="appName" className="form-label">
                              App Name
                            </label>
                            <input
                              type="text"
                              name="appName"
                              id="appName"
                              onChange={onChangeHandler}
                              className="form-control bg-dark text-light border-secondary"
                              placeholder="Enter app name"
                              value={data.appName}
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="appDescription"
                              className="form-label"
                            >
                              Description
                            </label>
                            <textarea
                              id="appDescription"
                              name="appDescription"
                              onChange={onChangeHandler}
                              value={data.appDescription}
                              className="form-control bg-dark text-light border-secondary"
                              placeholder="Enter description"
                            ></textarea>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="appUrl" className="form-label">
                              URL
                            </label>
                            <input
                              type="text"
                              id="appUrl"
                              name="appUrl"
                              onChange={onChangeHandler}
                              value={data.appUrl}
                              className="form-control bg-dark text-light border-secondary"
                              placeholder="Enter app URL"
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="appImage">
                              {imagePreview ? (
                                <Image
                                  src={imagePreview}
                                  alt="Preview"
                                  width={100} // Replace with desired dimensions
                                  height={100}
                                  style={{ objectFit: "cover" }}
                                />
                              ) : (
                                <Image
                                  src={userProfile}
                                  alt="Default Profile"
                                  width={100}
                                  height={100}
                                  style={{ objectFit: "cover" }}
                                />
                              )}
                            </label>
                            <input
                              type="file"
                              id="appImage"
                              name="appImg"
                              onChange={handleImageChange}
                              className="form-select bg-dark text-light border-secondary"
                              accept="image/*"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="appDetails" className="form-label">
                              Details *
                            </label>
                            <textarea
                              id="appDetails"
                              name="appDetails"
                              onChange={onChangeHandler}
                              value={data.appDetails}
                              required
                              className="form-control bg-dark text-light border-secondary"
                              placeholder="Enter app description"
                              rows={4} // Adjust the number of rows as needed
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="appImages" className="form-label">
                              Select Images (Max 3)
                            </label>
                            <input
                              type="file"
                              id="appImages"
                              name="appImages"
                              className="form-control bg-dark text-light border-secondary"
                              onChange={onFileChange}
                              multiple
                              accept="image/*"
                            />
                            {selectedFiles.length > 0 && (
                              <div className="mt-3">
                                <h6>Selected Images:</h6>
                                <ul className="list-group">
                                  {selectedFiles.map(
                                    (file: any, index: number) => (
                                      <li
                                        key={index}
                                        className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center"
                                      >
                                        {file.name}
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-danger"
                                          onClick={() => removeImage(index)}
                                        >
                                          Remove
                                        </button>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                          <button type="submit" className="btn btn-success">
                            Submit
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="cart-t-wrapper mt-4 bg-dark p-4 rounded">
                    
                    <div className="table-responsive">
                      <table className="table table-dark table-striped table-bordered align-middle">
                        <thead className="thead-light">
                          <tr className="text-center">
                            <th>#</th>
                            <th>App Name</th>
                            <th>url</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicationData && applicationData.length > 0 ? (
                            applicationData.map((item: any, index: number) => {
                              return (
                                <UserProductShow
                                  key={item.id}
                                  item={item}
                                  index={index}
                                  removeApplication={() =>
                                    removeApplication(item._id)
                                  }
                                  toggleEdit={() => toggleEdit(item._id)}
                                />
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="text-center text-muted"
                              >
                                No Applications Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountDetails;
