// services/ai/prompts.js

export function sysEventAssistant() {
    return {
      role: 'system',
      content:
        'Bạn là trợ lý AI cho Hệ thống Quản lý Sự kiện. Trả lời ngắn gọn, rõ ràng, có cấu trúc.',
    };
  }
  
  export function promptEventDescription(title, lang = 'vi') {
    return `Viết mô tả sự kiện cho tiêu đề: "${title}".
  Đầu ra gồm:
  - Tóm tắt 40-60 từ
  - Mục tiêu sự kiện (3-5 bullet)
  - CTA 1 câu
  Ngôn ngữ: ${lang}`;
  }
  
  export function promptTagsFromDesc(description) {
    return `Từ mô tả sau, đề xuất tối đa 5 hashtag và 1 danh mục chính.
  Trả về JSON thuần: {"tags":[], "category":""}
  Mô tả:
  ${description}`;
  }
  
  export function promptRegistrationSummary(answers) {
    return `Tóm tắt câu trả lời đăng ký sau thành 3-5 bullet, nêu nhu cầu đặc biệt và câu hỏi chính.
  Dữ liệu:
  ${answers}`;
  }
  