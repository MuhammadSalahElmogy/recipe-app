const jwt = require("jsonwebtoken");
const blacklistedTokens = require("../middleware/blacklistedTokens");


module.exports = function (req, res, next) {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  

  if (!token) return res.sendStatus(401);

  // تحقق من الـ blacklist
  if (blacklistedTokens.has(token)) {
    return res.status(403).json({ message: 'تم تسجيل الخروج. برجاء تسجيل الدخول مرة أخرى.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });






  // const token = req.header["Authorization"];

  // if (!token) return res.status(401).json({ error: "Access denied" });

  // try {
  //   const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (error) {
  //   res.status(400).json({ error: "Invalid token" });
  // }
};
