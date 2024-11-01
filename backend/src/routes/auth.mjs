import { Router } from "express";

const authRouter = Router();

/**
 * @openapi
 * /login:
 *   post:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
authRouter.post("/login", (req, res, next) => {
  const parseResult = loginSchema.safeParse(body);

  if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error }, { status: 400 });
  }

  const dbConnection = await connectToDb();
  if (!dbConnection.success) {
      return NextResponse.json(
          { error: dbConnection.error },
          { status: 500 }
      );
  }

  const existingUser = await User.findOne({
      username: parseResult.data.username,
  }).exec();
  if (!existingUser) {
      return NextResponse.json(
          { error: "Invalid username and password combination." },
          { status: 401 }
      );
  }

  const passwordMatch = compareSaltedHash(
      parseResult.data.password,
      existingUser.password
  );
  if (!passwordMatch) {
      return NextResponse.json(
          { error: "Invalid username or password." },
          { status: 401 }
      );
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1").split(
      ","
  )[0];
  const userAgent = request.headers.get("user-agent");

  const session = new Session({
      username: parseResult.data.username,
      ip,
      userAgent,
      started: new Date(),
      expires: addMinutes(new Date(), 30),
  });

  await session.save();

  cookies().set("id", session.id, {
      secure: true,
      expires: session.expires,
      httpOnly: true,
      sameSite: "strict",
  });
  return NextResponse.json(
      { message: "Logged in successfully." },
      { status: 200 }
  );
});

export default authRouter;
