//Add error codes for better output to client

const errorCodes = {
    unAuthorized: {
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action."
    },
    invalidId: {
        code: "INVALID_ID",
        message: "Invalid Mongoose ID Provided"
    },
    emailNotVerified: {
        code: "EMAIL_NOT_VERIFIED",
        message: "Email not verified, request a new verification email."
    },
    invalidCategory: {
        code: "INVALID_CATEGORY",
        message: "Invalid Category Provided"
    },
    invalidEventId: {
        code: "INVALID_EVENT_ID",
        message: "Invalid Event ID Provided"
    },
    eventFull: {
        code: "EVENT_FULL",
        message: "Event is full, please try again later"
    },
    alreadyRegistered: {
        code: "ALREADY_REGISTERED",
        message: "You are already registered for this event"
    },
    notRegistered: {
        code: "NOT_REGISTERED",
        message: "You are not registered for this event"
    },
    noSuchTicket: {
        code: "NO_SUCH_TICKET",
        message: "No such ticket exists"
    },
    somethingWentWrong: {
        code: "SOMETHING_WENT_WRONG",
        message: "Something went wrong"
    },
   
}


module.exports = errorCodes;
