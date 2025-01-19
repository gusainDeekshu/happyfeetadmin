"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
interface AppData {
  _id: string;
  user_id: string;
  email: string;
  name?: string;
  roles: [string];
  appImage?: string;
  category?: string;
  appName?: string;
  appUrl?: string;
  appCategory?: string;
}
const AppsSection = () => {
  const [productData, setProductData] = useState<AppData[]>([]);
  const [userData, setUserData] = useState<AppData[]>([]);
  const [originalData, setOriginalData] = useState<AppData[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1); // Start with page 1
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const itemsPerpage = 4;
  const fetchApplicationData = async (page = 1) => {
    try {
      let response;
      response = await fetch(
        `/api/user/applications/list/productData?page=${page}&limit=${itemsPerpage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        // Handle successful data fetch
        // Maybe set the applications in state

        setProductData(result.application_Data);
        setOriginalData(result.application_Data);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
      } else {
        toast.error("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error Loading form:", error);
    }
  };
  const fetchUserData = async () => {
    try {
      let response;

      response = await fetch(`/api/user/users-data`, {
        method: "GET",
      });

      const result = await response.json();
      if (result.success) {
        // Handle successful data fetch
        // Maybe set the applications in state
        setUserData(result.user_Data);
      } else {
        toast.error("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error Loading form:", error);
    }
  };
  const filterApplicationData = () => {
    let filteredData = originalData;

    // Apply text search filter
    if (searchTerm) {
      filteredData = filteredData.filter(
        (item) =>
          item.appName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply checkbox filters
    if (selectedFilters.length > 0) {
      filteredData = filteredData.filter((item: any) =>
        selectedFilters.includes(item.user_id)
      );
    }

    setProductData(filteredData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target;

    let updatedFilters = [...selectedFilters];
    if (checked) {
      // Add the filter
      updatedFilters.push(value);
    } else {
      // Remove the filter
      updatedFilters = updatedFilters.filter((filter) => filter !== value);
    }

    setSelectedFilters(updatedFilters);
  };

  useEffect(() => {
    // Only fetch if user_data exists
    fetchApplicationData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    filterApplicationData();
    fetchUserData();
  }, [searchTerm, selectedFilters]);

  const handlePageChange = (page: any) => {
    
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <section className="section shop sticky-parent">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4">
            <div className="shop__sidebar sticky-item">
              <div className="shop-sidebar-single shop-search-bar">
                <form action="#" method="post">
                  <div className="search-group">
                    <input
                      type="text"
                      name="product-search"
                      id="ProductSearch"
                      placeholder="Search By App Name"
                      onChange={handleSearchChange}
                      required
                    />
                    <button type="submit">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </form>
              </div>
              <div className="shop-sidebar-single shop-category">
                <h3 className="title-animation fw-6 text-white mt-12">
                  Search By User Name
                </h3>
                <ul className="check-group">
                  {userData.slice(0, 4).map((item: any) => {
                    return (
                      <li className="check-group-single" key={item._id}>
                        <input
                          type="checkbox"
                          onChange={handleCategoryCheckboxChange}
                          value={item._id}
                          name="product-ai"
                          id="productAi"
                        />
                        <label htmlFor="productAi">{item.name}</label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-8">
            <div className="shop__content sticky-item">
              <div className="row gaper">
                {productData.map((item: any) => {
                  return (
                    <div className="col-12 col-md-6 slide-top" key={item._id}>
                      <div className="category__single topy-tilt">
                        <div className="thumb">
                          <Link href={`product-single/${item._id}`} className="thumb-img">
                            <Image
                              src={item.appImage}
                              alt="Image hello"
                              width={100}
                              height={100}
                              style={{ objectFit: "contain" ,maxHeight:"180px"}}
                              priority
                            />
                          </Link>
                          <Link href={`product-single/${item._id}`} className="tag">
                            <Image
                              src={item.appImage}
                              alt="Image"
                              width={100}
                              height={100}
                              style={{ objectFit: "cover" }}
                              priority
                            />
                          </Link>
                        </div>
                        <div className="content">
                          <h5>
                            <Link href={`product-single/${item._id}`}>{item.appName}</Link>
                          </h5>
                        </div>
                        <hr />
                        <div className="meta">
                          <div className="meta-info">
                            <div className="meta-thumb">
                              <Image
                                src={item.appImage}
                                alt="Image"
                                priority
                                width={100}
                                height={100}
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <p className="tertiary-text">
                              {" "}
                              {item.appDescription?.length > 20
                                ? `${item.appDescription.slice(0, 20)}...`
                                : item.appDescription}
                            </p>
                          </div>
                        </div>
                        <div className="cta">
                          <Link
                            href={`product-single/${item._id}`}
                            className="btn btn--quaternary"
                          >
                            Full Description
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="section__cta">
                    <ul className="pagination">
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <i className="fa-solid fa-angle-left"></i>
                        </button>
                      </li>
                    
                        {Array.from({ length: totalPages }, (_, index) => (
                         <li  key={index}> <button
                           
                            onClick={() => handlePageChange(index + 1)}
                            className={`btn ${
                              currentPage === index + 1
                                ? "active"
                                : ""
                            } mx-1`}
                          >
                            {index + 1}
                          </button>
                          </li>
                        ))}
                      
                     
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppsSection;
