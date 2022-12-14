import prisma from "./database"

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
            password: req.body.password
        }
    })

    if (user === null) {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,


            }
        })
        res.send({ data: user })

    }
    else {
        res.json({ data: "User already Exist" })
    }



    // try {

    //     const user = await prisma.user.findUnique({
    //         where: {
    //             name: req.body.username
    //         }
    //     })
    // } catch (err) {
    //     return res.json({ errors: err })

    // }

})

app.post("/login", (req, res) => {

})

app.post("/logout", (req, res) => {

})

app.listen(PORT, () => {
    console.log(`Express Server listening on Port: ${PORT}`)
})