import { z } from 'zod';
import { INTERNAL_SERVER_ERROR, OK } from '../constants/httpCodes';
import SessionModel from '../models/session.model';
import { catchErrors } from '../utils/catchErrors';
import { appAssert } from '../utils/appAssert';

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

//delete session
export const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = req.params.id;
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId
  });
  //if anything goes wrong, throw an error
  appAssert(deleted, INTERNAL_SERVER_ERROR, 'Failed to remove session');
  return res.status(OK).json({
    message: 'Session removed successfully'
  });
});
