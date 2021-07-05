declare namespace Express {

    interface Request {
      userInfo: {email: string, userId: string}
    }
  }