const User = require("../models/userModel");

exports.updateProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;

    //get userid from request
    const userId = req.user;

    //find user by id
    const user = await User.findById(userId);

    //update profile picture only if its empty
    //profilePicture (local variable) and user.profilePicture (property of the user object) are falsy
    if (!user.profilePicture && !profilePicture) {
      const initials = name
        ? name
            .split(" ")
            .map((word) => word[0])
            .join("")
        : user.username[0];

      //create profile picture using initials
      // console.log("checking initials", initials);

      user.profilePicture = `https://ui-avatars.com/api/?name=${initials}&background=random`;

      // //create profile picture using initials
      // console.log("Generated profile picture URL:", user.profilePicture);

      //save user
      await user.save();
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );

    // console.log("Request Body:", req.body);

    // console.log("Updated user object:", user);

    //send response
    res.status(200).json({
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile", err);
    res.status(500).json({ message: "Server Error" });
  }
};
