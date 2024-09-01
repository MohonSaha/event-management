import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ParticipantServices } from "./participant.service";
import { Request, Response } from "express";

const registerParticipant = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);

  const result = await ParticipantServices.registerParticipantIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New event added successfully!",
    data: result,
  });
});

export const ParticipantControllers = {
  registerParticipant,
};
