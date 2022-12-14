import prisma from "./database"
import bcrypt from "bcrypt"
const express = require("express")
const app = express()

require("dotenv").config()

const PORT = process.env.PORT

app.use(express.json())

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
            return res.json({ data: "You are LOGGED in" })
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