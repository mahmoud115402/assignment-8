import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
  fname: { type: String, required: true , trim: true , minlength:2, maxlength:5,
  }, 
  lname: { type: String, required: true , trim: true , minlenght:2, maxlenght:5,
  }, 
  email: { type: String, unique: true, required: true , trim:true , lowercase: true },
  password: { type: String, required: true , trim: true },
  age: { type: Number,required:true , min: 20,
    max: 60 },
    gender: {
        type:String,
        enum: ["male","female"],
        default:"male"
    },
 profileImage: String ,
phone: { type: String, trim: true },
 provider:{
    type: String,
    enum:["system","google"],
    default:"system"
 },
 isConfirmed: { type: Boolean, default: false }
  },
  {timestamps: true,
    strict: true,
    strictQuery:true,
    toJSON:{virtuals:true},
toObject:{virtuals:true}
  }
);
usersSchema.virtual("username").get(function () {
  return `${this.fname} ${this.lname}`;
});
const usermodel = mongoose.model("user", usersSchema);

export default usermodel;