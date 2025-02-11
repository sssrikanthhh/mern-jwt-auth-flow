import { OK } from '../constants/httpCodes';
import SessionModel from '../models/session.model';
import { catchErrors } from '../utils/catchErrors';

export const getSessionsHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  //get the sessions of the user
  const sessions = await SessionModel.find(
    {
      userId,
      expiresAt: { $gt: new Date() }
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1
    },
    {
      sort: { createdAt: -1 }
    }
  );

  return res.status(OK).json(
    sessions.map(session => ({
      ...session.toObject(),
      ...(req.sessionId === session.id && {
        isCurrent: true
      })
    }))
  );
});
