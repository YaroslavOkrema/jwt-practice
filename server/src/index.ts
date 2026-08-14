import jwt from "jsonwebtoken";
import express from "express";
import type { NextFunction, Request, Response } from "express";

const user = {
    id: 1,
    email: "test@gmail.com",
    password: "123456",
}

type LoginBody = {
    email: string;
    password: string;
};

const app = express();
app.use(express.json());

const PORT = 3000;
const ACCESS_TOKEN_SECRET = "my-super-secret";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        jwt.verify(token, ACCESS_TOKEN_SECRET);

        return res.json({
            id: user.id,
            email: user.email,
        });
    } catch {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
})

app.post("/login", (req, res) => {
    const body = req.body as LoginBody;

    if (body.email !== user.email || body.password !== user.password) {
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }

    const accessToken = jwt.sign({
        userId: user.id,
        email: user.email,
    }, ACCESS_TOKEN_SECRET);

    res.json({
        accessToken,
    })
})

app.get("/me", authMiddleware, (req, res) => {
    return res.json({
        id: user.id,
        email: user.email,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})