import { UserRole } from '@/hooks/useLogin'
export const UserRoleEmojiStyle = ({ role }: { role?: UserRole }) => {

  return <div className='flex justify-normal items-end'>
    <span className='text-2xl'>
      {role === UserRole.USER && <>🙍🏻‍♂️</>}
      {role === UserRole.MANAGER && <>👨🏻‍💼</>}
      {role === UserRole.ADMIN && <>👑</>}
      {role === UserRole.DEVELOPER && <>😎</>}
    </span>
    <span>{` `} {role || ''}</span>
  </div>
}

export default UserRoleEmojiStyle