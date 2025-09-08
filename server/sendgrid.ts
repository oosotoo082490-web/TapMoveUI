import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SendGrid API key not found in environment variables");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API key is not set');
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    console.log('Email sent successfully to:', params.to);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// 세미나 신청 시 관리자에게 보내는 이메일 템플릿
export function getApplicationNotificationEmail(applicationData: any) {
  const classTypes = [];
  if (applicationData.classTypeInfant) classTypes.push('유아');
  if (applicationData.classTypeElementary) classTypes.push('초등');
  if (applicationData.classTypeMiddleHigh) classTypes.push('중고등');
  if (applicationData.classTypeAdult) classTypes.push('성인');
  if (applicationData.classTypeSenior) classTypes.push('시니어');
  if (applicationData.classTypeRehab) classTypes.push('재활');

  const html = `
    <div style="font-family: 'Noto Sans KR', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🎯 새로운 세미나 신청</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">TAPMOVE 공식 웹사이트에서 새로운 신청이 접수되었습니다.</p>
      </div>
      
      <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📋 신청자 정보</h2>
        
        <div style="display: grid; gap: 12px;">
          <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="width: 120px; color: #374151;">성명:</strong>
            <span style="color: #1f2937;">${applicationData.name}</span>
          </div>
          <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="width: 120px; color: #374151;">생년월일:</strong>
            <span style="color: #1f2937;">${applicationData.birthdate}</span>
          </div>
          <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="width: 120px; color: #374151;">이메일:</strong>
            <span style="color: #1f2937;">${applicationData.email}</span>
          </div>
          <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="width: 120px; color: #374151;">연락처:</strong>
            <span style="color: #1f2937;">${applicationData.phone}</span>
          </div>
          <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="width: 120px; color: #374151;">주소:</strong>
            <span style="color: #1f2937;">${applicationData.address}</span>
          </div>
          <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="width: 120px; color: #374151;">입금자명:</strong>
            <span style="color: #1f2937;">${applicationData.depositorName}</span>
          </div>
        </div>
      </div>

      <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0 0 15px; font-size: 20px; border-bottom: 2px solid #bae6fd; padding-bottom: 10px;">⚙️ 선택 사항</h2>
        
        <div style="display: grid; gap: 12px;">
          <div style="display: flex; padding: 8px 0;">
            <strong style="width: 120px; color: #374151;">유니폼 사이즈:</strong>
            <span style="color: #1f2937;">${applicationData.uniformSize || '선택 안함'}</span>
          </div>
          <div style="display: flex; padding: 8px 0;">
            <strong style="width: 120px; color: #374151;">수업 진행:</strong>
            <span style="color: #1f2937;">${applicationData.classPlan === 'plan' ? '진행 예정' : '하지 않음'}</span>
          </div>
          ${classTypes.length > 0 ? `
          <div style="display: flex; padding: 8px 0;">
            <strong style="width: 120px; color: #374151;">수업 대상:</strong>
            <span style="color: #1f2937;">${classTypes.join(', ')}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div style="background: #fef7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-weight: 500;">💳 입금 계좌: IM뱅크(구 대구은행) 50811-8677704</p>
        <p style="margin: 5px 0 0; color: #92400e; font-size: 14px;">입금자명: ${applicationData.depositorName}</p>
      </div>

      <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>이 이메일은 TAPMOVE 공식 웹사이트에서 자동으로 발송되었습니다.</p>
        <p>신청 승인은 관리자 페이지에서 처리해주세요.</p>
      </div>
    </div>
  `;

  return {
    subject: `[TAPMOVE] 새로운 세미나 신청 - ${applicationData.name}님`,
    html,
    text: `새로운 세미나 신청이 접수되었습니다.\n\n신청자: ${applicationData.name}\n이메일: ${applicationData.email}\n연락처: ${applicationData.phone}\n입금자명: ${applicationData.depositorName}`,
  };
}

// 신청 승인 시 신청자에게 보내는 이메일 템플릿
export function getApplicationApprovalEmail(applicationData: any) {
  const html = `
    <div style="font-family: 'Noto Sans KR', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 신청이 승인되었습니다!</h1>
        <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.9;">TAPMOVE 세미나 참석을 환영합니다</p>
      </div>
      
      <div style="background: #f0fdf4; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #22c55e;">
        <h2 style="color: #15803d; margin: 0 0 15px; font-size: 20px;">✅ 신청 승인 완료</h2>
        <p style="color: #166534; margin: 0; font-size: 16px; line-height: 1.6;">
          안녕하세요 <strong>${applicationData.name}</strong>님,<br/>
          TAPMOVE 세미나 신청이 정상적으로 승인되었습니다.
        </p>
      </div>

      <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="color: #1f2937; margin: 0 0 15px; font-size: 18px;">📅 세미나 안내사항</h3>
        <ul style="color: #374151; line-height: 1.8; padding-left: 20px;">
          <li>세미나 당일 신분증을 지참해주세요</li>
          <li>편안한 운동복 차림으로 참석해주세요</li>
          <li>세미나 시작 10분 전까지 도착해주세요</li>
          <li>추가 문의사항이 있으시면 언제든 연락주세요</li>
        </ul>
      </div>

      <div style="background: #fef7ed; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="color: #92400e; margin: 0 0 10px; font-size: 16px;">📞 문의처</h3>
        <p style="color: #92400e; margin: 0; line-height: 1.6;">
          궁금한 점이 있으시면 언제든 문의해주세요.<br/>
          빠른 시일 내에 답변드리겠습니다.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #059669; font-size: 18px; font-weight: bold; margin: 0;">TAPMOVE 세미나에서 만나뵙겠습니다! 🏃‍♀️</p>
      </div>

      <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>이 이메일은 TAPMOVE에서 자동으로 발송되었습니다.</p>
      </div>
    </div>
  `;

  return {
    subject: `[TAPMOVE] 세미나 신청이 승인되었습니다 - ${applicationData.name}님`,
    html,
    text: `안녕하세요 ${applicationData.name}님,\n\nTAPMOVE 세미나 신청이 정상적으로 승인되었습니다.\n세미나에서 만나뵙겠습니다!\n\n감사합니다.`,
  };
}