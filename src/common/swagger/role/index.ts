export enum Description {
  findAllRoles = `
    Получение всех ролей: возвращает список всех доступных ролей.
    Требуется роль admin
    `,
  findOneRole = `
    Получение одной роли: возвращает информацию о роли по её UUID.
    Требуется роль admin
    `,
  createRole = `
    Создание новой роли: передаем данные для создания роли.
    Требуется роль admin
    `,
  updateRole = `
    Обновление роли: передаем данные для обновления роли по её UUID.
    Требуется роль admin
    `,
  deleteRole = `
    Удаление роли: удаляет роль по её UUID.
    Требуется роль admin
    `,
}

export enum Summary {
  findAllRoles = 'Получение всех ролей',
  findOneRole = 'Получение одной роли',
  createRole = 'Создание роли',
  updateRole = 'Обновление роли',
  deleteRole = 'Удаление роли',
}
