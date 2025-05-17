import { asyncHandler } from "@repo/utils";

export const loginWithGitHub = asyncHandler(async (req, resp) => {
  const email = (req as any).user.emails[0].value;
  console.log(req.user  );
  resp.json({
    message: "Login successful",
  });
});
