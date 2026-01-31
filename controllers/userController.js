export const getUser = (req, res) => {
    res.json({ name: "Neema", role: "admin" })
};
export const register = (req, res) => {
    console.log(req.body);
    res.status(201).json({ message: "Registered successfully" });
};
export const secretData = (req, res) => {
  res.send("This is secret data");
};