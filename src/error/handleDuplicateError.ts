
import { TErrorSources, TGenericErrorResponse } from '../interface/error';



const handleDuplicateError = (err : any): TGenericErrorResponse => {

    const match = err.message.match(/"([^"]*)"/);

    const extractMessage = match && match[1]


  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractMessage} is already exist!`,
    },
  ];
  let statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleDuplicateError;
