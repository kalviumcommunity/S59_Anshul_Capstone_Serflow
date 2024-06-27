const redis = require("redis")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.connect()
.then(() => {
  console.log('Connected to Redis')
})
.catch((error) => {
  console.log('Error connecting to Redis', error)
})

const getUserData = async(req,res,next) =>{
    try {
        if (!redisClient.isOpen) {
          console.error('Redis client is not connected')
          return next()
        }

        const token = req.headers.authorization.split(" ")[1];
        const { userId } = jwt.verify(token, process.env.SECRET);
    
        if (!userId) {
          return next()
        }
        const checkCachedData = await redisClient.get(`user:${userId}`);
        if (checkCachedData) {
          console.log('Data retrieved from cache')
        //   console.log(checkCachedData)
          return res.json(JSON.parse(checkCachedData))
        }
        next()
      } 
    
      catch (error) {
        console.error('Could not retrieve data from cache', error)
        next()
      }
      // next()
    }

module.exports = {getUserData, redisClient};