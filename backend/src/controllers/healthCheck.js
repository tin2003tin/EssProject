export const getStatus = async (req, res) => {
  res.status(200).json({ message: "Healthy" });
};
