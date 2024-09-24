import fs from "fs";

const fsPromises = fs.promises;

async function log(logData) {
  try {
    logData = `\n ${new Date().toString()} - ${logData}}`;
    await fsPromises.appendFile("log.txt", logData);
  } catch (error) {
    console.log(error);
  }
}

const loggerMiddleware = async (req, res, next) => {
  // Log the body of request coming from client

  if (!req.url.includes("signin")) {
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    console.log(logData);
    await log(logData);
  }

  next();
};

export default loggerMiddleware;
