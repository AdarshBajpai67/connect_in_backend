const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.virtual("avatar").get(function () {
  //get initials based on name else username
  const initials = this.name
    ? this.name
        .split(" ")
        .map((word) => word[0])
        .join("")
    : this.username[0];

  return `https://ui-avatars.com/api/?name=${initials}&background=random`;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
