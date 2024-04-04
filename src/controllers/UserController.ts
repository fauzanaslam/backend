import { Request, Response } from "express";
import User from "../db/models/User";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

const Register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    let existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
    });

    return res.status(201).send({
      status: 201,
      message: "OK",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).send({
      status: 500,
      message: error.message,
      error: error,
    });
  }
};

const UserLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: "User belum terdaftar" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).send({
        status: 401,
        message: "Unauthorized",
      });
    }

    const token = jwt.sign(
      { userEmail: user.email },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
      sameSite: "none",
    });

    res.status(200).json({ userId: user.id, userEmail: user.email });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const userLogout = async (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).send({
    status: 200,
    message: "Logout Berhasil",
  });
};

const UserDetail = async (req: Request, res: Response) => {
  try {
    // Mendapatkan token dari cookie
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    // Verifikasi token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as { userEmail: string };
    const userEmail = decodedToken.userEmail;

    // Cari user berdasarkan email yang terdapat dalam token
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Mengembalikan data user
    return res.status(200).json({
      userId: user.id,
      userName: user.username,
      userEmail: user.email,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const validateToken = (req: Request, res: Response) => {
  res.status(200).send({ userEmail: req.userEmail });
};

export default { Register, UserLogin, userLogout, UserDetail, validateToken };
