import Link from 'next/link'
import React from "react"
// import I404Png from "@/images/404-notfound.png"
// import Image from "next/image"
// import Button from "@/shared/Button"

const Page404 = () => (
    <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
      <header className="text-center w-full mx-auto space-y-2">
        <div className='flex justify-center'>
        {/* <Image src={I404Png} alt="not-found" /> */}
        </div>
        <span className="block text-sm text-neutral-800 dark:text-neutral-200 tracking-wider ">
          {`Page not found`}{" "}
        </span>
        <div className="pt-8">
          <Link href="/" className='text-4xl' >⬅️</Link>
        </div>
      </header>
    </div>
)

export default Page404
