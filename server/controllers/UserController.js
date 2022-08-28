import UserModel from "../models/userModel.js";

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
// Get a User
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a User's friends
export const getUserFriends = async (req, res) => {
  const { id } = req.params.id;

  try {
    const user = await UserModel.findById(id);
    
    let users = await UserModel.find({username:'john@gmail.com'});

    // users = users.map((user)=>{
    //   const {password, ...otherDetails} = user._doc
    //   return otherDetails
    // })
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {

  try {
    let users = await UserModel.find();
    users = users.map((user)=>{
      const {password, ...otherDetails} = user._doc
      return otherDetails
    })
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// udpate a user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  // console.log("Data Received", req.body)
  const { _id, currentUserAdmin, password } = req.body;
  
  if (id === _id) {
    try {
      // if we also have to update password then password will be bcrypted again
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      // have to change this
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWTKEY,
        { expiresIn: "1h" }
      );
      // console.log({user, token})
      res.status(200).json({user, token});
    } catch (error) {
      console.log("Error")
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can update only your own Account.");
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdmin } = req.body;

  if (currentUserId == id || currentUserAdmin) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Access Denied!");
  }
};

// Follow a User
// changed
export const followUser = async (req, res) => {

 
  const id = req.params.id;
  const { _id } = req.body;
  console.log(id, _id)
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const user = await UserModel.findById(_id);
      const toUser = await UserModel.findById(id);

      if (!user.following.includes(id)) {
        await user.updateOne({ $push: { following: id } });
        await toUser.updateOne({ $push: { followers: _id } });
        
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWTKEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({user, token});
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
};

// Unfollow a User
// changed
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const user = await UserModel.findById(_id)
      const toUser = await UserModel.findById(id)

      if (user.following.includes(id))
      {
        await user.updateOne({$pull : {following: id}})
        await toUser.updateOne({ $pull: { followers: _id } })
        
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWTKEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({user, token})
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};

// Ask a user to be friend

export const sendFriendRequest = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  console.log(id, _id)
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const fromUser = await UserModel.findById(id);
      const toUser = await UserModel.findById(_id);

      if (!user.followers.includes(_id)) {
        await user.updateOne({ $push: { following: id } });
        await toUser.updateOne({ $push: { followers: _id } });
        res.status(200).json({user});
      } else {
        res.status(403).json("You are already friend with this user");
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
};


export const getFriendRequest = async (req, res) => {
  const { id } = req.params.id;

  try {
    const user = await UserModel.findById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};


// stop to demand a user to be friend

export const cancelFriendRequest = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const user = await UserModel.findById(id)
      const toUser = await UserModel.findById(_id)

      if (user.followers.includes(_id))
      {
        await user.updateOne({$pull : {following: id}})
        await toUser.updateOne({$pull : {followers: _id}})
        res.status(200).json({user})
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};

// Unfriend a User

export const deniedFriendRequest = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const user = await UserModel.findById(id)
      const toUser = await UserModel.findById(_id)


      if (user.followers.includes(_id))
      {
        await user.updateOne({$pull : {followers: _id}})
        await toUser.updateOne({$pull : {following: id}})
        res.status(200).json({user})
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};
// delete a friend