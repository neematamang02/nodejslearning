import User from "../models/userModel.js"

export const finduserbyemail = (email) => {
    return User.findOne({ email });
};
export const Createuser = (data) => {
    return User.create(data);
};

export const listuser = (query) => {
    return User.find(query);
};
export const finduserbyId = (id) => {
    return User.findById(id);
};
export const updateuser = (id, data) => {
    return User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
};

export const deleteuser = (id) => {
    return User.findByIdAndDelete(id);
};