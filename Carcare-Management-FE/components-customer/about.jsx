import Image from "next/image";
export const About = (props) => {
  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <img src="img/rua-xe2.jpg" className="img-responsive" alt="" />{" "}
            {/* <Image src="/img/about.jpg" width={500} height={500} /> */}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2>Về chúng tôi</h2>
              <p>Thành lập và hoạt động trong ngành Chăm sóc xe (Detailing) 
                từ tháng 08 năm 2022, LVCarCare chuyên cung cấp đa dạng các dịch vụ Chăm sóc xe như: Phủ Ceramic sơn/kính; Phủ nano sơn/kính; Dán phim cách nhiệt; Đánh bóng,
                hiệu chỉnh sơn; Vệ sinh- bảo dưỡng khoang động cơ và nội thất...</p>
              <h3>Tại sao nên sử dụng dịch vụ ở LVCARCARE?</h3>
              <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li  key={`${d}-${i}`}><i style={{color:"blue"}} class="fas fa-arrow-right"></i>  {d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`}><i style={{color:"blue"}} class="fas fa-arrow-right"></i> {d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
