import { StatusCodes } from 'http-status-codes'

const ErrorHandlerMiddleware = (error, request, response, next) => {
  const defaultError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || 'Something Went Wrong, Try Again Later!',
  }

  response.status(defaultError.statusCode).json({ message: defaultError.message })
}

export default ErrorHandlerMiddleware