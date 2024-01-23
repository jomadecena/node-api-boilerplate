const COMMON_EMAIL = ''

export const sendCommonEmail = async (
  to: string[],
  subject: string,
  body: string
) => {
  return new Promise((resolve, reject) => {
    // implement your own email service here
    resolve(true);
  });
}
