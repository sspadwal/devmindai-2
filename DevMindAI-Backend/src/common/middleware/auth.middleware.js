const attachAuthContext = (req, res, next) => {
  const authHeader = req.get('authorization') || req.get('Authorization')
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null
  const userIdHeader =
    req.get('x-user-id') || req.get('X-User-ID') || req.get('X-User-Id')
  const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader

  req.auth = {
    bearerToken,
    userId: bearerToken ? userId || null : null,
    headers: {
      authorization: authHeader || null,
      'x-user-id': userId || null,
    },
  }

  req.userId = req.auth.userId

  next()
}

const requireAuth = (req, res, next) => {
  const { bearerToken, userId } = req.auth || {}

  if (!bearerToken) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
    })
  }

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User identity required. Please log in.',
    })
  }

  next()
}

export { attachAuthContext, requireAuth }
