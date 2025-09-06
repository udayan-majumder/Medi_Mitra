"use client"

import React from 'react'
import { UserStore } from '@/hooks/userauth.hooks'
import { LanguageStore } from '@/store/Dictionarystore'

 export default function LoginPage() {
  const {LanguageType} = UserStore()
  const {Language} = LanguageStore()
  return (
    <div>this is login page testing {Language?.[LanguageType]?.username} : {LanguageType} language</div>
  )
}

