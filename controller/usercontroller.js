const User = require('../models/user');
const emailverifed = require('..//models/emailverifed');
const sendOTP = require('../sendEmail');
const bcrypt = require('bcrypt')

//Login user
async function loginpage(req, res) {
    try {
        //Send data=true
        return res.status(201).json({ message: "user login sucessfull", data: true })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}
//Get All User
async function getAlluser(req, res) {
    try {
        const user = await User.find();//find user from models
        return res.status(201).json({ message: "user find sucessfull", data: user })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

//Create User
async function singup(req, res) {
    try {
        const { username, email, password, conformpassword } = req.body;
        // Check if user with the same email or username already exists
        const userverfied = await emailverifed.findOne({ email });
        const existingUser = await User.findOne({ email });
        if (userverfied) {
            if (!existingUser && password === conformpassword) {
                // Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Create a new user
                const newUser = new User({
                    username,
                    email,
                    password: hashedPassword,
                });
                await newUser.save();
                return res.status(201).json({ message: 'Signup successful!', action: true, user: newUser });
            }
            return res.status(200).json({ message: 'User already exists.', action: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

//SignIn
async function signin(req, res) {
    try {
        res.status(200).json({
            message: 'Signin successful!',
            data: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

// //OTP sent
async function emailverification(req, res) {
    const { email } = req.body;
    try {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        // Send OTP
        await sendOTP("OTP", email, otp);

        // Find existing email verification record
        const existingEmail = await emailverifed.findOne({ email });
        if (!existingEmail) {
            // Create a new email verification record
            const newEmail = new emailverifed({
                email,
                otp,
                tokenExpiry: Date.now() + 120000 // Set expiry time to 2 minutes from now
            });
            // Save the new email verification record
            await newEmail.save();
            console.log("Email saved successfully!");

            res.status(201).json({ message: 'OTP sent successfully' });
        } else {
            // Update the existing email verification record
            await emailverifed.updateOne(
                { email },
                {
                    otp,
                    tokenExpiry: Date.now() + 120000 // Set expiry time to 2 minutes from now
                }
            );
            res.status(201).json({ message: 'OTP sent successfully' });
        }
    } catch (error) {
        console.log("Error sending OTP:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

//OTP Verfied
async function otpverification(req, res) {
    const { email, otp } = req.body;
    try {
        const emailVerification = await emailverifed.findOne({ email });

        if (!emailVerification) {
            return res.status(200).json({ error: "Regenerate OTP" });
        }

        const currentTimestamp = Date.now();
        if (otp == emailVerification.otp) {
            if (emailVerification.tokenExpiry && emailVerification.tokenExpiry > currentTimestamp) {
                return res.status(201).json({
                    message: "User Verified",
                    data: true
                });
            } else {
                return res.status(200).json({
                    message: "Token Expired",
                    data: false
                });
            }
        }
        return res.status(200).json({
            message: "Wrong OTP",
            data: false
        });
    } catch (error) {
        console.log("Error during OTP verification:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

// SingOut
const signout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(201).json({ message: 'User Logout' });
    });
};

//Handle follower
const follower = async (req, res) => {
    try {
        const { userId, localUser } = req.body;

        // Find the local user and the user to be followed/unfollowed
        const l_User = await User.findById(localUser);
        const user = await User.findById(userId);

        if (l_User.following.includes(userId)) {
            // If the local user is already following the user, unfollow them
            l_User.following.pull(userId);
            await l_User.save();

            user.followers.pull(localUser);
            await user.save();

            return res.status(201).json({ message: "User Unfollow Successful", user: user });
        } else {
            // If the local user is not following the user, follow them
            l_User.following.push(userId);
            await l_User.save();

            user.followers.push(localUser);
            await user.save();

            return res.status(201).json({ message: "User Follow Successful", user: user });
        }
    } catch (error) {
        console.log("Error in follower function:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getfollowers = async (req, res) => {
    try {
        let followers = [];
        const { buttonName, userId } = req.body;
        const user = await User.findById(userId);

        if (buttonName === "Followers") {
            // Retrieve followers of the user
            for (let i = 0; i < user.followers.length; i++) {
                let follower = await User.findById(user.followers[i]);
                followers.push(follower);
            }
        } else {
            // Retrieve users that the user is following
            for (let i = 0; i < user.following.length; i++) {
                let followedUser = await User.findById(user.following[i]);
                followers.push(followedUser);
            }
        }

        res.status(200).json({ message: "Followers Found", followers: followers });
    } catch (error) {
        console.log("Error in getfollowers function:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const contactMail = (req, res) => {
    const { name, email, companyName, message } = req.body.data;
    sendOTP("contact", email, name, companyName, message)
    res.status(201).json({ message: "Email Send Successful" })
}


module.exports = { loginpage, singup, signin, emailverification, otpverification, getAlluser, signout, follower, getfollowers, contactMail }