import React, { useEffect } from "react";
import { useRouter } from "next/router";
import HomePageCustomer from "pages/home";
import { loadUser } from "pages/api/authAPI";

function HomePage() {
  const router = useRouter();
  const handleAuthentication = async () => {
    try {
      const res = await loadUser();
      if (res.data.Data.roles == "ROLE_USER" || res.data.Data.roles == "ROLE_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handleAuthentication();
  }, []);
  return (
    <>
      <HomePageCustomer />
    </>
  );
}

export default HomePage;
