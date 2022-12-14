import prisma from "./database"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const express = require("express")
const app = express()

require("dotenv").config()

const PORT = process.env.PORT

const authenticiate = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (token === null) {
        res.status(401)
        return res.json({ message: "Sorry, you don't have access" })
    }
    else {
        // we will verify the token
        try {
            const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.user = payload
            console.log(payload)
            res.status(200)
            next()
            return

        } catch (err) {
            res.status(401)
            return res.json({ message: "Sorry, you don't have access" })
        }
    }
}

app.use(express.json())

app.get("/users", authenticiate, async (req, res, next) => {
    const users = await prisma.user.findMany();

    // console.log(users)
    const names = users.map(({ name }) => {
        return {
            name
        }
    })

    console.log(names)
    res.status(200)
    return res.json({ data: names })
})

app.post("/signup", async (req, res, next) => {
    // we have to create a new user

    const user = await prisma.user.findUnique({
        where: {
            name: req.body.name,
        }
    })

    if (user === null) {

        // hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(req.body.password)
        console.log(hashedPassword)
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                password: hashedPassword


            }
        })
        res.send({ data: user })

    }
    else {
        res.status(400)
        res.json({ data: "User already Exist" })
    }




})

app.post("/login", async (req, res) => {

    const user = await prisma.user.findUnique({
        where: {
            name: req.body.name,
        }
    })

    if (user === null) {
        res.status(400)
        return res.json({ data: "User DOES NOT Exist" })
    }
    else {
        const hashedPassword = user.password;
        console.log(req.body.password)
        console.log(hashedPassword)
        const isValid = await bcrypt.compare(req.body.password, hashedPassword)

        if (isValid) {
            res.status(200)
            //create a JWT token
            const token = generateAccessToken(user);

            return res.json({ data: "You are LOGGED in", accesstoken: token })

        }
        else {
            res.status(400)
            return res.json({ data: "Don't try to Trick Me" })
        }

    }

})

app.post("/logout", (req, res) => {


})

app.listen(PORT, () => {
    console.log(`Express Server listening on Port: ${PORT}`)
})

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}
