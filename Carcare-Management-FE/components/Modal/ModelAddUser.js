import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Col,
  Row,
  Cascader,
  InputNumber,
  DatePicker,
} from "antd";
import { PhoneOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { createUser } from "pages/api/userAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification, openNotificationWarning } from "utils/notification";
import JsonData from "data/address-vn.json";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;
const formatDate = "DD/MM/YYYY";
function ModalAddUser({ show, onSuccess, handleCancel }) {
  const [form] = Form.useForm();
  const [addressData, setAddressData] = useState(JsonData);

  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtSelected, setDistrictSelected] = useState("");
  const [wardSelected, setWardSelected] = useState("");
  const [provinceSelectedCode, setProvinceSelectedCode] = useState("");
  const [districtSelectedCode, setDistrictSelectedCode] = useState("");
  const [wardSelectedCode, setWardSelectedCode] = useState("");

  const onFinish = async (values) => {
    const dataUser = {
      fullname: values.fullname,
      email: values.email,
      phone: values.phone,
      address: values.address,
      district: districtSelected,
      province: provinceSelected,
      ward: wardSelected,
      districtCode: districtSelectedCode,
      provinceCode: provinceSelectedCode,
      wardCode: wardSelectedCode,
      gender: values.gender,
      birthDay: values.birthDay,
      nationality: values.nationality,
      identityType: 2,
      identityNumber: values.identityNumber,
    };
    console.log("data create", dataUser);

    try {
      const res = await createUser(dataUser);
      console.log(res);
      openNotification("Thành công!", "Tạo mới người dùng thành công");
      handleCancel();
      onSuccess(res?.data?.Data);
      form.resetFields();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
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

  return (
    <>
      <Modal
        centered
        title="Thêm nhân viên mới"
        visible={show}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onFinish(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        onCancel={handleCancel}
        width={700}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16]}>
            <Col span={18}>
              <Form.Item
                rules={[
                  {
                    pattern: new RegExp(
                      "^[A-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ]+[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*( *[a-zA-Z0-9_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)*$"
                    ),
                    required: true,
                    message: "Tên người dùng không hợp lệ!",
                  },
                ]}
                label="Tên nhân viên"
                name="fullname"
              >
                <Input
                  placeholder="Tên nhân viên"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item initialValue="Khác" name="gender" label="Giới tính">
                <Select>
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    pattern: new RegExp("^(84|0[3|5|7|8|9])+([0-9]{8})$"),
                    required: true,
                    message:
                      "Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09",
                  },
                ]}
                name="phone"
                label="Số điện thoại"
              >
                <Input
                  minLength={10}
                  maxLength={10}
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                  placeholder="số điện thoại"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                name="email"
                label="Email"
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="birthDay" label="Ngày sinh">
                <DatePicker
                  disabledDate={(d) => !d || d.isSameOrAfter(moment())}
                  placeholder="Chọn ngày sinh"
                  format={formatDate}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                initialValue="Việt Nam"
                name="nationality"
                label="Quốc gia"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="addressvn" label="Tỉnh/Thành phố - Quận/Huyện - Phường/Xã">
                <Cascader
                  changeOnSelect
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
              <Form.Item name="address" label="Số nhà / tên đường">
                <TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default ModalAddUser;
