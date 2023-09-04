let notificationTitle = {
  default: '',
  danger: 'Error',
  success: 'Success',
  warning: 'Warning',
  info: 'Ngx Toastr',
}

function generateNotificationBody(type, message, toastr, timeOut) {
  toastr.show(
    `
      <span class="alert-icon ni ni-bell-55" data-notify="icon"></span>
      <div class="alert-text">
        <span class="alert-title" data-notify="title">${notificationTitle[type]}</span>
        <span data-notify="message">${message}</span>
      </div>
    `,
    '',
    {
      timeOut: timeOut,
      closeButton: true,
      enableHtml: true,
      tapToDismiss: false,
      titleClass: 'alert-title',
      positionClass: 'toast-top-center',
      toastClass:
        `ngx-toastr alert alert-dismissible alert-${type} alert-notify`,
    }
  );
}

export function showNotification(type, message, toastr, timeOut = 5000) {
  generateNotificationBody(type, message, toastr, timeOut = 5000)
}
