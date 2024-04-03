import News from "../db/models/News";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

const getNews = async (req: Request, res: Response) => {
  try {
    const response = await News.findAll();
    return res.status(200).send({
      status: 200,
      message: "get all news success",
      data: response,
    });
  } catch (error: any) {
    return res.status(500).send({
      status: 500,
      message: error.message,
      error: error,
    });
  }
};

const getNewsById = async (req: Request, res: Response) => {
  try {
    const response = await News.findOne({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({
      status: 200,
      message: "get news success",
      data: response,
    });
  } catch (error: any) {
    return res.status(500).send({
      status: 500,
      message: error.message,
      error: error,
    });
  }
};

const createNews = (req: Request, res: Response) => {
  if (req.files === undefined || req.files === null) {
    return res.status(400).json({ msg: "No File Uploaded" });
  }
  const header = req.body.header;
  const subHeader = req.body.subHeader;
  const fileOrFiles = req.files.file;
  const filesArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  for (const file of filesArray) {
    const fileSize = file.size;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        const news = await News.create({
          header: header,
          subHeader: subHeader,
          image: fileName,
          url: url,
        });
        return res.status(201).send({
          status: 201,
          message: "create news success",
          data: news,
        });
      } catch (error: any) {
        return res.status(500).send({
          status: 500,
          message: error.message,
          error: error,
        });
      }
    });
  }
};

export default {
  getNews,
  getNewsById,
  createNews,
};
