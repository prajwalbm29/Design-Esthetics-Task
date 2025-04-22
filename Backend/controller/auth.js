const userModel = require('../model/user');
const otpModel = require('../model/otp')
const fs = require('fs');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const registercontroller = async (req, res) => {
    const { email, name, phone, address, password } = req.fields;
    const { photo } = req.files;

    // Validation
    if (!name) return res.status(400).json({ success: false, message: "User name is required." });
    if (!email) return res.status(400).json({ success: false, message: "User email is required." });
    if (!phone) return res.status(400).json({ success: false, message: "User phone number is required." });
    if (!address) return res.status(400).json({ success: false, message: "User address is required." });
    if (!password) return res.status(400).json({ success: false, message: "User password is required." });
    if (!photo) return res.status(400).json({ success: false, message: "User photo is required." });

    try {
        // Check existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new userModel({
            ...req.fields,
            password: hashedPassword
        });

        if (photo) {
            if (photo.size > 2000000) {
                return res.status(400).json({
                    success: false,
                    message: "Photo should be less than 2MB."
                });
            }

            user.photo.data = fs.readFileSync(photo.path);
            user.photo.contentType = photo.type;
        }

        const newUser = await user.save();

        const userData = newUser.toObject();
        delete userData.photo;
        delete userData.password;

        res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: userData
        });
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ success: false, message: "Failed to created user.", error: error.message });
    }
}

const accessPhotoController = async (req, res) => {
    try {
        const userPhoto = await userModel.findById(req.params.id).select("photo");
        if (!userPhoto.photo.data) {
            res.status(404).json({ success: false, message: "Image not found." });
        }
        res.set("Content-type", userPhoto.photo.contentType);
        res.status(200).send(userPhoto.photo.data);
    } catch (error) {
        console.log("Error in fetching user photo", error);
        res.status(500).json({ success: false, message: "Failed to access photo." });
    }
}

const loginController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ success: false, message: "Email and password are required." });
    }
    try {
        const findUser = await userModel.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ success: false, message: "Register before login." });
        }
        const match = bcrypt.compareSync(password, findUser.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
        const token = JWT.sign({ _id: findUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({
            success: true,
            message: "Login successfull.",
            user: { _id: findUser._id, name: findUser.name, email: findUser.email, address: findUser.address, phone: findUser.phone, isAdmin: findUser.isAdmin },
            token,
        });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ success: false, message: "Failed to login.", error: error.message });
    }
}

const verifyUserController = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Verification successful." });
    } catch (error) {
        console.log("Error in verifying the login", error);
        res.status(500).json({ success: false, message: "Failed to verify the login.", error: error.message });
    }
}

const generateOtpController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Registered email is required"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP for", email, ":", otp);

        // Delete any existing OTPs for this user
        await otpModel.deleteMany({ userId: user._id });

        // Create and save new OTP
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 60 * 1000);

        await new otpModel({
            userId: user._id,
            otp: hashedOtp,
            expiresAt
        }).save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2D89EF;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You requested to reset your password. Here is your OTP:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h3 style="margin: 0; font-size: 24px; color: #2D89EF;">${otp}</h3>
                    </div>
                    <p>This OTP is valid for 1 minutes. Do not share it with anyone.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>Design Esthetics Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            expiresAt
        });

    } catch (error) {
        console.error("Error in generateOtpController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate OTP",
            error: error.message
        });
    }
};

const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const otpRecord = await otpModel.findOne({
            userId: user._id
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or invalid"
            });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // OTP verified successfully
        await otpModel.deleteOne({ _id: otpRecord._id });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error("Error in verifyOtpController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP",
            error: error.message
        });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Error in resetPasswordController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: error.message
        });
    }
};

const updateProfileController = async (req, res) => {
    const { email, name, address, password } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please register first."
            });
        }

        const updates = {};
        if (name) updates.name = name;
        if (address) updates.address = address;

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters"
                });
            }
            updates.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to update profile"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error in updateProfileController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const fetchUsersController = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-photo -password");
        res.status(200).json({ success: true, message: "Users fetched successfully.", users });
    } catch (error) {
        console.log("Error in fetching users", error);
        res.status(500).json({ success: false, message: "Server Error.", error: error.message });
    }
}

const deleteUserController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        console.log("Error in deleting the user", error);
        res.status(500).json({ success: false, message: "Server Error in user deletion.", error: error.message });
    }
}

module.exports = {
    registercontroller,
    accessPhotoController,
    loginController,
    verifyUserController,
    generateOtpController,
    verifyOtpController,
    resetPasswordController,
    updateProfileController,
    fetchUsersController,
    deleteUserController,
};