/**
 * Utility functions for handling API errors in admin pages
 * Provides centralized error handling with user-friendly Vietnamese messages
 */

/**
 * Handles API errors and returns appropriate error messages
 * @param {Error} err - The error object from API call
 * @returns {string} - Formatted error message
 */
export const handleApiError = (err) => {
  let errorMessage = "";
  let statusCode = "";

  if (err.response) {
  
    statusCode = err.response.status;
    const serverMessage = err.response.data?.message || "";

    switch (statusCode) {
      case 400:
        errorMessage = `❌ Lỗi dữ liệu không hợp lệ (${statusCode})\n\nVui lòng kiểm tra lại thông tin và thử lại.`;
        break;
      case 401:
        errorMessage = `🔐 Phiên đăng nhập hết hạn (${statusCode})\n\nVui lòng đăng nhập lại để tiếp tục.`;
        break;
      case 403:
        errorMessage = `🚫 Không có quyền truy cập (${statusCode})\n\nBạn không có quyền thực hiện thao tác này.`;
        break;
      case 404:
        errorMessage = `🔍 Không tìm thấy dữ liệu (${statusCode})\n\nDữ liệu không tồn tại hoặc đã bị xóa.`;
        break;
      case 500:
        errorMessage = `⚠️ Lỗi hệ thống (${statusCode})\n\nHệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.`;
        break;
      default:
        errorMessage = `❗ Có lỗi xảy ra (${statusCode})\n\n${
          serverMessage || "Vui lòng thử lại sau."
        }`;
    }
  } else if (err.request) {
  
    errorMessage = `🌐 Lỗi kết nối mạng\n\nKhông thể kết nối đến server. Vui lòng kiểm tra kết nối internet.`;
  } else {
 
    errorMessage = `❓ Lỗi không xác định\n\n${err.message}`;
  }

  return errorMessage;
};

/**
 * Shows error alert with formatted message
 * @param {Error} err - The error object from API call
 */
export const showErrorAlert = (err) => {
  const errorMessage = handleApiError(err);
  alert(errorMessage);
};

/**
 * Handles delete operation errors with specific messages
 * @param {Error} err - The error object from delete API call
 * @param {string} itemType - Type of item being deleted (e.g., 'sự kiện', 'thành viên')
 * @returns {string} - Formatted error message for delete operations
 */
export const handleDeleteError = (err, itemType = 'mục') => {
  let errorMessage = "";
  let statusCode = "";

  if (err.response) {
    statusCode = err.response.status;
    const serverMessage = err.response.data?.message || "";

    switch (statusCode) {
      case 400:
        errorMessage = `❌ Không thể xóa ${itemType} (${statusCode})\n\n${
          serverMessage || "Dữ liệu không hợp lệ."
        }`;
        break;
      case 401:
        errorMessage = `🔐 Phiên đăng nhập hết hạn (${statusCode})\n\nVui lòng đăng nhập lại để tiếp tục.`;
        break;
      case 403:
        errorMessage = `🚫 Không có quyền xóa (${statusCode})\n\nBạn không có quyền xóa ${itemType} này.`;
        break;
      case 404:
        errorMessage = `🔍 ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} không tồn tại (${statusCode})\n\n${itemType.charAt(0).toUpperCase() + itemType.slice(1)} có thể đã bị xóa trước đó.`;
        break;
      case 500:
        errorMessage = `⚠️ Lỗi hệ thống (${statusCode})\n\nKhông thể xóa ${itemType}. Vui lòng thử lại sau.`;
        break;
      default:
        errorMessage = `❗ Lỗi xóa ${itemType} (${statusCode})\n\n${
          serverMessage || "Vui lòng thử lại."
        }`;
    }
  } else if (err.request) {
    errorMessage = `🌐 Lỗi kết nối\n\nKhông thể kết nối đến server để xóa ${itemType}.`;
  } else {
    errorMessage = `❓ Lỗi không xác định\n\n${err.message}`;
  }

  return errorMessage;
};

/**
 * Shows delete error alert with formatted message
 * @param {Error} err - The error object from delete API call
 * @param {string} itemType - Type of item being deleted
 */
export const showDeleteErrorAlert = (err, itemType = 'mục') => {
  const errorMessage = handleDeleteError(err, itemType);
  alert(errorMessage);
};