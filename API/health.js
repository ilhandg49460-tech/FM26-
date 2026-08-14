module.exports = (req,res) => {
  res.status(200).json({
    ok:true,
    service:'FM26+ API',
    version:'V9',
    source:'transfermarkt-datasets R2'
  });
};
