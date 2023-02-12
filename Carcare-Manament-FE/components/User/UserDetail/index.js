import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Select,
  Input,
  DatePicker,
  Upload,
  Cascader,
  Popconfirm,
} from "antd";
import { useRouter } from "next/router";
import { openNotification, openNotificationWarning } from "utils/notification";
import {
  getUserById,
  updateUserById,
  activeUser,
  inactiveUser,
} from "pages/api/userAPI";
import { uploadImage } from "pages/api/uploadAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";
import moment from "moment";
import ModalUploadImage from "components/Modal/ModalUploadImage";
import {
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  SaveOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import Loading from "components/Loading";
const formatDate = "YYYY/MM/DD";
import JsonData from "data/address-vn.json";

function UserDetail({ userId, onUpdateUser }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [userDetail, setUserDetail] = useState({});
  const [modalUpload, setModalUpload] = useState(false);
  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });
  const [modalQuestion, setModalQuestion] = useState(false);
  const [imageS3, setImageS3] = useState(null);
  const [loading, setLoading] = useState(false);

  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtSelected, setDistrictSelected] = useState("");
  const [wardSelected, setWardSelected] = useState("");
  const [provinceSelectedCode, setProvinceSelectedCode] = useState("");
  const [districtSelectedCode, setDistrictSelectedCode] = useState("");
  const [wardSelectedCode, setWardSelectedCode] = useState("");
  const [addressData, setAddressData] = useState(JsonData);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const response = await getUserById(userId);
      setUserDetail(response.data.Data);
      console.log(response);
      form.setFieldsValue({
        name: response.data.Data.name,
        phone: response.data.Data.phone,
        email: response.data.Data.email,
        birthDay: moment(moment(response.data.Data.birthDay), formatDate),
        address: response.data.Data.address,
        nationality: response.data.Data.nationality,
        identityNumber: response.data.Data.identityNumber,
        gender: response.data.Data.gender,
        addressvn: [
          response.data.Data.provinceCode,
          response.data.Data.districtCode,
          response.data.Data.wardCode,
        ],
        image: response.data.Data.image,
        userCode: response.data.Data.userCode,
        status: response.data.Data.status,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let body = {
        name: values.name,
        email: values.email,
        address: values.address,
        district: districtSelected,
        province: provinceSelected,
        ward: wardSelected,
        districtCode: districtSelectedCode,
        provinceCode: provinceSelectedCode,
        wardCode: wardSelectedCode,
        status: values.status,
        // image: imageS3 || userDetail?.image,
        birthDay: values.birthDay,
        identityNumber: values.identityNumber,
        gender: values.gender,
        nationality: values.nationality,
      };
      console.log(body);
      const res = await updateUserById(body, userId);
      setUserDetail(res.data.Data);
      openNotification("Thành công!", "Cập nhật nhân viên thành công");
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Cập nhật thông tin nhân viên thất bại");
      }
      setLoading(false);
    }
  };

  const handleUpdateImage = async (imageUpload) => {
    let body = {
      image: imageUpload,
    };
    try {
      const res = await updateUserById(body, userId);
      openNotification("Thành công!", "Cập nhật ảnh đại diện thành công");
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  // handle upload image

  const handleFileChosen = (info) => {
    const result = info.fileList.map((file) => {
      const blob = new Blob([file.originFileObj], {
        type: file.type,
      });
      return (window.URL || window.webkitURL).createObjectURL(blob);
    });
    setListFiles({ images: info.fileList, imageBlob: result });
    setModalUpload(true);
  };

  const handleUploadImages = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      listFiles.images.map((image) => {
        formData.append("files", image.originFileObj);
      });
      const response = await uploadImage(formData);
      setImageS3(response.data.Data[0]);
      setUserDetail((prevState) => {
        return { ...prevState, image: response.data.Data[0] };
      });
      setListFiles({ images: [], imageBlob: [] });
      openNotification("Thành công", "Tải ảnh lên thành công");
      handleUpdateImage(response.data.Data[0]);
      setModalUpload(false);
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
      setLoading(false);
    }
  };
  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    if (selectedOptions) {
      setProvinceSelected(selectedOptions[0]?.label);
      setDistrictSelected(selectedOptions[1]?.label);
      setWardSelected(selectedOptions[2]?.label);
      setProvinceSelectedCode(selectedOptions[0]?.value);
      setDistrictSelectedCode(selectedOptions[1]?.value);
      setWardSelectedCode(selectedOptions[2]?.value);
    }
  };
  const filter = (inputValue, path) =>
    path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );

  const handleActiveUser = async () => {
    setLoading(true);
    try {
      const res = await activeUser(userId);
      openNotification("Thành công!", "Kích hoạt tài khoản thành công");
      fetchUserDetail();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
      setLoading(false);
    }
  };
  const handleInActiveUser = async () => {
    setLoading(true);
    try {
      const res = await inactiveUser(userId);
      openNotification("Thành công!", "Vô hiệu hóa tài khoản thành công");
      fetchUserDetail();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Image width={300} height={250} src={userDetail.image} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Upload
              onChange={(info) => handleFileChosen(info)}
              showUploadList={false}
              fileList={listFiles.imageBlob}
              maxCount={1}
              listType="picture"
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Thay đổi ảnh đại diện</Button>
            </Upload>
          </div>
        </Col>
        <Col span={18}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row gutter={[32]}>
              <Col span={12}>
                <Form.Item
                  label="Tên"
                  name="name"
                  rules={[
                    {
                      pattern: new RegExp(
                        "^[A-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ]+[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*( *[a-zA-Z0-9_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)*$"
                      ),
                      required: true,
                      message: "Tên người dùng không hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Mã nhân viên"
                  name="userCode"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Trạng thái"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="status"
                >
                  {userDetail?.status === "ACTIVE" ? (
                    <Popconfirm
                      title="Bạn có chắc chắn vô hiệu hóa người dùng này?"
                      placement="topLeft"
                      okText="Đông ý"
                      cancelText="Hủy"
                      onConfirm={() => {
                        handleInActiveUser();
                      }}
                    >
                      <Button
                        style={{
                          backgroundColor: "#22C55E",
                          width: "100%",
                          color: "white",
                        }}
                      >
                        Hoạt dộng
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="Bạn có chắc chắn kích hoạt hoạt động người dùng này?"
                      placement="topLeft"
                      okText="Đông ý"
                      cancelText="Hủy"
                      onConfirm={() => {
                        handleActiveUser();
                      }}
                    >
                      <Button style={{ width: "100%" }} type="danger">
                        Không hoạt dộng
                      </Button>
                    </Popconfirm>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      pattern: new RegExp("^(84|0[3|5|7|8|9])+([0-9]{8})$"),
                      required: true,
                      message:
                        "Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09",
                    },
                  ]}
                >
                  <Input
                    disabled
                    maxLength={10}
                    minLength={10}
                    prefix={<PhoneOutlined className="site-form-item-icon" />}
                    placeholder="Nhập vào số điện thoại"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      pattern: new RegExp("[0-9]{9,12}"),
                      message: "Số CMND/CCCD không hợp lệ!",
                    },
                  ]}
                  name="identityNumber"
                  label="Số CMND / CCCD"
                >
                  <Input
                    placeholder="Số Căn cước/Chứng minh"
                    minLength={9}
                    maxLength={12}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  rules={[
                    {
                      pattern: new RegExp(
                        "^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$"
                      ),
                      message: "Email không hợp lệ!",
                    },
                  ]}
                  label="Email"
                  name="email"
                >
                  <Input
                    prefix={<MailOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Ngày sinh" name="birthDay">
                  <DatePicker
                    disabledDate={(d) => !d || d.isSameOrAfter(moment())}
                    format={formatDate}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Giới tính" name="gender">
                  <Select>
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                    <Select.Option value="Khác">Khác</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Quốc tịch" name="nationality">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="addressvn"
                  label="Tỉnh/Thành phố - Quận/Huyện - Phường/Xã"
                >
                  <Cascader
                    changeOnSelect
                    id="addressDetail"
                    options={addressData}
                    onChange={onChange}
                    placeholder="Tỉnh/Thành phố - Quận/Huyện - Phường/Xã"
                    showSearch={{
                      filter,
                    }}
                    onSearch={(value) => console.log(value)}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Số nhà / Tên Đường" name="address">
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="PullRight">
              <div
                style={{ bottom: "0", right: "20px", margin: "10px" }}
                className="service-action"
              >
                {/* <div style={{ marginRight: "20px" }}>
                  <Button
                    onClick={() => {
                      fetchUserDetail();
                    }}
                  >
                    Đặt lại
                  </Button>
                </div> */}
                <div>
                  <Popconfirm
                    title="Xác nhận?"
                    placement="topLeft"
                    okText="Đồng ý"
                    cancelText="Hủy"
                    onConfirm={() => {
                      form
                        .validateFields()
                        .then((values) => {
                          onFinish(values);
                        })
                        .catch((info) => {
                          console.log("Validate Failed:", info);
                        });
                    }}
                  >
                    <Button icon={<SaveOutlined />} type="primary">
                      Cập nhật
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </Row>
          </Form>
        </Col>
      </Row>
      <ModalUploadImage
        visible={modalUpload}
        handleCancel={() => setModalUpload(false)}
        handleOk={() => handleUploadImages()}
        listImage={listFiles.imageBlob}
      />
      <Loading loading={loading} />
    </>
  );
}

export default UserDetail;
