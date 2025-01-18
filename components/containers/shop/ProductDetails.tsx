"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductDetailsSlider from "./ProductDetailsSlider";



interface AppData {
  _id: string;
  email: string;
  name?: string;
  roles: [string];
  appImage?: string;
  category?: string;
  appName?: string;
  appUrl?: string;
  appCategory?: string;
}

const ProductDetails = ({ id }: any) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [productData, setProductData] = useState<AppData[]>([]);

  const fetchApplicationData = async () => {
    try {
      let response;
      response = await fetch(`/api/user/applications/list/productData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.success) {
        // Handle successful data fetch
        // Maybe set the applications in state
        setProductData(result.application_Data);

        // console.log(result.application_Data);
      } else {
        console.log(result.application_Data);
        // toast.error("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error Loading form:", error);
    }
  };
  useEffect(() => {
    // Only fetch if user_data exists
    fetchApplicationData();
  }, []);
  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <>
      {(Array.isArray(productData) ? productData : [productData]).map((item: any) => {
          return (
            <section className="section pb-0 p-details" key={item._id}>
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="product-info">
                      <div className="row align-items-center gaper">
                        <div className="col-12 col-lg-6">
                          <ProductDetailsSlider
                            displayImages={item.displayImages}
                          />
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="product__content">
                            <h2 className="title fw-7 text-white">
                              {item.appName}
                            </h2>
                            <div className="paragraph">
                              <p>{item.appDescription}</p>
                            </div>
                            <div className="paragraph mt-2">
                              <p>{item.appDetails}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }
      )}
    </>
  );
};

export default ProductDetails;
