const mongoose = require("mongoose");

const applicationsSchema = new mongoose.Schema(
  {
    user_id:{type:String,required:true},
    appName: { type: String, required: true },
    appDescription: { type: String, required: true },
    appUrl: { type: String},
    appDetails: { type: String },
    appImage:{type:String},
    displayImages: { type: [String] },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const usersModel = mongoose.models.applications || mongoose.model("applications", applicationsSchema);

export default usersModel;
