const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    name:{type:String,required:true},
    roles: { type: [String], default: ['user'] },
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const usersModel = mongoose.models.user || mongoose.model("user", usersSchema);

export default usersModel;
