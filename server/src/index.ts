import express from "express";

type LoginBody = {
    email: string;
    password: string;
};

const app = express();
app.use(express.json());

const PORT = 3000;

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
})

app.post("/login", (req, res) => {
    const body = req.body as LoginBody;

    res.json({
        email: body.email,
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})