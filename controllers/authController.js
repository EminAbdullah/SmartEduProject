const bcrypt = require("bcrypt");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     await User.findOne({ email }, (err, user) => {
//       if (user) {
//         bcrypt.compare(password, user.password, (err, same) => {
//           if (same) {
//             res.status(200).send("You are logged in");
//           }
//         });
//       }
//     });

//     res.status(201).json({ status: "success", user });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       error,
//     });
//   }
// };

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const same = bcrypt.compare(password, user.password);
    if (!same) {
      return res.status(401).send("Invalid password");
    }

    req.session.userID = user._id;
    return res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

exports.logoutUser = async (req, res) => {
req.session.destroy(()=>{
  res.redirect("/");
});
};

exports.getDashboardPage = async(req,res)=>{
  const user = await User.findOne({
    _id:req.session.userID,
  });
const categories = await Category.find();

  res.status(200).render("dashboard",{
      page_name :"dashboard",
      user,
      categories
  });
}