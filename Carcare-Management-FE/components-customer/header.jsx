import { Button, Carousel } from "antd";
import { useRouter } from "next/router";

export const CustomerHeader = () => {
  const router = useRouter();
  return (
    <header id="header">
      <Carousel draggable effect="fade" autoplay>
        <div className="intro bg1">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-12 intro-text">
                  <h1>
                    LVCARCARE
                    <span></span>
                  </h1>
                  <p>Hãy tặng chiếc xe của bạn món quà tuyệt vời nhất</p>
                  <Button
                    onClick={() => router.push("/login")}
                    size="large"
                    
                    style={{width:'150px' ,height:"40px",background:'linear-gradient(to top right, pink, cyan)'}}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="intro bg2">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-12 intro-text">
                  <h1>
                    LVCARCARE
                    <span></span>
                  </h1>
                  <p>Chiếc xe của bạn xứng đáng với điều tốt nhất</p>
                  <Button
                    onClick={() => router.push("/login")}
                    size="large"
                    style={{width:'150px' ,height:"40px",background:'linear-gradient(to top right, pink, cyan)'}}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="intro bg3">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-12 intro-text">
                  <h1>
                    LVCARCARE
                    <span></span>
                  </h1>
                  <p>Hiệu suất cao và dịch vụ cao cấp</p>
                  <Button
                    onClick={() => router.push("/login")}
                    size="large"
                    style={{width:'150px' ,height:"40px",background:'linear-gradient(to top right, pink, cyan)'}}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="intro bg4">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-12 intro-text">
                  <h1>
                    LVCARCARE
                    <span></span>
                  </h1>
                  <p>Sự lựa chọn đúng đắn của việc sửa chữa phù hợp</p>
                  <Button
                    onClick={() => router.push("/login")}
                    size="large"
                    style={{width:'150px' ,height:"40px",background:'linear-gradient(to top right, pink, cyan)'}}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="intro bg5">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-12 intro-text">
                  <h1>
                    LVCARCARE
                    <span></span>
                  </h1>
                  <p>Lấy lại hiệu suất tốt nhất của xe</p>
                  <Button
                    onClick={() => router.push("/login")}
                    size="large"
                    style={{width:'150px' ,height:"40px",background:'linear-gradient(to top right, pink, cyan)'}}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel>
    </header>
  );
};
