import { isSpoofedBot } from "@arcjet/inspect";
import { aj } from "../config/arcjet.js";

export const arcjetMiddleware = async (req, res, next) => {
  try {
    if (req.auth && req.auth.userId) {
      return next();
    }

    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Bot access denied",
          message: "Automated requests are not allowed.",
        });
      }

      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied by security policy.",
      });
    }

    return next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    return next();
  }
};
