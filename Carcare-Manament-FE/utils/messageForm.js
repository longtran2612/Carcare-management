const validateMessages = {
  required: "${label} không được bỏ trống!",
  types: {
    email: "${label} không hợp lệ!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export { validateMessages };
