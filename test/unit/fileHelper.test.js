import {
  describe,
  test,
  expect,
  jest
} from "@jest/globals"
import fs from "fs"
import FileHelper from "../../src/fileHelper.js"

describe("#File Helper", () => {

  describe("#getFileStatus", () => {
    test("It should return files statuses incorrect format", async () => {

      const statMock = {
        dev: 14,
        mode: 33279,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 512,
        ino: 12666373952080156,
        size: 70557,
        blocks: 160,
        atimeMs: 1631227281658.37,
        mtimeMs: 1631226003053.255,
        ctimeMs: 1631226003053.255,
        birthtimeMs: 1631226003053.255,
        atime: "2021-09-09T22:41:21.658Z",
        mtime: "2021-09-09T22:20:03.053Z",
        ctime: "2021-09-09T22:20:03.053Z",
        birthtime: "2021-09-09T22:20:03.053Z"
      }

      const mockUser = "emanuelfacundo"
      process.env.USER = mockUser
      const filename = "file.png"

      jest.spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename])

      jest.spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock)

      const result = await FileHelper.getFileStatus("/tmp")

      const expectedResult = [
        {
          size: "70.6 kB",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename
        }
      ]

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
      expect(result).toMatchObject(expectedResult)
    })
  })
})