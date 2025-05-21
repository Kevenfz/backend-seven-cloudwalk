export function isAdmin(user: any): boolean {

    return ( user ? user.roleAdmin : false )

}