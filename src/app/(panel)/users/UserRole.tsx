
export const UserRole = ({role}:{role?: string}) => {

  return <div className='flex justify-normal items-end'>
    <span className='text-2xl'>
      {role === 'user' && <>🙍🏻‍♂️</>}
      {role === 'manager' && <>👨🏻‍💼</>}
      {role === 'admin' && <>👑</>}
      {role === 'sysadmin' && <>😎</>}
    </span>
    <span>{` `} {role || ''}</span>
  </div>
}

export default UserRole