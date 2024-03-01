"use client"

import React, { FC, Fragment, useState } from 'react'
// import { Dialog, Transition } from '@headlessui/react'
// import { XMarkIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'
// import { aliabiConfig } from 'aliabi'
// import { useLanguage } from '@/hooks/i18n'
// import ButtonPrimary from '@/components/ButtonPrimary'
import Modal1 from "./modal1"

const TestPage = ({ }) => {
  return (<>
    <Head>
      <title>dfgs sd</title>
      <meta name="description" content="This is Tables page for TourAbi Admin Panel" />
    </Head>
    <div>
      <Modal1 />
      test
    </div>
  </>)
}

export default TestPage
