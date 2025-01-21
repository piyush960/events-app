const errHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;

  return res.status(statusCode).json({
      success: false,
      message: err?.message,
      stack : process.env.NODE_ENV === 'development' ? err?.stack : null,
  })
}

export default errHandler