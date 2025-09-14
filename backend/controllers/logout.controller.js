const LogoutFunction = (req, res) => {
  return res
    .cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 0,
    })
    .status(200)
    .json({ logout: true });
};

export default LogoutFunction;
