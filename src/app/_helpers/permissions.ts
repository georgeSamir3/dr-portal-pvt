export function getPermissions(): string[] {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  return permissions;
}

export function isPermissionExist(requiredPermission: string): boolean {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  if(permissions) {
    return permissions.find(
      p => p.toLowerCase() == requiredPermission.toLowerCase()
    );
  }

}
