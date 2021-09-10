import {
  describe,
  test,
  expect,
  jest
} from "@jest/globals"

import Routes from "../../src/routes"

describe("#Routes test suite", () => {
  const defaultParams = {
    req: {
      headers: {
        "Content-type": "multipart/form-data"
      },
      method: "",
      body: {}
    },
    res: {
      setHeader: jest.fn(),
      writeHeader: jest.fn(),
      end: jest.fn()
    },
    values: () => Object.values(defaultParams)
  }

  describe("#setSocketInstance", () => {
    test("setSocket should store io instance", () => {
      const routes = new Routes()

      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => { }
      }

      routes.setSocketInstance(ioObj)
      expect(routes.io).toStrictEqual(ioObj)
    })
  })

  describe("#handler", () => {
    test("Given an inexistent route it should choose default route", async () => {
      const route = new Routes()
      const params = {
        ...defaultParams
      }

      params.req.method = 'inexistent'
      await route.handler(...params.values())

      expect(params.res.end).toHaveBeenCalledWith("Hello my friend")
    })

    test("It should set any request with CORS enable", async () => {
      const route = new Routes()
      const params = {
        ...defaultParams
      }

      params.req.method = 'inexistent'
      await route.handler(...params.values())

      expect(params.res.setHeader).toHaveBeenCalledWith("Access-Control-Allow-Origin", "*")
    })

    test("Given method OPTIONS it should options route", async () => {
      const route = new Routes()
      const params = {
        ...defaultParams
      }

      params.req.method = 'OPTIONS'
      await route.handler(...params.values())

      expect(params.res.writeHeader).toHaveBeenCalledWith(204)
      expect(params.res.end).toHaveBeenCalled()
    })
    test("Given method GET it should options route", async () => {
      const route = new Routes()
      const params = {
        ...defaultParams
      }

      jest.spyOn(route, route.get.name).mockResolvedValue()

      params.req.method = 'GET'
      await route.handler(...params.values())

      expect(route.get).toHaveBeenCalled()
    })

    test("Given method POST it should options route", async () => {
      const route = new Routes()
      const params = {
        ...defaultParams
      }

      jest.spyOn(route, route.post.name).mockResolvedValue()

      params.req.method = 'POST'
      await route.handler(...params.values())

      expect(route.post).toHaveBeenCalled()
    })
  })

  describe("#get", () => {
    test("Given method GET it should list all files downloaded", async () => {
      const route = new Routes()
      const params = {
        ...defaultParams
      }
      const filesStatusesMock = [
        {
          size: "70.6 kB",
          lastModified: "2021-09-09T22:20:03.053Z",
          owner: "emanuelfacundo",
          file: "file.png"
        }
      ]

      jest.spyOn(route.fileHelper, route.fileHelper.getFileStatus.name)
        .mockResolvedValue(filesStatusesMock)

      params.req.method = "GET"
      await route.handler(...params.values())

      expect(params.res.writeHeader).toHaveBeenCalledWith(200)
      expect(params.res.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock))

    })
  })
})