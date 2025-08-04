export const generateOtpEmail = (otp: string) => `
  <div style="max-width:500px;margin:auto;border:1px solid #eee;padding:20px;font-family:Arial,sans-serif;">
    <h2 style="color:#0070f3;">Vishraam Verification Code</h2>
    <p>Hello,</p>
    <p>Your One-Time Password (OTP) for verification is:</p>
    <div style="font-size:32px;font-weight:bold;color:#0070f3;margin:20px 0;">${otp}</div>
    <p>This code is valid for the next 10 minutes. Please do not share it with anyone.</p>
    <p style="margin-top:30px;">Thanks,<br />Team Vishraam</p>
  </div>
`;
