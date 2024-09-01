import prisma from "../../../shared/prisma";

const registerParticipantIntoDB = async (payload: any) => {
  const createdPostData = await prisma.participant.create({
    data: payload,
  });
  return createdPostData;
};

export const ParticipantServices = {
  registerParticipantIntoDB,
};
