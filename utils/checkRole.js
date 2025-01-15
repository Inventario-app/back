// utils/checkRole.js

export const checkRole = (requiredRole) => {
  return (request, h) => {
    const { role } = request.auth.credentials; // Accessing the role from JWT payload
    if (role !== requiredRole) {
      return h
        .response({
          error: "Sorry sir your rank in the guild is not prominent enough",
        })
        .code(403)
        .takeover();
    }
    return h.continue;
  };
};
