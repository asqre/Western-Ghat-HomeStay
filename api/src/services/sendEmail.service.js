import SibApiV3Sdk from "sib-api-v3-typescript";

export const sendEmail = (sendSmtpEmail) => {
  try {
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
      SibApiV3Sdk.AccountApiApiKeys.apiKey,
      process.env.SENDINBLUE_APIKEY
    );
    return apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        return data;
      },
      function (error) {
        console.error("Error details:", error);
        return false;
      }
    );
  } catch (error) {
    return error;
  }
};
