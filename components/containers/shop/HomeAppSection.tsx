"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 4;

  // Fetch applications with pagination
  const fetchApplicationData = async (page = 1) => {
    if (page < 1 || page > totalPages) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/user/applications/list/productData?page=1&limit=${6}`
        
      );
      const result = await response.json();
      if (result.success) {
        setProductData(result.application_Data);
        setOriginalData(result.application_Data);
        setCurrentPage(page);
        setTotalPages(result.totalPages);
      } else {
        toast.error("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error Loading form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/users-data`);
      const result = await response.json();
      if (result.success) {
        setUserData(result.user_Data);
      } else {
        toast.error("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error Loading form:", error);
    }
  };

  // Filter applications using search term and selected filters
  const filteredData = useMemo(() => {
    let data = [...originalData];

    if (searchTerm) {
      data = data.filter(
        (item) =>
          item.appName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilters.length > 0) {
      data = data.filter((item) => selectedFilters.includes(item.user_id));
    }

    return data;
  }, [searchTerm, selectedFilters, originalData]);

  useEffect(() => {
    setProductData(filteredData);
  }, [filteredData]);

  useEffect(() => {
    fetchApplicationData(currentPage);
    fetchUserData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target;
    setSelectedFilters((prev) =>
      checked ? [...prev, value] : prev.filter((filter) => filter !== value)
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchApplicationData(page);
    }
  };

  return (
    <>
      <section className="section shop sticky-parent">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9">
              <div className="shop__content sticky-item">
                <div className="row gaper">
                  {isLoading ? ( // Check if the data is still loading
                    <div className="loading-spinner d-flex flex-column align-items-center justify-content-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{ width: "3rem", height: "3rem" }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-secondary">Loading...</p>
                    </div>
                  ) : (
                    productData.map((item: any) => {
                      return (
                        <div
                          className="col-12 col-md-6 slide-top"
                          key={item._id}
                        >
                          <div className="category__single topy-tilt">
                            <div className="thumb">
                              <Link
                                href={`product-single/${item._id}`}
                                className="thumb-img"
                              >
                                <Image
                                  src={item.appImage}
                                  alt="Image hello"
                                  width={100}
                                  height={100}
                                  style={{
                                    objectFit: "contain",
                                    maxHeight: "180px",
                                  }}
                                  priority
                                />
                              </Link>
                              <Link
                                href={`product-single/${item._id}`}
                                className="tag"
                              >
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
                                <Link href={`product-single/${item._id}`}>
                                  {item.appName}
                                </Link>
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
                    })
                  )}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppsSection;
