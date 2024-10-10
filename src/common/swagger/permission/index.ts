export enum Description {
  findAllPermissions = `
    Получение всех прав: возвращает список всех доступных прав.
		Требуется роль admin
    `,
  findOnePermission = `
    Получение одного права: возвращает информацию о праве по его UUID.
		Требуется роль admin
    `,
}

export enum Summary {
  findAllPermissions = 'Получение всех прав',
  findOnePermission = 'Получение одного права',
}
