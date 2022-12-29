import Head from 'next/head'
import Image from 'next/image'
import '../styles/Home.module.css'
// import Degree from './degree/[id]'

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  }
}

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* <Degree /> */}
    </div>
  )
}
