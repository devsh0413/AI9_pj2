const cookieOption = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 14 * 24 * 60 * 60 * 1000,
};

const cookieOption2 = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 0,
};

module.exports = { cookieOption, cookieOption2 };
