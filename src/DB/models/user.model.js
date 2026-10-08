import mongoose from "mongoose";
import { GenderEnum, providerEnum, roleEnum } from "../../common/enum/user.enum.js";

const usersSchema = new mongoose.Schema(
  {
  fname: { type: String, required: true , trim: true , minlength:2, maxlength:15,
  }, 
  lname: { type: String, required: true , trim: true , minlength:2, maxlength:15,
  }, 
  email: { type: String, unique: true, required: true , trim:true , lowercase: true },
  password: { type: String,required: function() {
    return this.provider === providerEnum.SYSTEM ? true : false;
  } , trim: true },
  age: { type: Number,required: function() {
    return this.provider === providerEnum.SYSTEM? true : false; } , min: 20,
    max: 60 },
    gender: {
        type:String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.male
    },

    role: {
        type:String,
        enum: Object.values(roleEnum),
        default: roleEnum.user
    },
 profileImage: String ,
phone: { type: String, trim: true },
 provider:{
    type: String,
    enum: Object.values(providerEnum),
    default: providerEnum.SYSTEM
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