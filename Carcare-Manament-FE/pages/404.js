import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Result, Button } from "antd";

const NotFound = () => {
  const [count, setCount] = useState(30);
  const router = useRouter();
  useEffect(() => {
    let interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          router.push("/");
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="container">
      
      <Result
  
        status="404"
        title="404"
        subTitle="404 - Không tìm thấy trang"
        extra={
          <Link href="/">
            <a>Quay lại trang chủ sau {count}s</a>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
