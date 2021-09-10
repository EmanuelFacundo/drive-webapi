import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

import FileHelper from "./fileHelper.js"
import { logger } from "./logger.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultDownloadsFolder = resolve(__dirname, "../", "downloads")

export default class Routes {
  io

  constructor(downloadsFolder = defaultDownloadsFolder) {
    this.downloadsFolder = downloadsFolder
    this.fileHelper = FileHelper
  }

  setSocketInstance(io) {
    this.io = io
  }

  async defaultRouter(req, res) {
    res.end("Hello my friend")
  }

  async options(req, res) {
    res.writeHeader(204)
    res.end()
  }

  async post(req, res) {
    logger.info("post")
    res.end()
  }

  async get(req, res) {
    const files = await this.fileHelper.getFileStatus(this.downloadsFolder)

    logger.info("get")
    res.writeHeader(200)
    res.end(JSON.stringify(files))
  }

  handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    const chosen = this[req.method.toLowerCase()] || this.defaultRouter

    return chosen.apply(this, [req, res])
  }
}